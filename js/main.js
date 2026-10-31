// Scroll-reveal for How It Works steps + progress track fill
(function(){
  var steps = document.querySelectorAll('.step');
  var fill = document.getElementById('trackFill');
  if(!steps.length || !fill) return;
  var total = steps.length;
  var seen = new Set();

  function updateFill(){
    var pct = (seen.size / total) * 100;
    fill.style.width = pct + '%';
  }

  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          seen.add(entry.target.dataset.step);
          updateFill();
        }
      });
    }, {threshold:0.4});
    steps.forEach(function(s){ obs.observe(s); });
  } else {
    steps.forEach(function(s){ s.classList.add('is-visible'); seen.add(s.dataset.step); });
    updateFill();
  }
})();
