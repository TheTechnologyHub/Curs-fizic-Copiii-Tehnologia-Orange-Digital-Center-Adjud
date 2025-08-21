/* ===== App JS – GitHub Pages + Formspree ===== */

// 1) Year in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// 2) Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id && id.length>1){
      const el = document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  })
});

// 3) Reveal on scroll
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

// 4) Keydown feedback on buttons
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn=>{
  btn.addEventListener('keydown', (e)=>{ 
    if(e.key==='Enter' || e.key===' '){ 
      btn.classList.add('active'); 
      setTimeout(()=>btn.classList.remove('active'), 200); 
    } 
  });
});

// 5) Formspree submit (fără backend)
//    PAS 1: mergi pe https://formspree.io/ și creează un formular nou cu emailul tău
//    PAS 2: înlocuiește ID-ul de mai jos (f/XXXXXXXX) cu endpoint-ul tău
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/XXXXXXXX';

const form = document.getElementById('inscriereForm');
const submitBtn = document.getElementById('submitBtn');
const alertBox = document.getElementById('formAlert');

function showAlert(type, msg){
  if(!alertBox) return;
  alertBox.className = 'alert mini ' + (type === 'success' ? 'success' : 'error');
  alertBox.textContent = msg;
  alertBox.style.display = 'block';
}

if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    // Validare minimă
    const fd = new FormData(form);
    if(!fd.get('nume') || !fd.get('email')){
      showAlert('error', 'Te rugăm să completezi numele și emailul.');
      return;
    }

    // Dezactivează butonul în timpul trimiterii
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Se trimite…';

    try{
      const payload = {
        nume: fd.get('nume'),
        email: fd.get('email'),
        telefon: fd.get('telefon') || '',
        rol: fd.get('rol') || '',
        // Poți adăuga câmpuri ascunse în Formspree pentru subject / redirect
        _subject: 'Nouă înscriere la curs (GitHub Pages)'
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(Object.assign(document.createElement('form'), { elements: [] }))
      });

      // Observație: unele browsere cer corpul ca FormData real:
      const data = new FormData();
      Object.keys(payload).forEach(k => data.append(k, payload[k]));
      const res2 = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });

      if(res2.ok){
        form.reset();
        showAlert('success', 'Îți mulțumim! Înscrierea a fost trimisă. Verifică emailul pentru confirmare.');
      } else {
        showAlert('error', 'Nu am putut trimite formularul. Încearcă din nou sau contactează-ne pe email.');
      }
    } catch(err){
      showAlert('error', 'Eroare de rețea. Te rugăm să încerci din nou.');
    } finally{
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}

// 6) Map iframe fallback tag
document.querySelectorAll('iframe[loading="lazy"]').forEach(f => {
  f.addEventListener('load', ()=> f.dataset.loaded = '1');
});
