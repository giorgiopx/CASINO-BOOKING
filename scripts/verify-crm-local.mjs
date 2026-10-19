/**
 * Isolated PostgreSQL policy regression test. No network port, remote URL,
 * credentials, or real customer data. Requires Docker. Removes its own test
 * container on completion. Auth's SQL context is simulated, not HTTP sign-in.
 * Run: node scripts/verify-crm-local.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";

const name = `cb-crm-test-${randomUUID().slice(0, 8)}`;
const image =
  "postgres:17-alpine@sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24";
const root = new URL("../", import.meta.url);
const a = "00000000-0000-4000-8000-000000000001";
const b = "00000000-0000-4000-8000-000000000002";
const admin = "00000000-0000-4000-8000-000000000003";
const enquiry = "00000000-0000-4000-8000-000000000004";
let checks = 0;
const docker = (args, input) =>
  execFileSync("docker", args, {
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
const sql = (query) =>
  docker(
    [
      "exec",
      "-i",
      name,
      "psql",
      "-U",
      "postgres",
      "-v",
      "ON_ERROR_STOP=1",
      "-qAt",
    ],
    query,
  ).trim();
const as = (uid, query) =>
  sql(
    `BEGIN; SET LOCAL ROLE authenticated; SET LOCAL request.jwt.claim.sub = '${uid}'; ${query}; COMMIT;`,
  );
const check = (label, fn) => {
  fn();
  checks++;
  console.log(`PASS: ${label}`);
};
const denied = (uid, query, code) => {
  assert.throws(
    () => as(uid, `\\set VERBOSITY verbose\n${query}`),
    (error) => String(error.stderr).includes(code),
  );
};
const apply = (path) => sql(readFileSync(new URL(path, root), "utf8"));

try {
  docker([
    "run",
    "--detach",
    "--rm",
    "--network",
    "none",
    "--name",
    name,
    "-e",
    "POSTGRES_HOST_AUTH_METHOD=trust",
    image,
  ]);
  for (let attempt = 0; ; attempt++) {
    try {
      docker(["exec", name, "pg_isready", "-U", "postgres"]);
      break;
    } catch (error) {
      if (attempt >= 40) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  sql(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
      SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
    $$;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION auth.uid() TO anon, authenticated, service_role;`);
  apply("drizzle/migrations/0000_accounts_enquiries_roles.sql");
  apply("database/0001_secure_grants_and_enquiry_audit.sql");
  apply("supabase/migrations/20261014_travel_crm.sql");
  sql(`INSERT INTO auth.users (id,email,raw_user_meta_data) VALUES
    ('${a}','customer-a@example.test','{"full_name":"Legacy Name"}'),
    ('${b}','customer-b@example.test','{}'),
    ('${admin}','admin@example.test','{}');
    INSERT INTO public.user_roles (user_id,role) VALUES ('${admin}','admin');
    UPDATE public.profiles SET customer_type='business' WHERE id='${b}';`);
  const refBefore = sql(
    `SELECT customer_ref FROM public.profiles WHERE id='${a}'`,
  );
  apply("supabase/migrations/20261018112418_customer_profile_details.sql");
  check("migration preserves legacy full name and customer ID", () => {
    assert.equal(
      sql(`SELECT customer_ref FROM public.profiles WHERE id='${a}'`),
      refBefore,
    );
    assert.equal(
      sql(`SELECT full_name FROM public.profiles WHERE id='${a}'`),
      "Legacy Name",
    );
  });
  check("email is backfilled from Auth", () =>
    assert.equal(
      as(a, "SELECT email FROM public.profiles"),
      "customer-a@example.test",
    ),
  );
  check("each customer sees only their own profile", () => {
    assert.equal(as(a, "SELECT id FROM public.profiles"), a);
    assert.equal(as(b, "SELECT id FROM public.profiles"), b);
  });
  check("admin sees all customers including those without requests", () =>
    assert.equal(as(admin, "SELECT count(*) FROM public.profiles"), "3"),
  );
  check("customer IDs are unique", () =>
    assert.equal(
      as(admin, "SELECT count(DISTINCT customer_ref) FROM public.profiles"),
      "3",
    ),
  );
  check("customer can save own valid individual profile", () => {
    assert.equal(
      as(
        a,
        `UPDATE public.profiles SET first_name='Synthetic',last_name='Customer',full_name='Synthetic Customer',phone='+306990000000',residence='Greece',services=ARRAY['casino','hotel'] WHERE id='${a}' RETURNING first_name`,
      ),
      "Synthetic",
    );
  });
  check("customer cannot change another profile", () =>
    assert.equal(
      as(
        b,
        `UPDATE public.profiles SET first_name='Other' WHERE id='${a}' RETURNING id`,
      ),
      "",
    ),
  );
  check("customer cannot alter stable ID or ownership", () => {
    denied(
      a,
      `UPDATE public.profiles SET customer_ref='CUS-FORGED' WHERE id='${a}'`,
      "42501",
    );
    denied(a, `UPDATE public.profiles SET id='${b}' WHERE id='${a}'`, "42501");
  });
  check("profile email cannot be spoofed by a client", () =>
    denied(
      a,
      `UPDATE public.profiles SET email='spoof@example.test' WHERE id='${a}'`,
      "42501",
    ),
  );
  check("customers cannot grant themselves admin", () =>
    denied(
      a,
      `INSERT INTO public.user_roles(user_id,role) VALUES ('${a}','admin')`,
      "42501",
    ),
  );
  check("business category requires company", () =>
    denied(
      a,
      `UPDATE public.profiles SET customer_type='business' WHERE id='${a}'`,
      "23514",
    ),
  );
  check("business profile with company succeeds", () =>
    assert.equal(
      as(
        a,
        `UPDATE public.profiles SET customer_type='business',company_name='Synthetic Ltd' WHERE id='${a}' RETURNING company_name`,
      ),
      "Synthetic Ltd",
    ),
  );
  check("unsupported, duplicate and null services rejected", () => {
    for (const values of [
      "ARRAY['casino','casino']",
      "ARRAY['unsupported']",
      "ARRAY[NULL]::text[]",
    ]) {
      denied(
        a,
        `UPDATE public.profiles SET services=${values} WHERE id='${a}'`,
        "23514",
      );
    }
  });
  const insert = (extra = "") =>
    `INSERT INTO public.enquiries(id,user_id,name,surname,email,phone,residence,customer_type,destination,start_date,end_date,party,request_type,preference,services${extra ? ",company_name" : ""}) VALUES ('${enquiry}','${a}','Synthetic','Customer','customer-a@example.test','+306990000000','Greece','${extra ? "business" : "individual"}','Monaco','2027-12-10','2027-12-15',2,'introduction','email',ARRAY['casino','flight']${extra ? `,${extra}` : ""})`;
  check("business request without company rejected", () =>
    denied(a, insert("NULL"), "23514"),
  );
  check("request reference and history are generated", () => {
    as(a, insert());
    assert.match(
      as(a, `SELECT ref FROM public.enquiries WHERE id='${enquiry}'`),
      /^CB-/,
    );
    assert.equal(
      as(
        a,
        `SELECT new_status FROM public.enquiry_status_events WHERE enquiry_id='${enquiry}'`,
      ),
      "new",
    );
  });
  check("customer B cannot see customer A request or history", () => {
    assert.equal(as(b, "SELECT count(*) FROM public.enquiries"), "0");
    assert.equal(
      as(b, "SELECT count(*) FROM public.enquiry_status_events"),
      "0",
    );
  });
  check("customers cannot change status including their own", () =>
    assert.equal(
      as(
        a,
        `UPDATE public.enquiries SET status='closed' WHERE id='${enquiry}' RETURNING id`,
      ),
      "",
    ),
  );
  check("admin changes status and history remains customer visible", () => {
    assert.equal(
      as(
        admin,
        `UPDATE public.enquiries SET status='reviewing' WHERE id='${enquiry}' RETURNING status`,
      ),
      "reviewing",
    );
    assert.equal(
      as(
        a,
        `SELECT count(*) FROM public.enquiry_status_events WHERE enquiry_id='${enquiry}' AND new_status='reviewing'`,
      ),
      "1",
    );
  });
  check("admin notes and tasks are invisible to both customers", () => {
    as(
      admin,
      `INSERT INTO public.crm_notes(enquiry_id,author_id,body) VALUES ('${enquiry}','${admin}','Synthetic private note'); INSERT INTO public.crm_tasks(enquiry_id,title) VALUES ('${enquiry}','Synthetic follow-up')`,
    );
    for (const uid of [a, b]) {
      assert.equal(as(uid, "SELECT count(*) FROM public.crm_notes"), "0");
      assert.equal(as(uid, "SELECT count(*) FROM public.crm_tasks"), "0");
      denied(
        uid,
        `INSERT INTO public.crm_notes(enquiry_id,author_id,body) VALUES ('${enquiry}','${uid}','Forbidden')`,
        "42501",
      );
    }
    assert.equal(as(admin, "SELECT count(*) FROM public.crm_notes"), "1");
  });
  check("admin itinerary visible only to owner and admin", () => {
    as(
      admin,
      `INSERT INTO public.itinerary_segments(enquiry_id,service_kind,summary) VALUES ('${enquiry}','hotel','Synthetic proposal')`,
    );
    assert.equal(as(a, "SELECT count(*) FROM public.itinerary_segments"), "1");
    assert.equal(as(b, "SELECT count(*) FROM public.itinerary_segments"), "0");
    denied(
      a,
      `INSERT INTO public.itinerary_segments(enquiry_id,service_kind,summary) VALUES ('${enquiry}','hotel','Forbidden')`,
      "42501",
    );
  });
  check(
    "admin can complete follow-up tasks while customers cannot alter them",
    () => {
      assert.equal(
        as(
          admin,
          `UPDATE public.crm_tasks SET status='done' WHERE enquiry_id='${enquiry}' RETURNING status`,
        ),
        "done",
      );
      for (const uid of [a, b]) {
        assert.equal(
          as(
            uid,
            `UPDATE public.crm_tasks SET status='open' WHERE enquiry_id='${enquiry}' RETURNING id`,
          ),
          "",
        );
        denied(
          uid,
          `INSERT INTO public.crm_tasks(enquiry_id,title) VALUES ('${enquiry}','Forbidden')`,
          "42501",
        );
      }
    },
  );
  check("status history cannot be forged by customers or admins", () => {
    for (const uid of [a, b, admin]) {
      denied(
        uid,
        `INSERT INTO public.enquiry_status_events(enquiry_id,new_status) VALUES ('${enquiry}','closed')`,
        "42501",
      );
    }
  });
  check("admin cannot replace immutable customer reference or email", () => {
    denied(
      admin,
      `UPDATE public.profiles SET customer_ref='CUS-REPLACED' WHERE id='${a}'`,
      "42501",
    );
    denied(
      admin,
      `UPDATE public.profiles SET email='spoof@example.test' WHERE id='${a}'`,
      "42501",
    );
  });
  check("Auth email changes sync without modifying stable customer ID", () => {
    sql(`UPDATE auth.users SET email='updated@example.test' WHERE id='${a}'`);
    assert.equal(
      as(a, "SELECT email FROM public.profiles"),
      "updated@example.test",
    );
    assert.equal(as(a, "SELECT customer_ref FROM public.profiles"), refBefore);
  });
  check("new signup receives generated reference and Auth email", () => {
    const newId = randomUUID();
    sql(
      `INSERT INTO auth.users(id,email) VALUES ('${newId}','new@example.test')`,
    );
    assert.match(
      as(newId, "SELECT customer_ref FROM public.profiles"),
      /^CUS-[A-F0-9]{32}$/,
    );
    assert.equal(
      as(newId, "SELECT email FROM public.profiles"),
      "new@example.test",
    );
  });
  check("anonymous access to personal records denied", () =>
    assert.throws(() => sql("SET ROLE anon; SELECT * FROM public.profiles")),
  );
  console.log(
    `SUCCESS: ${checks} isolated PostgreSQL checks. Supabase Auth/API staging E2E still required.`,
  );
} finally {
  try {
    docker(["rm", "--force", name]);
  } catch {
    /* Container may not have started. */
  }
}
