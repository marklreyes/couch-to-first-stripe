// Partner page (b2b.html): lead attribution + Google Analytics events.
// Never send names, emails, or other personal details to Google Analytics —
// only the non-identifying fields listed in LEAD_PARAMS.
(function(){
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var LEAD_PARAMS = ['organization_type', 'timeline'];
  var UTM_STORE = 'ctfs_utm';
  var PENDING_LEAD = 'ctfs_pending_lead';

  function track(name, params){
    if(typeof window.gtag === 'function') window.gtag('event', name, params);
  }
  function store(key, value){
    try{ sessionStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }
  function load(key){
    try{ return JSON.parse(sessionStorage.getItem(key)) || {}; }catch(e){ return {}; }
  }

  // CTA clicks, labeled by where the button sits (data-cta="hero", "nav", ...).
  document.querySelectorAll('[data-cta]').forEach(function(el){
    el.addEventListener('click', function(){
      track('cta_click', {cta_location: el.dataset.cta, cta_text: el.textContent.trim()});
    });
  });

  var form = document.querySelector('form[name="partner-inquiry"]');
  if(!form) return;

  // UTM params from this visit's URL, falling back to earlier in the session.
  var params = new URLSearchParams(window.location.search);
  var utm = load(UTM_STORE);
  UTM_KEYS.forEach(function(key){
    if(params.get(key)) utm[key] = params.get(key);
  });
  store(UTM_STORE, utm);
  UTM_KEYS.forEach(function(key){
    if(utm[key] && form.elements[key]) form.elements[key].value = utm[key];
  });

  // Only record referrers from other sites.
  if(document.referrer && document.referrer.indexOf(window.location.host) === -1){
    form.elements.referrer.value = document.referrer;
  }

  // Named inquiry_start (not form_start) so it can't collide with GA4's
  // automatic enhanced-measurement form events.
  var started = false;
  form.addEventListener('input', function(){
    if(started) return;
    started = true;
    track('inquiry_start', {form_name: 'partner_inquiry'});
  });

  // The lead event fires on b2b-success.html, after Netlify has accepted the
  // submission. Hand it the non-identifying details for that event.
  form.addEventListener('submit', function(){
    var lead = {};
    LEAD_PARAMS.forEach(function(key){
      if(form.elements[key] && form.elements[key].value) lead[key] = form.elements[key].value;
    });
    if(utm.utm_source) lead.utm_source = utm.utm_source;
    store(PENDING_LEAD, lead);
  });
})();
