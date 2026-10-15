/**
 * Browser-only smoke of the approved editorial country catalogue. Uses dummy
 * Supabase credentials; never signs up customers or sends enquiries.
 */
import { chromium } from "playwright";
import { strict as assert } from "node:assert";
import { mkdir } from "node:fs/promises";

const base = process.env.SMOKE_URL || "http://127.0.0.1:4173";
const out = "artifacts/approved-directory-smoke";
await mkdir(out,{recursive:true});
const browser = await chromium.launch({headless:true});
const checks = [];
async function check(name,action){
  try{await action();checks.push({name,success:true});console.log("PASS",name);}
  catch(e){checks.push({name,success:false});console.error("FAIL",name,e.message);}
}
try{
  const page=await browser.newPage({viewport:{width:1536,height:1024}});
  const errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  const open=async route=>{
    const res=await page.goto(base+route,{waitUntil:"domcontentloaded"});
    assert.equal(res?.status(),200,route+" expected HTTP 200");
  };
  await check("Original 12 European cards remain first",async()=>{
    await open("/");
    await page.locator(".cb-country").first().waitFor({timeout:12000});
    assert.equal(await page.locator(".cb-country").count(),12);
    assert.equal(await page.locator(".cb-global-photo-card").count(),3);
    assert.equal(await page.locator('.cb-country a[href*="/casino-country/"]').count(),12);
    await page.screenshot({path:out+"/homepage-desktop.png",fullPage:true});
  });
  await check("All 15 country cards appear in approved order",async()=>{
    await open("/destinations");
    await page.locator(".cb-approved-card").first().waitFor({timeout:12000});
    assert.equal(await page.locator(".cb-approved-card").count(),15);
    const links=await page.locator(".cb-approved-card").evaluateAll(elements=>elements.map(e=>e.getAttribute("href")));
    assert.equal(links[0],"/casino-country/monaco");
    assert.equal(links[11],"/casino-country/croatia");
    assert.equal(links[12],"/casino-country/usa");
    assert.equal(links[13],"/casino-country/russia");
    assert.equal(links[14],"/casino-country/uae");
    await page.screenshot({path:out+"/all-15-countries.png",fullPage:true});
  });
  for(const [slug,num] of [["monaco",2],["cyprus",4],["greece",3],["italy",3],["usa",18],["russia",3],["uae",1]]){
    await check("Country details "+slug,async()=>{
      await open("/casino-country/"+slug);
      await page.locator(".cb-country-venue").first().waitFor({timeout:12000});
      assert.equal(await page.locator(".cb-country-venue").count(),num);
      const actions=await page.locator(".cb-country-enquire").count();
      assert.equal(actions,slug==="uae"?0:num);
      if(["usa","russia","uae"].includes(slug))await page.screenshot({path:out+"/country-"+slug+".png",fullPage:true});
    });
  }
  await check("Request form includes approved real candidates but excludes future UAE",async()=>{
    await open("/request");
    await page.locator('select[name="destination"]').waitFor({timeout:12000});
    const items=await page.locator('select[name="destination"] option').allTextContents();
    for(const name of ["Casino de Monte-Carlo","Casino Sochi","Bellagio Las Vegas"]){
      assert(items.some(x=>x.includes(name)),name+" missing");
    }
    assert(!items.some(x=>x.includes("Wynn Al Marjan Island")),"Planned UAE casino wrongly selectable");
  });
  await check("Mobile country cards and layout",async()=>{
    const m=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
    await m.goto(base+"/destinations",{waitUntil:"domcontentloaded"});
    await m.locator(".cb-approved-card").first().waitFor({timeout:12000});
    const over=await m.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    assert.equal(over,false,"Horizontal overflow");
    await m.screenshot({path:out+"/countries-mobile.png",fullPage:true});
    await m.close();
  });
  await check("No uncaught Javascript exceptions",async()=>{
    assert.equal(errors.length,0,errors.join("; "));
  });
}finally{
  await browser.close();
}
const failed=checks.filter(x=>!x.success);
console.log("Approved catalogue browser smoke:",checks.length-failed.length,"/",checks.length,"passed.");
if(failed.length)process.exitCode=1;
