/* =========================================================
   App JS — interacțiuni și micro-UX
   - Nu s-a modificat conținutul, doar comportamente
   ========================================================= */

// 1) Anul curent în footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// 2) Smooth scroll pentru link-uri interne (nav, CTA)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id && id.length>1){
      const el = document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  })
});

// 3) Mini-form: redirecționează către Google Forms
//    🔧 Înlocuiește cu linkul tău Google Forms
const FORMS_URL = 'https://forms.gle/EXEMPLU';

function goToForm(ev){
  ev.preventDefault();
  if(!FORMS_URL || FORMS_URL.includes('EXEMPLU')){
    alert('Te rugăm să adaugi linkul Google Forms în variabila FORMS_URL din app.js.');
    return false;
  }
  window.open(FORMS_URL, '_blank');
  return false;
}

// Atașează handler-ul pe formular (fallback în caz că nu este inlined)
const miniForm = document.getElementById('miniForm');
if (miniForm && !miniForm.onsubmit) {
  miniForm.addEventListener('submit', goToForm);
}

// 4) Reveal on scroll (IntersectionObserver)
(function(){
  const ensureRevealClass = () => {
    const targets = document.querySelectorAll('.reveal, .card, .stat, .slot, .li, h2, .lead, .badge, .hero-wrap');
    targets.forEach(el=>el.classList.add('reveal'));
    return targets;
  };
  const targets = ensureRevealClass();
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target);} });
  },{threshold:.12});
  targets.forEach(el=>io.observe(el));
})();

// 5) Feedback accesibil pe butoane la Enter/Space
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn=>{
  btn.addEventListener('keydown', (e)=>{ 
    if(e.key==='Enter' || e.key===' '){ 
      btn.classList.add('active'); 
      setTimeout(()=>btn.classList.remove('active'), 200); 
    } 
  });
});

// 6) Mică protecție pentru iframe map (opțional, dar non-intruziv)
document.querySelectorAll('iframe[loading="lazy"]').forEach(f => {
  f.addEventListener('load', ()=> f.dataset.loaded = '1');
});
