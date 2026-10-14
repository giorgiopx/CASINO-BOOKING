#!/usr/bin/env node
/**
 * Import the 13 ORIGINAL user-approved CasinoBooking design crops.
 * Requires the private handoff ZIP provided by the user. Never replaces visuals.
 * Command:
 *   node scripts/import-approved-design.mjs /path/to/CasinoBooking_Design_and_GitHub_Handoff_2026-10-14.zip
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";
const expected={
 "cyprus.webp":"c95b8c2bc0ae3f44775aa70c275e3032db2acfa665788ff62b85263d92bb9546",
 "spain.webp":"cbba498d896895c74ea34456946f7c4686e933873c534b0fd8e05240afc5f843",
 "greece.webp":"3d8a69a2d6d5435e632170f1989aa2fb7bf8ef3e66455bfefc1f844a8e9ebf9c",
 "italy.webp":"e9ae2d537dee214b182ea6c76ea523960edfe68abda6e736a90a6ed7dbfb4920",
 "bulgaria.webp":"2a449ecf22a7c8d3759dbf2b58f02db9e0cc26f358228814a4643972e7c54de6",
 "france.webp":"876d7a68ca18a77db3b914b8d8a1e15abcf1f0083ff62edbc8757d45b5c42994",
 "slovenia.webp":"8baaa8a2ec832db38b3742abeabd482ee0c681042aa1e51ecfff33caecdc3632",
 "croatia.webp":"f5d5d96c3ebc12d780c51d619bf2e39ba99ff58250756a38ab16df058b1d25a4",
 "monaco.webp":"f1df48360303a867c43e078410b1284b70afa67d5c4262fe7a4f0b761900a66d",
 "romania.webp":"cbb1fc7f0c19fe12d122569a4baae307e5f44d60b5e8c0c109dd6993bfec3e7a",
 "serbia.webp":"b044b92795368dffa3a34581c36045f52de72ce340de4aecc186de675c3a2b53",
 "hero-reference.webp":"bca98dd4a0c632dbf6911118ea853879c9e3b4a0996998ce63e53d346cad0e3a",
 "portugal.webp":"50c22e3f3d73e63b6d5448c5265b1daea828f6b8d0fa3c027309046021d81e6"
};
const zip=process.argv[2];
const out=resolve("public/design-reference");
const sha=(b)=>createHash("sha256").update(b).digest("hex");
const verify=(name)=>{
 const file=join(out,name);
 if(!existsSync(file))throw Error("Missing approved design image: "+name);
 const actual=sha(readFileSync(file));
 if(actual!==expected[name])throw Error("Design image SHA256 mismatch "+name+": refusing to release");
};
if(zip){
 if(!existsSync(zip))throw Error("Source handoff ZIP not found: "+zip);
 const extracted=[];
 for(const [name,hash] of Object.entries(expected)){
  const entry="public/design-reference/"+name;
  const data=execFileSync("unzip",["-p",zip,entry],{maxBuffer:8*1024*1024});
  if(sha(data)!==hash)throw Error("Original ZIP image differs from approved reference: "+name);
  extracted.push({name,data});
 }
 mkdirSync(out,{recursive:true});
 // All hashes must verify before any file changes.
 for(const {name,data} of extracted)writeFileSync(join(out,name),data);
}
for(const name of Object.keys(expected))verify(name);
console.log("PASS: 13 exact CasinoBooking design images verified by SHA256.");
