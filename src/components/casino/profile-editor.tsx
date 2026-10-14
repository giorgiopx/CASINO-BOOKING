import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/lib/enquiry-db";
import { useCasino } from "./context";
import { useAuth } from "./auth";

export function CustomerProfileEditor({ profile }: { profile: Profile | null | undefined }) {
  const { session } = useAuth();
  const { t } = useCasino();
  const qc = useQueryClient();
  const [fullName,setFullName]=useState("");
  const [phone,setPhone]=useState("");
  const [residence,setResidence]=useState("");
  const [customerType,setCustomerType]=useState("individual");
  const [companyName,setCompanyName]=useState("");
  const [busy,setBusy]=useState(false);
  useEffect(()=>{
    if(!profile)return;
    setFullName(profile.full_name||"");
    setPhone(profile.phone||"");
    setResidence(profile.residence||"");
    setCustomerType(profile.customer_type||"individual");
    setCompanyName(profile.company_name||"");
  },[profile]);
  async function save(e:FormEvent) {
    e.preventDefault();
    if(!session)return;
    setBusy(true);
    try {
      const {error}=await supabase.from("profiles").update({
        full_name:fullName.trim().slice(0,160)||null,
        phone:phone.trim().slice(0,24)||null,
        residence:residence.trim().slice(0,80)||null,
        customer_type:customerType,
        company_name:customerType==="business"?companyName.trim().slice(0,160)||null:null
      }).eq("id",session.user.id);
      if(error) throw error;
      await qc.invalidateQueries({queryKey:["profile",session.user.id]});
      toast.success(t("Profile saved","Τα στοιχεία αποθηκεύτηκαν"));
    } catch {
      toast.error(t("Unable to save profile","Αδυναμία αποθήκευσης"));
    } finally{setBusy(false)}
  }
  if(!profile)return null;
  return <form onSubmit={save} style={{background:"#fff",border:"1px solid #e1d1ae",padding:24,borderRadius:14,marginTop:25,boxShadow:"0 3px 14px #0920390b"}}>
    <h2 style={{fontFamily:"Georgia,serif",fontSize:27,color:"#0a233e",margin:"0 0 6px"}}>{t("My customer profile","Η καρτέλα πελάτη μου")}</h2>
    <p style={{fontSize:12,color:"#66788b",marginBottom:16}}>{t("Customer ID","Κωδικός πελάτη")}: <strong>{profile.customer_ref}</strong> · {t("Your information is private","Τα στοιχεία σας είναι ιδιωτικά")}</p>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14}}>
      <label>{t("Full name","Ονοματεπώνυμο")}<input aria-label="Full name" style={{display:"block",width:"100%"}} value={fullName} maxLength={160} onChange={e=>setFullName(e.target.value)}/></label>
      <label>{t("Phone","Τηλέφωνο")}<input aria-label="Phone" style={{display:"block",width:"100%"}} value={phone} maxLength={24} onChange={e=>setPhone(e.target.value)}/></label>
      <label>{t("Country of residence","Χώρα κατοικίας")}<input style={{display:"block",width:"100%"}} value={residence} maxLength={80} onChange={e=>setResidence(e.target.value)}/></label>
      <label>{t("Account category","Κατηγορία πελάτη")}<select style={{display:"block",width:"100%"}} value={customerType} onChange={e=>setCustomerType(e.target.value)}><option value="individual">{t("Individual","Ιδιώτης")}</option><option value="business">{t("Business","Εταιρεία")}</option></select></label>
      {customerType==="business" && <label>{t("Company name","Επωνυμία εταιρείας")}<input style={{display:"block",width:"100%"}} value={companyName} maxLength={160} onChange={e=>setCompanyName(e.target.value)}/></label>}
    </div>
    <button type="submit" disabled={busy} style={{marginTop:18,background:"linear-gradient(115deg,#ffe2a5,#daa95d)",padding:"11px 18px",border:0,borderRadius:8,fontWeight:700,color:"#092034"}}>{busy?t("Saving…","Αποθήκευση…"):t("Save my profile","Αποθήκευση στοιχείων")}</button>
  </form>;
}