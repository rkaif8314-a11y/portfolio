const projects=[
{name:"NextMarga",category:"featured",icon:"N",label:"01 · Featured",description:"Student opportunity and career-roadmap platform for discovering scholarships, competitions, examinations, internships, research opportunities, hackathons and jobs.",tech:["React","TypeScript","Vite","Tailwind CSS","Supabase","Vercel"],status:"Actively developed",github:"https://github.com/rkaif8314-a11y/NextMarga",live:"https://next-marga.vercel.app/",caseStudy:{problem:"Students often search across many places for opportunities that match their stage and goals.",idea:"Bring discovery, student context, applications and roadmap guidance into one workflow.",solution:"A student-focused platform with profiles, opportunity discovery, matching, applications, dossier features and a CareerAI layer.",features:["Opportunity search and filtering","Student profile and personalization","Career roadmap","Applications and dossier","CareerAI guidance","Supabase authentication and persistent data","Responsive/PWA-oriented experience"],engineering:"React + TypeScript frontend, Vite build tooling, Tailwind CSS, Supabase authentication/data, AI-assisted career guidance and Vercel deployment."}},
{name:"Veriq",category:"featured",icon:"V",label:"02 · Trust",description:"Digital trust MVP for websites, messages and claims, designed to explain signals, uncertainty and recommendations instead of pretending to prove reality.",tech:["Next.js 15","React 19","TypeScript","Supabase path","Node runtime"],status:"MVP",github:"https://github.com/rkaif8314-a11y/Veriq",caseStudy:{problem:"People need context when deciding whether a digital website, message or claim is trustworthy.",idea:"Provide transparent evidence and uncertainty rather than an opaque yes/no detector.",solution:"Veriq analyzes URL, message and claim signals and presents confidence, evidence strength, limitations and recommendations.",features:["Live server-side URL analysis","HTTPS/reachability/status/redirect/hostname signals","DNS checks with private IPv4 protection","Message/scam heuristics","Claim evidence framing","Local report history","Responsive light/dark/system UI","Supabase auth and report persistence path","Input validation and no-store analysis responses"],engineering:"Next.js 15 + React 19 + TypeScript. The architecture routes UI requests through an analysis API and modular URL/message/claim signal engines. Supabase integration is optional and includes a migration with Row Level Security."}},
{name:"SmartNotepad",category:"development",icon:"S",label:"03 · Product",description:"Cloud note-taking application for writing, organizing and securely storing notes with authentication and persistent user data.",tech:["Next.js","React","TypeScript","Tailwind CSS","Supabase","Vercel"],status:"Actively developed",github:"https://github.com/rkaif8314-a11y/SmartNotepad",caseStudy:{problem:"Keep notes available across sessions without treating a local-only editor as the whole product.",idea:"Combine a responsive note editor with cloud persistence and user authentication.",solution:"A Next.js application using Supabase for cloud notes and authentication.",features:["Cloud notes","Supabase authentication","Persistent user data","Responsive note editor","Tailwind CSS interface"],engineering:"Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase and Vercel-ready deployment."}},
{name:"CodeVault",category:"development",icon:"C",label:"04 · DSA product",description:"Personal DSA command center built around Striver's A2Z DSA Sheet with progress, status, analytics, streaks and cloud sync.",tech:["React","Vite","Firebase Auth","Firestore","Lucide React"],status:"Built / evolving",github:"https://github.com/rkaif8314-a11y/codevault",caseStudy:{problem:"DSA practice becomes harder to maintain when progress, problems and revision signals are scattered.",idea:"Turn an A2Z problem roadmap into a personal progress workspace.",solution:"A dashboard with roadmap navigation, problem statuses, search, difficulty filters, analytics, streaks and per-user cloud sync.",features:["17-step A2Z roadmap","Problem status tracking","Search and difficulty filters","Activity heatmap and streaks","Difficulty analytics","Dark/light settings","Email/password and Google auth","Firestore sync","Local progress before sign-in"],engineering:"React + Vite UI with Lucide React, Firebase Authentication and Firestore cloud persistence. The repository includes Firestore rules for user-scoped progress."}},
{name:"SkyLume Weather",category:"development",icon:"☼",label:"05 · Utility",description:"Calm weather dashboard with live conditions, city search, browser geolocation and a 7-day forecast.",tech:["JavaScript","Open-Meteo","HTML","CSS"],status:"Static app",github:"https://github.com/rkaif8314-a11y/skylume-weather",caseStudy:{problem:"Weather information should be quick to access without requiring an API key.",idea:"Build a simple responsive dashboard around public weather and geocoding endpoints.",solution:"A browser-based dashboard powered by Open-Meteo.",features:["Live conditions","City search","Browser geolocation","7-day forecast","Celsius/Fahrenheit","Humidity, wind, pressure and feels-like data","Responsive design","No API key required"],engineering:"Static frontend calling Open-Meteo forecast and geocoding endpoints directly from the browser."}},
{name:"C++ DSA",category:"learning",icon:"{}",label:"06 · Problem solving",description:"Dedicated C++ repository covering data structures, algorithms and coding-platform practice to strengthen problem-solving fundamentals.",tech:["C++17","STL","DSA"],status:"Ongoing learning",github:"https://github.com/rkaif8314-a11y/DSA-C-",caseStudy:{problem:"Strong software engineering fundamentals require consistent algorithmic practice.",idea:"Maintain a focused repository for implementations and coding problems.",solution:"A growing collection covering core data structures, algorithms and problem-solving patterns.",features:["Arrays and strings","Recursion","Linked lists","Stacks and queues","Trees and BSTs","Graphs","Dynamic programming","Greedy/backtracking","Sliding window and two pointers","Binary search"],engineering:"C++17 and the Standard Template Library, with problems sourced from coding platforms including LeetCode, Codeforces, CodeChef, HackerRank and GeeksforGeeks."}},
{name:"LeetCode / TUF DSA",category:"learning",icon:"L",label:"07 · Practice",description:"Additional algorithmic problem-solving work documented in a dedicated repository.",tech:["C++","DSA","LeetCode"],status:"Ongoing learning",github:"https://github.com/rkaif8314-a11y/Leetcode-TUF-DSA-problems-",caseStudy:{problem:"Regular problem solving benefits from a separate, searchable record of solutions.",idea:"Document TUF/LeetCode-style practice in code.",solution:"A repository dedicated to algorithmic problem-solving work.",features:["Coding-problem solutions","Algorithm practice","Interview-oriented fundamentals"],engineering:"C++ problem-solving repository; the portfolio intentionally avoids claiming a specific solved-problem count."}}
];
const grid=document.querySelector("#projects-grid"), modal=document.querySelector("#project-modal"), modalContent=document.querySelector("#modal-content");let modalReturnFocus=null;
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible");}),{threshold:.08});
function observeReveals(){document.querySelectorAll(".reveal:not([data-observed])").forEach(el=>{el.dataset.observed="1";revealObserver.observe(el);});}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function card(p,i){return '<article class="project-card '+(p.category==="featured"?'featured ':'')+'reveal" data-category="'+p.category+'"><div class="project-top"><span class="project-label">'+esc(p.label)+'</span></div><div class="project-icon '+p.icon.toLowerCase().replace(/[^a-z]/g,"")+'">'+esc(p.icon)+'</div><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p><div class="project-tags">'+p.tech.map(t=>'<span>'+esc(t)+'</span>').join("")+'</div><div class="project-status">'+esc(p.status)+'</div><div class="project-links">'+(p.live?'<a href="'+p.live+'" target="_blank" rel="noopener noreferrer">Live demo ↗</a>':"")+'<a href="'+p.github+'" target="_blank" rel="noopener noreferrer">GitHub ↗</a><button class="case-button" data-case="'+i+'">Case study →</button></div></article>';}
function render(filter="all"){grid.innerHTML=projects.filter(p=>filter==="all"||p.category===filter).map(card).join("");observeReveals();}
render();
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");render(btn.dataset.filter);}));
function openCase(i){const p=projects[i];modalReturnFocus=document.activeElement;modalContent.innerHTML='<p class="kicker">'+esc(p.label)+'</p><h2 id="modal-title">'+esc(p.name)+'</h2><p>'+esc(p.description)+'</p><h4>The problem</h4><p>'+esc(p.caseStudy.problem)+'</p><h4>The idea</h4><p>'+esc(p.caseStudy.idea)+'</p><h4>The solution</h4><p>'+esc(p.caseStudy.solution)+'</p><h4>Key features</h4><ul>'+p.caseStudy.features.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><h4>Engineering</h4><p>'+esc(p.caseStudy.engineering)+'</p><div class="modal-actions">'+(p.live?'<a class="button primary" href="'+p.live+'" target="_blank" rel="noopener noreferrer">Live demo ↗</a>':"")+'<a class="button secondary" href="'+p.github+'" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div>';modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";const firstFocusable=modal.querySelector("a[href],button,[tabindex]:not([tabindex='-1'])");firstFocusable?.focus();}
function closeCase(){if(!modal.classList.contains("open"))return;modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow="";if(modalReturnFocus instanceof HTMLElement)modalReturnFocus.focus();modalReturnFocus=null;}
document.addEventListener("click",e=>{const b=e.target.closest("[data-case]");if(b)openCase(Number(b.dataset.case));if(e.target.closest("[data-close-modal]"))closeCase();});
document.addEventListener("keydown",e=>{if(!modal.classList.contains("open"))return;if(e.key==="Escape"){closeCase();return}if(e.key!=="Tab")return;const focusable=[...modal.querySelectorAll("a[href],button,input,select,textarea,[tabindex]:not([tabindex='-1'])")].filter(el=>!el.disabled);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
const header=document.querySelector(".site-header"),navToggle=document.querySelector(".nav-toggle"),navLinks=document.querySelector(".nav-links");
const cursor=document.querySelector(".cursor-orb");
if(cursor&&!window.matchMedia("(pointer:coarse)").matches&&!window.matchMedia("(prefers-reduced-motion:reduce)").matches){
  document.body.classList.add("cursor-ready");
  window.addEventListener("pointermove",e=>{cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";},{passive:true});
  document.querySelectorAll("a,button,[data-case]").forEach(el=>{
    el.addEventListener("mouseenter",()=>document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave",()=>document.body.classList.remove("cursor-hover"));
  });
}
const heroSystem=document.querySelector(".hero-system");
if(heroSystem&&!window.matchMedia("(prefers-reduced-motion:reduce)").matches&&!window.matchMedia("(pointer:coarse)").matches){
  heroSystem.addEventListener("pointermove",e=>{
    const r=heroSystem.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    heroSystem.style.transform="rotateX("+(-y*4)+"deg) rotateY("+(x*5)+"deg)";
  });
  heroSystem.addEventListener("pointerleave",()=>{heroSystem.style.transform="";});
}
navToggle?.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{navLinks.classList.remove("open");navToggle?.setAttribute("aria-expanded","false");}));
window.addEventListener("scroll",()=>{
  header?.classList.toggle("scrolled",scrollY>10);
  document.documentElement.style.setProperty("--scroll-progress",Math.min(1,scrollY/(document.body.scrollHeight-innerHeight)));
},{passive:true});
observeReveals();
const sections=[...document.querySelectorAll("main section[id]")],navItems=[...document.querySelectorAll(".nav-links a")];
new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;navItems.forEach(a=>a.classList.remove("active"));navItems.find(a=>a.getAttribute("href")==="#"+e.target.id)?.classList.add("active");}),{rootMargin:"-35% 0px -55% 0px"}).observe(document.querySelector("#home"));
sections.slice(1).forEach(s=>new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navItems.forEach(a=>a.classList.remove("active"));navItems.find(a=>a.getAttribute("href")==="#"+s.id)?.classList.add("active");}}),{rootMargin:"-35% 0px -55% 0px"}).observe(s));
document.querySelector("#year").textContent=new Date().getFullYear();
const liveRepo=document.querySelector("#repo-count");
if(liveRepo) liveRepo.setAttribute("aria-live","polite");
fetch("https://api.github.com/users/rkaif8314-a11y",{headers:{Accept:"application/vnd.github+json"}}).then(r=>r.ok?r.json():null).then(d=>{if(d?.public_repos)document.querySelector("#repo-count").textContent=d.public_repos;}).catch(()=>{});

/* Shared interaction state: DOM, typography and WebGL read the same signals. */
const interactionState={scrollProgress:0,mouse:{x:0,y:0},targetMouse:{x:0,y:0},activeSection:"home",hoveredObject:null,reducedMotion:window.matchMedia("(prefers-reduced-motion:reduce)").matches};
const atmosphereBySection={home:"",about:"",skills:"",projects:"",marga:"marga",journey:"",certifications:"",system-map:"",lab:"lab",github:"",contact:"contact"};
const setAtmosphere=section=>{interactionState.activeSection=section;document.body.classList.remove("atmosphere-marga","atmosphere-lab","atmosphere-contact");const a=atmosphereBySection[section];if(a)document.body.classList.add("atmosphere-"+a);const readout=document.querySelector("#scene-readout");if(readout)readout.textContent=({home:"01 / INTRO",about:"02 / IDENTITY",skills:"03 / ENGINEERING",projects:"04 / PROJECTS",marga:"05 / MARGA",journey:"06 / JOURNEY",certifications:"07 / EVIDENCE","system-map":"08 / SYSTEMS",lab:"09 / LAB",github:"10 / OPEN WORK",contact:"11 / CONTACT"})[section]||"SYSTEM";};
window.addEventListener("pointermove",e=>{interactionState.targetMouse.x=e.clientX/innerWidth-.5;interactionState.targetMouse.y=e.clientY/innerHeight-.5},{passive:true});
window.addEventListener("scroll",()=>{const max=document.body.scrollHeight-innerHeight;interactionState.scrollProgress=max>0?scrollY/max:0;document.documentElement.style.setProperty("--scene-progress",interactionState.scrollProgress.toFixed(3));},{passive:true});
new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setAtmosphere(e.target.id)}),{rootMargin:"-42% 0px -48% 0px"}).observe(document.querySelector("#home"));
document.querySelectorAll("main section[id]").forEach(s=>{if(s.id!=="home")new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setAtmosphere(s.id)}),{rootMargin:"-42% 0px -48% 0px"}).observe(s)});

async function initEngineeringScene(){
 const canvas=document.querySelector("#hero-canvas");
 if(!canvas||interactionState.reducedMotion||!window.WebGLRenderingContext)return;
 try{
  const THREE=await import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x080d12,.035);
  const camera=new THREE.PerspectiveCamera(42,canvas.clientWidth/canvas.clientHeight,.1,100);camera.position.set(0,0,7.8);
  const group=new THREE.Group();scene.add(group);
  scene.add(new THREE.HemisphereLight(0xb9d9d1,0x081015,1.8));
  const key=new THREE.PointLight(0x7fffd4,18,18);key.position.set(3,3,5);scene.add(key);
  const fill=new THREE.PointLight(0x6688ff,10,14);fill.position.set(-4,-2,3);scene.add(fill);
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,2),new THREE.MeshStandardMaterial({color:0x101b20,metalness:.8,roughness:.25,emissive:0x0a302a,emissiveIntensity:1.2,wireframe:false}));
  group.add(core);
  const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,1),new THREE.MeshBasicMaterial({color:0x7fffd4,wireframe:true,transparent:true,opacity:.32}));
  group.add(wire);
  const nodes=[];const nodeCount=14;
  for(let i=0;i<nodeCount;i++){
   const a=i/nodeCount*Math.PI*2,r=2.25+(i%3)*.22;
   const m=new THREE.Mesh(new THREE.SphereGeometry(.075+(i%2)*.025,12,12),new THREE.MeshBasicMaterial({color:i%4===0?0xd5ff62:0x72cfc1}));
   m.position.set(Math.cos(a)*r,Math.sin(a*1.7)*.75,Math.sin(a)*r*.72);m.userData={index:i,name:["UI","API","DATA","AUTH","AI","DSA","NEXTMARGA"][i%7]};group.add(m);nodes.push(m);
  }
  const positions=[];
  nodes.forEach((n,i)=>{const next=nodes[(i+1)%nodes.length];positions.push(n.position.x,n.position.y,n.position.z,next.position.x,next.position.y,next.position.z)});
  const lineGeo=new THREE.BufferGeometry();lineGeo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
  const lines=new THREE.LineSegments(lineGeo,new THREE.LineBasicMaterial({color:0x5c8e88,transparent:true,opacity:.22}));group.add(lines);
  const particleCount=420, p=new Float32Array(particleCount*3);
  for(let i=0;i<particleCount;i++){const rr=3.1+Math.random()*2.2,a=Math.random()*Math.PI*2;p[i*3]=Math.cos(a)*rr;p[i*3+1]=(Math.random()-.5)*4;p[i*3+2]=Math.sin(a)*rr}
  const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(p,3));
  const particles=new THREE.Points(pg,new THREE.PointsMaterial({color:0x9ecfc5,size:.018,transparent:true,opacity:.5}));scene.add(particles);
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),hud=document.querySelector("#scene-readout");
  const onMove=e=>{const r=canvas.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=-(e.clientY-r.top)/r.height*2+1};
  const onClick=()=>{raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(nodes)[0];if(hit){interactionState.hoveredObject=hit.object.userData.name;if(hud)hud.textContent="NODE / "+hit.object.userData.name;hit.object.scale.setScalar(2.5);setTimeout(()=>hit.object.scale.setScalar(1),220)}};
  canvas.addEventListener("pointermove",onMove,{passive:true});canvas.addEventListener("click",onClick);
  const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7))};addEventListener("resize",resize,{passive:true});
  let raf=0;
  const tick=()=>{raf=requestAnimationFrame(tick);const s=interactionState,mx=s.targetMouse.x,my=s.targetMouse.y;s.mouse.x+=(mx-s.mouse.x)*.055;s.mouse.y+=(my-s.mouse.y)*.055;const sp=s.scrollProgress;
   group.rotation.y+=.0018+sp*.004;group.rotation.x+=(s.mouse.y*.16+sp*.7-group.rotation.x)*.035;group.rotation.y+=(s.mouse.x*.2+sp*1.6-group.rotation.y)*.018;core.rotation.x+=.0025;core.rotation.y+=.0035;wire.rotation.x-=.001;wire.rotation.y-=.0015;particles.rotation.y+=.0005+sp*.001;
   const pulse=1+Math.sin(performance.now()*.0013)*.025;core.scale.setScalar(pulse+sp*.08);wire.scale.setScalar(1+sp*.12);
   renderer.render(scene,camera);
  };tick();
  document.querySelector(".hero-canvas-shell")?.classList.add("webgl-ready");
  window.addEventListener("pagehide",()=>{cancelAnimationFrame(raf);pg.dispose();lineGeo.dispose();core.geometry.dispose();core.material.dispose();wire.geometry.dispose();wire.material.dispose();nodes.forEach(n=>{n.geometry.dispose();n.material.dispose()});renderer.dispose()},{once:true});
 }catch(error){
  document.querySelector(".hero-canvas-shell")?.classList.add("webgl-fallback");
 }
}
initEngineeringScene();

/* Command palette: a compact way to navigate a long experience. */
const palette=document.createElement("div");palette.className="command-palette";palette.id="command-palette";palette.innerHTML='<div class="command-box" role="dialog" aria-modal="true" aria-label="Navigate portfolio"><input id="command-input" type="search" placeholder="Jump to a section…" autocomplete="off"><div class="command-list" id="command-list"></div></div>';document.body.appendChild(palette);
const commands=[["Home","#home"],["About","#about"],["Projects","#projects"],["NextMarga","#marga"],["Skills","#skills"],["Journey","#journey"],["Systems","#system-map"],["Engineering Lab","#lab"],["GitHub","#github"],["Contact","#contact"]];
const list=palette.querySelector("#command-list"),input=palette.querySelector("#command-input");
function renderCommands(q=""){list.innerHTML=commands.filter(([n])=>n.toLowerCase().includes(q.toLowerCase())).map(([n,h],i)=>'<button class="command-item" data-command="'+h+'"><span>'+n+'</span><kbd>'+((i+1)%10)+'</kbd></button>').join("");}
function closePalette(){palette.classList.remove("open");input.value=""}
function openPalette(){renderCommands();palette.classList.add("open");requestAnimationFrame(()=>input.focus())}
renderCommands();input.addEventListener("input",()=>renderCommands(input.value));palette.addEventListener("click",e=>{const b=e.target.closest("[data-command]");if(b){closePalette();document.querySelector(b.dataset.command)?.scrollIntoView({behavior:interactionState.reducedMotion?"auto":"smooth"})}else if(e.target===palette)closePalette()});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openPalette()}if(e.key==="Escape"&&palette.classList.contains("open"))closePalette()});

/* Controlled magnetic feedback for primary actions only. */
if(!interactionState.reducedMotion&&!matchMedia("(pointer:coarse)").matches){document.querySelectorAll(".button.primary,.nav-cta").forEach(el=>el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.08,y=(e.clientY-r.top-r.height/2)*.08;el.style.transform="translate("+x+"px,"+y+"px)"}));document.querySelectorAll(".button.primary,.nav-cta").forEach(el=>el.addEventListener("pointerleave",()=>el.style.transform=""))}
