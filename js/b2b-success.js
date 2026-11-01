// Partner inquiry confirmation (b2b-success.html): sends the generate_lead
// event once per submission. b2b.js leaves a pending-lead note in
// sessionStorage on submit; reloading this page or visiting it directly sends
// nothing, so the lead count stays accurate.
(function(){
  var PENDING_LEAD = 'ctfs_pending_lead';
  var lead;
  try{
    lead = JSON.parse(sessionStorage.getItem(PENDING_LEAD));
    sessionStorage.removeItem(PENDING_LEAD);
  }catch(e){ return; }
  if(!lead || typeof window.gtag !== 'function') return;

  lead.form_name = 'partner_inquiry';
  window.gtag('event', 'generate_lead', lead);
})();
