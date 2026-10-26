import { LOGO_PATHS } from "./preloader-logo";

/**
 * Legacy Foods preloader: the red logo draws itself stroke by stroke, fills in,
 * and the white screen fades away once the first screen is ready.
 *
 * Same rules as the WordPress site:
 *  - shown for at least 1.8 s
 *  - hidden as soon as the page has loaded (fonts + images visible on the first screen)
 *  - never kept longer than 3 s, even if an image is slow or broken (10 s failsafe on top)
 *  - add ?lfpre=5000 to a URL to test a longer cap
 *
 * It's server-rendered and runs a tiny inline script, so it appears instantly
 * (before React loads) and only on a full page load — clicking between pages
 * inside the site doesn't show it again.
 */
const script = `(function(){
  var pre=document.getElementById('lf-preloader'); if(!pre) return;
  var MIN_SHOW=1800, CAP_SHOW=3000, MAX_SHOW=10000;
  try{var q=new URLSearchParams(location.search).get('lfpre'); if(q&&!isNaN(parseInt(q,10))) CAP_SHOW=Math.max(MIN_SHOW,parseInt(q,10));}catch(e){}
  var start=Date.now(), finished=false;
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches) pre.classList.add('is-running');
  function finish(){ if(finished) return; finished=true; pre.classList.add('is-fading'); setTimeout(function(){ pre.classList.add('is-done'); }, 600); }
  var loaded=document.readyState==='complete', waiters=[];
  if(!loaded) addEventListener('load', function(){ loaded=true; waiters.forEach(function(f){f();}); });
  var domReady=new Promise(function(r){ document.readyState!=='loading'?r():document.addEventListener('DOMContentLoaded',r); });
  var fontsReady=(document.fonts&&document.fonts.ready)?document.fonts.ready:Promise.resolve();
  function imgReady(img){ return new Promise(function(r){ function done(){r();}
    if(img.complete){ (img.naturalWidth>0&&img.decode)?img.decode().then(done,done):done(); }
    else { img.addEventListener('load',function(){ img.decode?img.decode().then(done,done):done(); },{once:true}); img.addEventListener('error',done,{once:true}); } }); }
  function firstScreenImages(){ var vh=innerHeight, vw=innerWidth, waits=[];
    document.querySelectorAll('header img, main img').forEach(function(img){ var r=img.getBoundingClientRect();
      if(r.bottom>0&&r.top<vh&&r.right>0&&r.left<vw&&r.width>0){ if(img.getAttribute('loading')==='lazy') img.setAttribute('loading','eager'); waits.push(imgReady(img)); } });
    return Promise.all(waits); }
  function afterPaint(){ return new Promise(function(r){ requestAnimationFrame(function(){ requestAnimationFrame(r); }); }); }
  Promise.all([domReady,fontsReady]).then(firstScreenImages).then(afterPaint).then(function(){
    function tryFinish(){ setTimeout(finish, Math.max(0, MIN_SHOW-(Date.now()-start))); }
    if(loaded) tryFinish(); else waiters.push(tryFinish);
  });
  setTimeout(finish, CAP_SHOW);  // never hold the page longer than this, even if an image is slow or broken
  setTimeout(finish, MAX_SHOW);
})();`;

export default function Preloader() {
  return (
    <>
      {/* The inline script toggles classes on this element before React hydrates. */}
      <div className="lf-preloader" id="lf-preloader" role="status" aria-label="Loading Legacy Foods" suppressHydrationWarning>
        <svg className="lf-logo" viewBox="90 195 1040 775" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g transform="translate(0,1254) scale(0.1,-0.1)">
            {LOGO_PATHS.map((p, i) => (
              <path key={i} className="lf-draw" d={p.d} style={{ ["--len" as string]: p.len, ["--i" as string]: i }} />
            ))}
          </g>
        </svg>
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
