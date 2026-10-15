(()=>{'use strict';
const base='./';const $=id=>document.getElementById(id);let countries=[],venues=[],language='en';
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const imgPath=c=>{const x=c.image||'';return x.startsWith('/')?'.'+x:x;};
const txt=(x)=>Array.isArray(x)?x[language==='el'?1:0]:x;
const urlOk=x=>{try{const a=new URL(x);return a.protocol==='https:'?a.href:'#';}catch{return'#';}};
const listed=c=>venues.filter(v=>v.countrySlug===c.slug);
const $t=(en,el)=>language==='el'?el:en;
function card(c,international=false){
 const count=listed(c).length;
 return '<a class="card" href="?country='+encodeURIComponent(c.slug)+'" aria-label="'+escapeHTML(txt(c.name))+'">'+
 '<img src="'+escapeHTML(imgPath(c))+'" alt="'+escapeHTML(txt(c.name))+' — editorial destination photo" loading="lazy" onerror="this.style.visibility=\'hidden\'">'+
 (c.kind==='planned'?'<span class="status-tag">COMING 2027 · NOT OPEN</span>':'')+
 '<div class="card-inner"><h3><span class="flag">'+escapeHTML(c.flag)+'</span>'+escapeHTML(txt(c.name))+'</h3><div class="card-bottom"><small>'+
 (c.kind==='planned'?$t('Future project','Μελλοντικό έργο'):count+' '+$t('listed venues','χώροι gaming'))+
 '</small><span class="explore">'+$t('Explore','Δείτε')+' →</span></div></div></a>';
}
function renderHome(){
 $('home').hidden=false;$('detail').hidden=true;
 const european=countries.filter(x=>x.kind==='europe');
 $('europeGrid').innerHTML=european.map(c=>card(c)).join('');
 $('globalGrid').innerHTML=countries.filter(c=>c.kind!=='europe').map(c=>card(c,true)).join('');
 $('destinationSelect').innerHTML='<option value="">'+$t('Select country or casino','Επιλέξτε χώρα ή καζίνο')+'</option>'+countries.map(c=>'<option value="'+escapeHTML(c.slug)+'">'+escapeHTML(txt(c.name))+'</option>').join('');
 document.title='CasinoBooking.com — Premium Casino Travel Preview';
}
function renderCountry(slug){
 const c=countries.find(x=>x.slug===slug);if(!c){history.replaceState({},'','./');return renderHome();}
 $('home').hidden=true;$('detail').hidden=false;
 $('detailTitle').textContent=c.flag+' '+txt(c.name);document.title=txt(c.name)+' — CasinoBooking.com';
 $('detailDesc').textContent=c.kind==='planned'?$t('Wynn Al Marjan is a planned project for 2027, NOT an operating casino.','Το Wynn Al Marjan αναμένεται το 2027 και δεν είναι λειτουργούν καζίνο.'):c.slug==='russia'?$t('Informational listing only. Travel coordination is suspended pending sanctions, travel and compliance checks.','Μόνο ενημερωτική προβολή. Δεν οργανώνεται ταξίδι πριν ολοκληρωθεί ο έλεγχος ταξιδιωτικών περιορισμών και κυρώσεων.'):$t('Explore independently listed gaming venues with links to their official operators. These are not verified partnerships or confirmed travel bookings.','Εξερευνήστε καζίνο με επίσημους συνδέσμους. Δεν υπάρχουν επιβεβαιωμένες συνεργασίες ή κρατήσεις.');
 $('detailPhoto').style.backgroundImage='linear-gradient(0deg,rgba(0,16,32,.45),transparent),url("'+encodeURI(imgPath(c)).replace(/"/g,'%22')+'")';
 const v=listed(c);
 $('venueList').innerHTML=v.map(x=>'<article class="venue"><h3>'+escapeHTML(x.name)+'</h3><p>📍 '+escapeHTML(txt(x.locality))+'</p><span class="status">'+(x.status==='planned'?$t('Planned, not open','Μελλοντικό, δεν λειτουργεί'):$t('Operator listing · verify current operation','Καταχώριση · απαιτείται έλεγχος λειτουργίας'))+'</span><a target="_blank" rel="noopener noreferrer" href="'+escapeHTML(urlOk(x.officialUrl))+'">'+$t('Official website','Επίσημη ιστοσελίδα')+' ↗</a></article>').join('')||'<p class="empty">No venues listed</p>';
 $('detailNote').textContent=$t('Preview only: flights, hotels and private transfers are enquiries, not provider-confirmed reservations. Personal account and email/WhatsApp automation are being finalized. Minimum legal casino age and visa restrictions vary by region.','Μόνο προεπισκόπηση: οι πτήσεις, τα ξενοδοχεία και οι μεταφορές αποτελούν αιτήματα, όχι επιβεβαιωμένες κρατήσεις. Ο προσωπικός λογαριασμός και οι αυτοματισμοί θα ολοκληρωθούν σε επόμενη φάση. Η νόμιμη ηλικία και οι ταξιδιωτικοί όροι διαφέρουν ανά περιοχή.');
 window.scrollTo({top:0,behavior:'instant'});
}
function render(){const q=new URL(location.href).searchParams.get('country');if(q)renderCountry(q);else renderHome();}
function localize(){
 $('lang').textContent=(language==='el'?'🇬🇷 EL':'🇬🇧 EN')+' ▾';document.documentElement.lang=language;
 $('heroSmall').textContent=$t('Your Gateway to','Η Πύλη σας προς');
 $('heroBig').textContent=$t('World-Class Casinos','Κορυφαία Καζίνο');
 $('heroDesc').innerHTML=$t('Discover leading casino travel destinations in Europe and beyond.<br>Explore hotels, flights and personal travel coordination — all in one place.','Ανακαλύψτε κορυφαίους προορισμούς καζίνο στην Ευρώπη και διεθνώς.<br>Αιτήματα ξενοδοχείων, πτήσεων και ιδιωτικής ταξιδιωτικής υποστήριξης.');
 $('destinationLabel').textContent=$t('Destination','Προορισμός');
 $('dateLabel').textContent=$t('Check-in / Check-out','Άφιξη / Αναχώρηση');
 $('travelerLabel').textContent=$t('Travelers','Ταξιδιώτες');
 $('searchLabel').textContent=$t('Search','Αναζήτηση');
 $('popularHeading').textContent=$t('Popular Casino Destinations','Δημοφιλείς Προορισμοί Καζίνο');
 $('popularDesc').textContent=$t('Explore world-renowned casinos, luxury resorts and unforgettable destinations.','Ανακαλύψτε καζίνο, πολυτελή resorts και δημοφιλείς προορισμούς.');
 $('allLink').textContent=$t('View All Destinations →','Όλοι οι Προορισμοί →');
 $('globalHeading').textContent=$t('Global Premium Casino Destinations','Διεθνείς Premium Προορισμοί Καζίνο');
 $('globalDesc').textContent=$t('United States, Russia and UAE — clearly distinguishing operating and planned projects.','ΗΠΑ, Ρωσία και ΗΑΕ — διαχωρισμός λειτουργούντων χώρων και μελλοντικών έργων.');
 render();
}
$('lang').addEventListener('click',()=>{language=language==='en'?'el':'en';localize()});
$('mobileMenu').addEventListener('click',()=>$('nav').classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a=>a.addEventListener('click',()=>$('nav').classList.remove('open')));
$('searchForm').addEventListener('submit',e=>{e.preventDefault();const s=$('destinationSelect').value;if(s){const url='?country='+encodeURIComponent(s);history.pushState({},'',url);render()}else document.querySelector('#destinations').scrollIntoView({behavior:'smooth'});});
window.addEventListener('popstate',render);
fetch('./catalog.json').then(r=>{if(!r.ok)throw Error('Catalogue HTTP '+r.status);return r.json()}).then(data=>{
 countries=data.countries;venues=data.venues;localize();
}).catch(err=>{console.error(err);$('europeGrid').textContent='Destination catalogue could not be loaded. Please check again shortly.';});
})();