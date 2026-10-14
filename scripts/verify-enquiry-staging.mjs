/**
 * CasinoBooking staging E2E data-isolation probe.
 * Run only against a dedicated staging Supabase project with synthetic users.
 * Never pass production customer credentials here.
 *
 * Required env:
 * STAGING_CONFIRMED=YES
 * SUPABASE_URL, SUPABASE_ANON_KEY
 * TEST_CUSTOMER_A_EMAIL, TEST_CUSTOMER_A_PASSWORD
 * TEST_CUSTOMER_B_EMAIL, TEST_CUSTOMER_B_PASSWORD
 * TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD
 *
 * Accounts must already exist and be email verified. Admin account must
 * already possess admin role assigned by a trusted operator (not this script).
 */
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";

const required = [
  "SUPABASE_URL", "SUPABASE_ANON_KEY",
  "TEST_CUSTOMER_A_EMAIL", "TEST_CUSTOMER_A_PASSWORD",
  "TEST_CUSTOMER_B_EMAIL", "TEST_CUSTOMER_B_PASSWORD",
  "TEST_ADMIN_EMAIL", "TEST_ADMIN_PASSWORD",
];
if (process.env.STAGING_CONFIRMED !== "YES") {
  console.error("STOP: set STAGING_CONFIRMED=YES for a DEDICATED TEST database only.");
  process.exit(2);
}
for (const k of required) {
  if (!process.env[k]) { console.error("STOP: missing staging secret", k); process.exit(2); }
}
if (!process.env.SUPABASE_URL.startsWith("https://")) {
  console.error("STOP: SUPABASE_URL must be https."); process.exit(2);
}
const source = () => createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY,{
  auth:{autoRefreshToken:false,persistSession:false,detectSessionInUrl:false}
});
async function signIn(label,email,password) {
  const api=source();
  const {data,error}=await api.auth.signInWithPassword({email,password});
  if(error || !data?.user || !data.session) throw new Error(label+" sign-in failed: "+(error?.message||"no session"));
  return {api,user:data.user};
}
const assert = (ok,text)=>{if(!ok)throw Error("FAIL: "+text); console.log("PASS:",text);};
let customerA,customerB,admin;
try {
  customerA=await signIn("A",process.env.TEST_CUSTOMER_A_EMAIL,process.env.TEST_CUSTOMER_A_PASSWORD);
  customerB=await signIn("B",process.env.TEST_CUSTOMER_B_EMAIL,process.env.TEST_CUSTOMER_B_PASSWORD);
  admin=await signIn("admin",process.env.TEST_ADMIN_EMAIL,process.env.TEST_ADMIN_PASSWORD);
  assert(customerA.user.id!==customerB.user.id,"two customer accounts isolated by auth IDs");
  const [aProfile,bProfile]=await Promise.all([
    customerA.api.from("profiles").select("id,customer_ref").eq("id",customerA.user.id).single(),
    customerB.api.from("profiles").select("id,customer_ref").eq("id",customerB.user.id).single(),
  ]);
  assert(!aProfile.error && !!aProfile.data?.customer_ref, "Customer A generated unique reference");
  assert(!bProfile.error && !!bProfile.data?.customer_ref, "Customer B generated unique reference");
  assert(aProfile.data.customer_ref!==bProfile.data.customer_ref,"customer refs are distinct");
  const others=await customerB.api.from("profiles").select("id").eq("id",customerA.user.id);
  assert(!others.error && (others.data||[]).length===0,"Customer B cannot see Customer A profile");
  const adminRole=await admin.api.from("user_roles").select("role").eq("user_id",admin.user.id).eq("role","admin").maybeSingle();
  assert(!adminRole.error && adminRole.data?.role==="admin","admin role exists and is visible to admin");

  const marker="STAGING-TEST-"+randomUUID().slice(0,8);
  const insert=await customerA.api.from("enquiries").insert({
    user_id:customerA.user.id,
    name:"Synthetic",surname:"Customer",email:process.env.TEST_CUSTOMER_A_EMAIL,
    phone:"+302100000000",residence:"Greece",customer_type:"individual",
    destination:"Bellagio Las Vegas",start_date:"2026-12-10",end_date:"2026-12-15",
    party:2,request_type:"group",message:marker,preference:"email",
    services:["casino","flight","hotel","transfer"],
    trip_preferences:{flightOrigin:"ATH",flightDestination:"LAS",hotelCategory:"5-star"},
  }).select("id,ref,status,user_id,destination,party,services").single();
  if(insert.error)throw Error("Enquiry insert failed: "+insert.error.message);
  const enquiry=insert.data;
  assert(!!enquiry.ref && enquiry.status==="new" && enquiry.user_id===customerA.user.id,
    "DB created tracked enquiry reference for customer A");
  assert(enquiry.party===2 && enquiry.services?.includes("hotel"),"travel request details stored");
  const own=await customerA.api.from("enquiries").select("ref,message").eq("id",enquiry.id).single();
  assert(!own.error && own.data?.message===marker,"customer A dashboard can retrieve own enquiry");
  const forbidden=await customerB.api.from("enquiries").select("id").eq("id",enquiry.id);
  assert(!forbidden.error && (forbidden.data||[]).length===0,"customer B cannot see customer A request");
  const adminRead=await admin.api.from("enquiries").select("id,ref,destination,party,status").eq("id",enquiry.id).single();
  assert(!adminRead.error && adminRead.data?.ref===enquiry.ref,"admin CRM reads request and traveler count");
  const denied=await customerB.api.from("enquiries").update({status:"reviewing"}).eq("id",enquiry.id).select("id");
  assert(!!denied.error || !denied.data?.length,"customer B cannot change customer A request");
  const changed=await admin.api.from("enquiries").update({status:"reviewing"}).eq("id",enquiry.id).select("status").single();
  assert(!changed.error && changed.data?.status==="reviewing","admin can update request status");
  const event=await admin.api.from("enquiry_status_events").select("new_status").eq("enquiry_id",enquiry.id).order("changed_at",{ascending:false}).limit(1);
  assert(!event.error && (event.data||[]).some(x=>x.new_status==="reviewing"),"status change recorded in audit trail");
  console.log("SUCCESS: synthetic staging request",enquiry.ref);
  console.log("NOTE: synthetic test record remains in staging for inspection; do not use real personal data.");
} catch(err) {
  console.error("STAGING E2E FAILED:",err?.message||String(err));
  process.exitCode=1;
} finally {
  await Promise.all([customerA,customerB,admin].filter(Boolean).map(x=>x.api.auth.signOut().catch(()=>{})));
}
