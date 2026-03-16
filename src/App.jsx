import { useState, useEffect, useRef, useCallback } from "react";

const BASE = import.meta.env.BASE_URL;
const asset = (path) => `${BASE}${path}`;
const C = {
  dark:"#010D1F",navy:"#003366",indiaBlue:"#1A3A6B",
  gold:"#D4AF37",saffron:"#FF6B35",white:"#F0F4FF",dim:"#4b5263",
};

const STATS = [
  {id:"truns",  target:3400, label:"TEST RUNS",      sub:"Avg 47.2",         suffix:"+"},
  {id:"oruns",  target:4500, label:"ODI RUNS",       sub:"Avg 58.1",         suffix:"+"},
  {id:"cents",  target:23,   label:"CENTURIES",      sub:"All formats",      suffix:"+"},
  {id:"rank",   target:null, label:"ICC RANKING",    sub:"ODI Batter (peak)",display:"#1"},
  {id:"ipl",    target:3200, label:"IPL RUNS",       sub:"Strike Rate 136",  suffix:"+"},
  {id:"fifties",target:60,   label:"HALF CENTURIES", sub:"All formats",      suffix:"+"},
];

const TIMELINE = [
  {year:"2019",event:"ODI DEBUT",             desc:"Made his ODI debut against West Indies in Hamilton. Announced himself with composure beyond his years."},
  {year:"2021",event:"FIRST TEST CENTURY",    desc:"Scored his maiden Test century vs England — a coming-of-age knock on cricket's holiest ground."},
  {year:"2022",event:"IPL TROPHY · GT",       desc:"Won the IPL title with Gujarat Titans in their debut season, cementing his place as India's premier batter."},
  {year:"2023",event:"208* · SIMPLY ELEGANT", desc:"Smashed a breathtaking 208* vs New Zealand — highest score by an Indian batter in ODIs at the time."},
  {year:"2023",event:"ICC WORLD CUP",         desc:"Blazed through the tournament as India's top scorer, leading India's charge to the final."},
  {year:"2024",event:"WTC CAMPAIGN",          desc:"Continues as a cornerstone of India's Test lineup in the World Test Championship campaign."},
];

const SOCIALS = [
  {name:"Instagram",handle:"@shubmangill",    icon:"📸",color:"rgba(180, 58, 117, 0.75)", url:"https://www.instagram.com/shubmangill"},
  {name:"Twitter/X",handle:"@ShubmanGill",    icon:"𝕏", color:"rgba(0,0,0,.8)",       url:"https://x.com/ShubmanGill"},
  {name:"LinkedIn",  handle:"Shubman Gill",    icon:"▶", color:"rgba(10,102,194,1)",     url:"https://www.linkedin.com/in/shubmangill"},
  {name:"BCCI",     handle:"Official Profile",icon:"🏏",color:"rgba(0,51,102,.8)",    url:"https://www.bcci.tv/international/men/players/shubman-gill/62"},
  {name:"Website",  handle:"shubmangill.com", icon:"🌐",color:"rgba(20,80,40,.8)",    url:"#"},
];

const BRANDS = [
  {name:"BOAT",            color:"#e63946",abbr:"boAt"},
  {name:"Nike",          color:"#111111",abbr:"nike"},
  {name:"Mrf",      color:"#c0392b",abbr:"MRF"},
  {name:"TATACapital",           color:"#004b93",abbr:"TataCap"},
  {name:"beatXP",           color:"#6c63ff",abbr:"beatxp"},
  {name:"BajajAllianzInsurance",          color:"#b8860b",abbr:"BajajAllianz"},
  {name:"DREAM11",         color:"#e84118",abbr:"Dream11"},
  {name:"Casio",            color:"#2a2a3e",abbr:"Casio"},
  {name:"TASVA",            color:"#444",   abbr:"PUMA"},
  {name:"Oakley",        color:"#7b2d8b",abbr:"Oakley"},
  {name:"Crunchyroll",          color:"#f05a28",abbr:"crunchyroll"},
  {name:"Bowlers",     color:"#003087",abbr:"Bowlers"},
];

// ── Hooks ─────────────────────────────────────────────────────────────────────
function useInView(ref, threshold=0.15) {
  const [inView,setInView] = useState(false);
  useEffect(()=>{
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setInView(true); },{threshold});
    if(ref.current) obs.observe(ref.current);
    return ()=>obs.disconnect();
  },[ref,threshold]);
  return inView;
}

function useCountUp(target, active, duration=1500) {
  const [val,setVal] = useState(0);
  useEffect(()=>{
    if(!active||target===null) return;
    let start=null;
    const step=(ts)=>{
      if(!start) start=ts;
      const pct=Math.min((ts-start)/duration,1);
      setVal(Math.floor(pct*target));
      if(pct<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },[active,target,duration]);
  return val;
}

function useBreakpoint() {
  const [bp, setBp] = useState({ isMobile: false, isTablet: false });
  useEffect(()=>{
    const update = () => setBp({ isMobile: window.innerWidth < 640, isTablet: window.innerWidth < 1024 });
    update();
    window.addEventListener("resize", update);
    return ()=>window.removeEventListener("resize", update);
  },[]);
  return bp;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionLabel({children}) {
  return <div style={{fontSize:".7rem",fontWeight:700,letterSpacing:6,color:C.saffron,textTransform:"uppercase",marginBottom:8}}>{children}</div>;
}
function SectionTitle({children}) {
  return <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2.2rem,5vw,4rem)",lineHeight:1,marginBottom:40,color:C.white}}>{children}</div>;
}

// ── Particles ─────────────────────────────────────────────────────────────────
function Particles() {
  const particles = useRef(Array.from({length:25},(_,i)=>({
    id:i,left:Math.random()*100,size:Math.random()*4+2,
    dur:Math.random()*12+8,delay:Math.random()*15,round:Math.random()>.5,
  }))).current;
  return (
    <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
      {particles.map(p=>(
        <div key={p.id} style={{position:"absolute",bottom:0,left:p.left+"%",width:p.size,height:p.size,background:C.gold,borderRadius:p.round?"50%":2,animation:`sg-float ${p.dur}s ${p.delay}s linear infinite`,opacity:0}}/>
      ))}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled,setScrolled] = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const {isMobile} = useBreakpoint();

  useEffect(()=>{
    const h=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",h);
    return ()=>window.removeEventListener("scroll",h);
  },[]);

  const links = [["ON THE PITCH","#stats"],["OFF THE PITCH","#socials"]];
  const lnkStyle = {color:"rgba(240,244,255,.8)",textDecoration:"none",fontSize:".72rem",fontWeight:700,letterSpacing:"3px",textTransform:"uppercase",cursor:"pointer",display:"block",padding:"10px 0"};

  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:9999,padding:isMobile?"14px 20px":"18px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",background:scrolled||menuOpen?"rgba(1,13,31,.97)":"transparent",backdropFilter:scrolled?"blur(12px)":"none",borderBottom:scrolled?`1px solid rgba(212,175,55,.3)`:"none",transition:"all .3s"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.8rem",color:C.gold,letterSpacing:3,fontStyle:"italic"}}>
          SG<span style={{color:C.saffron}}>77</span>
        </div>
        {/* Desktop links */}
        {!isMobile && (
          <div style={{display:"flex",gap:40}}>
            {links.map(([label,href])=>(
              <a key={label} href={href} style={{...lnkStyle,padding:0}}
                onMouseEnter={e=>e.target.style.color=C.gold}
                onMouseLeave={e=>e.target.style.color="rgba(240,244,255,.8)"}>{label}</a>
            ))}
          </div>
        )}
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {!isMobile && <button style={{background:C.gold,color:C.dark,padding:"10px 24px",fontWeight:800,fontSize:".72rem",letterSpacing:"3px",textTransform:"uppercase",border:"none",cursor:"pointer",clipPath:"polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)"}}>Store</button>}
          {/* Hamburger */}
          {isMobile && (
            <button onClick={()=>setMenuOpen(o=>!o)} style={{background:"none",border:`1px solid rgba(212,175,55,.4)`,color:C.gold,padding:"6px 10px",cursor:"pointer",fontSize:"1.2rem",lineHeight:1}}>
              {menuOpen?"✕":"☰"}
            </button>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div style={{position:"fixed",top:56,left:0,right:0,zIndex:9998,background:"rgba(1,13,31,.98)",borderBottom:`1px solid rgba(212,175,55,.3)`,padding:"16px 24px 24px"}}>
          {links.map(([label,href])=>(
            <a key={label} href={href} style={lnkStyle} onClick={()=>setMenuOpen(false)}
              onMouseEnter={e=>e.target.style.color=C.gold}
              onMouseLeave={e=>e.target.style.color="rgba(240,244,255,.8)"}>{label}</a>
          ))}
          <button style={{marginTop:12,background:C.gold,color:C.dark,padding:"10px 24px",fontWeight:800,fontSize:".72rem",letterSpacing:"3px",textTransform:"uppercase",border:"none",cursor:"pointer",width:"100%"}}>Store</button>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const {isMobile,isTablet} = useBreakpoint();
  return (
    <section id="hero" style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",background:"#0a1628"}}>
      <Particles/>
      <div style={{position:"absolute",top:"50%",left:"50%",fontFamily:"'Bebas Neue',sans-serif",fontSize:isMobile?"120vw":"75vw",color:"rgba(255,255,255,.035)",lineHeight:1,pointerEvents:"none",userSelect:"none",zIndex:0,letterSpacing:-20,animation:"sg-rotate77 30s linear infinite",transformOrigin:"center center"}}>77</div>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(75deg,transparent,transparent 80px,rgba(212,175,55,.025) 80px,rgba(212,175,55,.025) 82px)",pointerEvents:"none"}}/>

      {isMobile ? (
        /* Mobile hero — stacked */
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"100px 24px 40px",position:"relative",zIndex:3,gap:24,textAlign:"center"}}>
          <div style={{animation:"sg-fadeUp .7s ease both"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.6rem",color:C.saffron,letterSpacing:3,marginBottom:6}}>TEAM INDIA</div>
            <div style={{fontSize:".6rem",fontWeight:700,letterSpacing:3,color:"rgba(240,244,255,.5)",textTransform:"uppercase",marginBottom:14}}>Gujarat Titans · IPL</div>
            <div style={{display:"flex",gap:6,justifyContent:"center"}}>
              {["TEST","ODI","T20I"].map(t=>(
                <span key={t} style={{border:"1px solid rgba(240,244,255,.3)",color:"rgba(240,244,255,.7)",padding:"3px 10px",fontSize:".55rem",fontWeight:700,letterSpacing:2,textTransform:"uppercase"}}>{t}</span>
              ))}
            </div>
          </div>
          {/* Portrait */}
          <div style={{animation:"sg-fadeUp .7s .2s ease both",position:"relative"}}>
            <div className="portrait-flip-wrap" style={{width:220,height:220,borderRadius:"50%",border:`3px solid ${C.gold}`,boxShadow:"0 0 0 5px rgba(212,175,55,.15),0 0 40px rgba(212,175,55,.2)",position:"relative",zIndex:2,perspective:900,cursor:"pointer"}}>
              <div className="portrait-flip-inner">
                <div className="portrait-flip-front">
                  <img src="/assets/hero.png" alt="Shubman Gill" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",display:"block"}}/>
                </div>
                <div className="portrait-flip-back">
                  <img src="/assets/hero.png" alt="Shubman Gill BW" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",display:"block"}}/>
                </div>
              </div>
            </div>
            <div style={{position:"absolute",bottom:4,right:4,width:40,height:40,background:C.gold,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:".75rem",color:C.dark,zIndex:3}}>77</div>
          </div>
          <div style={{animation:"sg-fadeUp .7s .4s ease both"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3rem,16vw,5rem)",lineHeight:.9,color:C.white,letterSpacing:2}}>SHUBMAN</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3.5rem,20vw,6rem)",lineHeight:.9,color:C.gold,letterSpacing:2}}>GILL</div>
            <p style={{fontSize:".6rem",fontWeight:600,letterSpacing:3,color:"rgba(240,244,255,.4)",textTransform:"uppercase",marginTop:12}}>BORN SEP 8, 1999 · PUNJAB</p>
          </div>
          <div style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1rem",color:C.gold,letterSpacing:2}}>Shubman Gill</div>
        </div>
      ) : (
        /* Desktop/Tablet hero — 3 col */
        <div style={{flex:1,display:"grid",gridTemplateColumns:isTablet?"200px 1fr 1fr":"280px 1fr 1fr",alignItems:"center",padding:isTablet?"0 24px":"0 48px",position:"relative",zIndex:3,gap:0}}>
          <div style={{animation:"sg-fadeUp .7s ease both"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:isTablet?"1.8rem":"2.2rem",color:C.saffron,letterSpacing:3,marginBottom:8}}>TEAM INDIA</div>
            <div style={{fontSize:".65rem",fontWeight:700,letterSpacing:4,color:"rgba(240,244,255,.55)",textTransform:"uppercase",marginBottom:20}}>Gujarat Titans · IPL</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["TEST","ODI","T20I"].map(t=>(
                <span key={t} style={{border:"1px solid rgba(240,244,255,.3)",color:"rgba(240,244,255,.7)",padding:"4px 12px",fontSize:".6rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"sg-fadeUp .7s .2s ease both"}}>
            <div style={{position:"relative",width:isTablet?280:360,height:isTablet?340:420,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div className="portrait-flip-wrap" style={{width:isTablet?260:320,height:isTablet?260:320,borderRadius:"50%",border:`3px solid ${C.gold}`,boxShadow:"0 0 0 6px rgba(212,175,55,.15),0 0 60px rgba(212,175,55,.25)",position:"relative",zIndex:2,perspective:900,cursor:"pointer"}}>
                <div className="portrait-flip-inner">
                  <div className="portrait-flip-front">
                    <img src="/assets/hero.png" alt="Shubman Gill" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",display:"block"}}/>
                  </div>
                  <div className="portrait-flip-back">
                    <img src="/assets/hero.png" alt="Shubman Gill BW" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",display:"block"}}/>
                  </div>
                </div>
              </div>
              <div style={{position:"absolute",bottom:50,right:0,width:52,height:52,background:C.gold,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:".85rem",color:C.dark,zIndex:3,boxShadow:"0 4px 16px rgba(212,175,55,.4)"}}>77</div>
            </div>
            <div style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"1.1rem",color:C.gold,letterSpacing:2,marginTop:12}}>Shubman Gill</div>
          </div>
          <div style={{animation:"sg-fadeUp .7s .4s ease both"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",lineHeight:.92,textAlign:"right"}}>
              <div style={{fontSize:isTablet?"10vw":"8vw",color:C.white,display:"block",letterSpacing:2}}>SHUBMAN</div>
              <div style={{fontSize:isTablet?"12vw":"10vw",color:C.gold,display:"block",letterSpacing:2}}>GILL</div>
            </div>
            <p style={{fontSize:".65rem",fontWeight:600,letterSpacing:4,color:"rgba(240,244,255,.45)",textTransform:"uppercase",textAlign:"right",marginTop:16}}>BORN SEP 8, 1999 · PUNJAB</p>
          </div>
        </div>
      )}

      {/* Ticker */}
      <div style={{background:"rgba(0,0,0,.4)",borderTop:"1px solid rgba(212,175,55,.2)",padding:"10px 0",overflow:"hidden",flexShrink:0}}>
        <div style={{display:"flex",animation:"sg-ticker 25s linear infinite",whiteSpace:"nowrap"}}>
          {[...Array(2)].flatMap(()=>[["TEST AVG","47.2"],["ODI AVG","58.1"],["CENTURIES","14+"],["HIGHEST","208*"],["T20I RUNS","1200+"],["MATCHES","100+"]]).map(([label,val],i)=>(
            <span key={i} style={{padding:"0 28px",fontSize:".65rem",fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>
              <span style={{color:C.gold}}>{label} </span><span style={{color:C.white}}>{val}</span>
              <span style={{color:C.saffron,marginLeft:28}}>◆</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────────
function Marquee({texts,reverse}) {
  return (
    <div style={{overflow:"hidden",background:C.gold,padding:"10px 0",borderTop:`2px solid ${C.saffron}`,borderBottom:`2px solid ${C.saffron}`}}>
      <div style={{display:"flex",animation:`sg-marquee 18s linear infinite ${reverse?"reverse":""}`,whiteSpace:"nowrap"}}>
        {[...texts,...texts].map((t,i)=>(
          <span key={i} style={{padding:"0 24px",fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:4,color:C.navy}}>
            {t} <span style={{color:C.saffron}}>//</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Tilt Card ─────────────────────────────────────────────────────────────────
function TiltCard() {
  const ref=useRef();
  const {isMobile}=useBreakpoint();
  const onMove=useCallback((e)=>{
    if(!ref.current) return;
    const r=ref.current.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*18;
    const y=((e.clientY-r.top)/r.height-.5)*-18;
    ref.current.style.transform=`perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.04)`;
  },[]);
  const onLeave=()=>{ if(ref.current) ref.current.style.transform=""; };
  return (
    <div ref={ref} onMouseMove={isMobile?undefined:onMove} onMouseLeave={isMobile?undefined:onLeave}
      style={{position:"relative",height:isMobile?260:380,overflow:"hidden",cursor:"pointer",border:"1px solid rgba(212,175,55,.3)",transition:"box-shadow .2s",background:"linear-gradient(135deg,#0a2040,#1A3A6B)"}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.12) 2px,rgba(0,0,0,.12) 4px)",pointerEvents:"none",zIndex:2}}/>
      <img src="/assets/short_cover.jpg" alt="Signature Shot" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 30%",display:"block",transform:"scale(1.05)"}}/>
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(1,13,31,.92) 0%,rgba(1,13,31,.3) 60%,transparent 100%)"}}/>
      <div style={{position:"absolute",bottom:20,left:20,fontSize:".65rem",color:C.saffron,letterSpacing:3,fontWeight:700,textTransform:"uppercase"}}>Signature Shot</div>
    </div>
  );
}

// ── Stat Block ────────────────────────────────────────────────────────────────
function StatBlock({stat,active}) {
  const val=useCountUp(stat.target,active);
  const display=stat.display||(stat.target?val.toLocaleString()+stat.suffix:"—");
  return (
    <div style={{background:"#0d1b2e",border:"1px solid rgba(255,255,255,.06)",padding:"24px 20px",transition:"background .25s,border-color .25s",cursor:"default"}}
      onMouseEnter={e=>{e.currentTarget.style.background="#101e32";e.currentTarget.style.borderColor="rgba(212,175,55,.25)";}}
      onMouseLeave={e=>{e.currentTarget.style.background="#0d1b2e";e.currentTarget.style.borderColor="rgba(255,255,255,.06)";}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(2rem,4vw,4rem)",color:C.white,lineHeight:1}}>{display}</div>
      <div style={{fontSize:".58rem",fontWeight:700,letterSpacing:3,color:C.gold,textTransform:"uppercase",marginTop:8}}>{stat.label}</div>
      <div style={{fontSize:".68rem",color:"rgba(240,244,255,.4)",marginTop:4}}>{stat.sub}</div>
    </div>
  );
}

// ── Stats Section ─────────────────────────────────────────────────────────────
function StatsSection() {
  const ref=useRef();
  const inView=useInView(ref,0.3);
  const {isMobile,isTablet}=useBreakpoint();
  return (
    <section id="stats" style={{padding:isMobile?"60px 20px":"100px 40px",background:`linear-gradient(to bottom,${C.dark},#040f24)`}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <SectionLabel>Performance Metrics</SectionLabel>
        <SectionTitle>BY THE NUMBERS</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"1fr":"1fr 1fr",gap:isMobile?24:32,alignItems:"start"}}>
          <div>
            <TiltCard/>
            <div style={{marginTop:12,padding:"14px 18px",background:"rgba(212,175,55,.05)",borderLeft:`3px solid ${C.gold}`}}>
              <div style={{fontSize:".65rem",color:C.saffron,letterSpacing:3,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Batting Style</div>
              <div style={{fontSize:".95rem",fontWeight:600}}>Right-hand bat · Top Order</div>
              <div style={{fontSize:".72rem",color:"rgba(240,244,255,.45)",marginTop:4,lineHeight:1.6}}>Known for elegant stroke play & wristy flicks. Debut 2019 vs West Indies.</div>
            </div>
          </div>
          <div ref={ref} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:2}}>
            {STATS.map(s=><StatBlock key={s.id} stat={s} active={inView}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Quote Section ─────────────────────────────────────────────────────────────
function QuoteSection() {
  const ref=useRef();
  const inView=useInView(ref,0.3);
  const {isMobile,isTablet}=useBreakpoint();
  const parts=[
    {text:"when people tell you that ",highlight:false},
    {text:"you can't do it",highlight:true},
    {text:" and you know deep down that ",highlight:false},
    {text:"you can",highlight:true},
    {text:", that is where the real fun lies",highlight:false},
  ];
  return (
    <section ref={ref} style={{padding:isMobile?"70px 24px":"110px 40px",background:`linear-gradient(to bottom,#040f24,${C.dark})`,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,background:"repeating-linear-gradient(75deg,transparent,transparent 80px,rgba(212,175,55,.02) 80px,rgba(212,175,55,.02) 82px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:isMobile?0:-20,left:isMobile?10:40,fontFamily:"Georgia,serif",fontSize:isMobile?"40vw":"20rem",color:"rgba(212,175,55,.04)",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>"</div>

      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:1,display:"grid",gridTemplateColumns:isMobile?"1fr":isTablet?"280px 1fr":"360px 1fr",gap:isMobile?32:56,alignItems:"center"}}>

        {/* Left — Shubman image */}
        {!isMobile && (
          <div style={{position:"relative",height:isTablet?320:420,opacity:inView?1:0,transform:inView?"translateX(0)":"translateX(-30px)",transition:"all .8s ease"}}>
            {/* Gold border frame */}
            <div style={{position:"absolute",top:12,left:12,right:-12,bottom:-12,border:`2px solid rgba(212,175,55,.3)`,zIndex:0,borderRadius:2}}/>
            <img
              src="/assets/Subhman.png"
              alt="Shubman Gill"
              style={{position:"relative",zIndex:1,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block",borderRadius:2,filter:"brightness(.9) contrast(1.05)"}}
            />
            {/* Bottom gradient fade */}
            <div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",background:`linear-gradient(to top,#040f24,transparent)`,zIndex:2,borderRadius:2}}/>
            {/* Gold accent line */}
            <div style={{position:"absolute",top:0,left:0,width:4,height:"60%",background:`linear-gradient(to bottom,${C.gold},transparent)`,zIndex:3}}/>
          </div>
        )}

        {/* Right — quote text */}
        <div>
          {/* Mobile image — smaller, above text */}
          {isMobile && (
            <div style={{position:"relative",height:200,marginBottom:24,opacity:inView?1:0,transition:"all .8s ease"}}>
              <img src="/assets/Subhman.png" alt="Shubman Gill"
                style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 20%",display:"block",borderRadius:4,filter:"brightness(.9)"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:"40%",background:`linear-gradient(to top,#040f24,transparent)`}}/>
            </div>
          )}

          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28,opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(20px)",transition:"all .6s ease"}}>
            <div style={{width:40,height:2,background:C.gold}}/>
            <span style={{fontSize:".65rem",fontWeight:700,letterSpacing:5,color:C.gold,textTransform:"uppercase"}}>Shubman Gill</span>
          </div>

          <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:isMobile?"clamp(1.8rem,8vw,2.8rem)":"clamp(1.8rem,3vw,3rem)",lineHeight:1.3,letterSpacing:isMobile?1:2,opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(30px)",transition:"all .75s .15s ease"}}>
            {parts.map((p,i)=>(
              <span key={i} style={{color:p.highlight?C.saffron:"rgba(240,244,255,.88)"}}>{p.text}</span>
            ))}
          </p>

          <div style={{display:"flex",alignItems:"center",gap:14,marginTop:32,justifyContent:"flex-end",opacity:inView?1:0,transform:inView?"translateY(0)":"translateY(20px)",transition:"all .6s .3s ease"}}>
            <span style={{fontSize:".65rem",fontWeight:700,letterSpacing:5,color:"rgba(240,244,255,.35)",textTransform:"uppercase"}}>— SG77</span>
            <div style={{width:40,height:2,background:C.saffron}}/>
          </div>
        </div>

      </div>
    </section>
  );
}
// ── Timeline ──────────────────────────────────────────────────────────────────
function TimelineSection() {
  const sectionRef=useRef();
  const [activeIdx,setActiveIdx]=useState(0);
  const [ballY,setBallY]=useState(0);
  const {isMobile,isTablet}=useBreakpoint();
  const SEGMENT_H=300;
  const TOTAL_SCROLL=SEGMENT_H*(TIMELINE.length-1);
  const trackH=isMobile?300:isTablet?400:500;

  useEffect(()=>{
    const handler=()=>{
      const el=sectionRef.current; if(!el) return;
      const rect=el.getBoundingClientRect();
      const scrolled=Math.max(0,-rect.top);
      const pct=Math.min(scrolled/TOTAL_SCROLL,1);
      const idx=Math.min(Math.floor(pct*(TIMELINE.length-1)+0.3),TIMELINE.length-1);
      setActiveIdx(idx);
      setBallY(pct*trackH);
    };
    window.addEventListener("scroll",handler,{passive:true});
    return ()=>window.removeEventListener("scroll",handler);
  },[TOTAL_SCROLL,trackH]);

  return (
    <section id="timeline" ref={sectionRef} style={{background:C.dark,position:"relative"}}>
      <div style={{height:`calc(100vh + ${TOTAL_SCROLL}px)`}}>
        <div style={{position:"sticky",top:0,height:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",overflow:"hidden"}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"0 20px":"0 40px",width:"100%"}}>
            <SectionLabel>Career Journey</SectionLabel>
            <SectionTitle>THE RISE OF SG77</SectionTitle>

            {isMobile ? (
              /* Mobile: vertical simple layout */
              <div style={{display:"flex",gap:20}}>
                {/* Track */}
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",width:24,flexShrink:0}}>
                  <div style={{position:"absolute",top:0,bottom:0,width:2,background:"rgba(212,175,55,.15)",left:"50%",transform:"translateX(-50%)"}}/>
                  <div style={{position:"absolute",top:0,width:2,background:C.gold,left:"50%",transform:"translateX(-50%)",height:Math.min(ballY,trackH-16),transition:"height .1s linear"}}/>
                  {TIMELINE.map((_,i)=>{
                    const ny=(i/(TIMELINE.length-1))*trackH;
                    const isActive=activeIdx===i,isPast=activeIdx>i;
                    return(
                      <div key={i} style={{position:"absolute",top:ny,left:"50%",transform:"translate(-50%,-50%)",zIndex:2}}>
                        <div style={{width:isActive?12:7,height:isActive?12:7,borderRadius:"50%",background:isActive||isPast?C.gold:"rgba(212,175,55,.3)",boxShadow:isActive?"0 0 0 3px rgba(212,175,55,.25)":"none",transition:"all .4s"}}/>
                      </div>
                    );
                  })}
                  <div style={{position:"absolute",top:Math.min(ballY,trackH-16),left:"50%",transform:"translate(-50%,-50%)",zIndex:10,transition:"top .12s linear",fontSize:"1.2rem",animation:"sg-ballspin 1s linear infinite"}}>🏏</div>
                </div>
                {/* Cards */}
                <div style={{flex:1,position:"relative",height:trackH}}>
                  {TIMELINE.map((item,i)=>(
                    <div key={i} style={{position:"absolute",top:0,left:0,right:0,opacity:activeIdx===i?1:0,transform:activeIdx===i?"translateY(0)":"translateY(16px)",transition:"all .5s",pointerEvents:activeIdx===i?"auto":"none"}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2.8rem",color:C.gold,lineHeight:1}}>{item.year}</div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",lineHeight:1.1,marginBottom:8,color:C.white}}>{item.event}</div>
                      <div style={{fontSize:".78rem",color:"rgba(240,244,255,.6)",lineHeight:1.6}}>{item.desc}</div>
                      <div style={{marginTop:12,display:"flex",gap:6,flexWrap:"wrap"}}>
                        {TIMELINE.map((_,j)=>(
                          <div key={j} style={{width:j===i?18:6,height:3,borderRadius:2,background:j===i?C.gold:"rgba(212,175,55,.2)",transition:"all .4s"}}/>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Desktop/Tablet: 3-col */
              <div style={{display:"grid",gridTemplateColumns:isTablet?"1fr 60px 1fr":"1fr 80px 1fr",gap:0,alignItems:"start",minHeight:trackH}}>
                <div style={{paddingRight:isTablet?20:40,position:"relative",minHeight:trackH,display:"flex",alignItems:"center"}}>
                  {TIMELINE.map((item,i)=>(
                    <div key={i} style={{position:"absolute",opacity:activeIdx===i?1:0,transform:activeIdx===i?"translateX(0) scale(1)":activeIdx<i?"translateX(40px) scale(.97)":"translateX(-40px) scale(.97)",transition:"all .55s cubic-bezier(.4,0,.2,1)",pointerEvents:activeIdx===i?"auto":"none",maxWidth:420}}>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:isTablet?"3.5rem":"5rem",color:C.gold,lineHeight:1,marginBottom:4}}>{item.year}</div>
                      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:isTablet?"1.4rem":"2rem",lineHeight:1.1,marginBottom:12,color:C.white}}>{item.event}</div>
                      <div style={{fontSize:".85rem",color:"rgba(240,244,255,.6)",lineHeight:1.7}}>{item.desc}</div>
                      <div style={{marginTop:16,display:"flex",gap:8}}>
                        {TIMELINE.map((_,j)=>(
                          <div key={j} style={{width:j===i?24:8,height:4,borderRadius:2,background:j===i?C.gold:"rgba(212,175,55,.25)",transition:"all .4s"}}/>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",height:trackH}}>
                  <div style={{position:"absolute",top:0,bottom:0,width:2,background:"rgba(212,175,55,.15)",left:"50%",transform:"translateX(-50%)"}}/>
                  <div style={{position:"absolute",top:0,width:2,background:C.gold,left:"50%",transform:"translateX(-50%)",height:Math.min(ballY,trackH-24),transition:"height .1s linear"}}/>
                  {TIMELINE.map((_,i)=>{
                    const ny=(i/(TIMELINE.length-1))*trackH;
                    const isActive=activeIdx===i,isPast=activeIdx>i;
                    return(
                      <div key={i} style={{position:"absolute",top:ny,left:"50%",transform:"translate(-50%,-50%)",zIndex:2}}>
                        <div style={{width:isActive?14:8,height:isActive?14:8,borderRadius:"50%",background:isActive||isPast?C.gold:"rgba(212,175,55,.3)",boxShadow:isActive?"0 0 0 4px rgba(212,175,55,.25),0 0 16px rgba(212,175,55,.4)":"none",transition:"all .4s"}}/>
                      </div>
                    );
                  })}
                  <div style={{position:"absolute",top:Math.min(ballY,trackH-24),left:"50%",transform:"translate(-50%,-50%)",zIndex:10,transition:"top .12s linear",fontSize:"1.6rem",filter:"drop-shadow(0 0 8px rgba(212,175,55,.7))",animation:"sg-ballspin 1s linear infinite"}}>🏏</div>
                </div>
                <div style={{paddingLeft:isTablet?20:40,display:"flex",flexDirection:"column",justifyContent:"space-between",height:trackH}}>
                  {TIMELINE.map((item,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,opacity:activeIdx===i?1:0.35,transform:activeIdx===i?"translateX(0)":"translateX(8px)",transition:"all .4s"}}>
                      <div style={{width:activeIdx===i?20:8,height:2,background:activeIdx===i?C.saffron:"rgba(212,175,55,.3)",transition:"all .4s",flexShrink:0}}/>
                      <div>
                        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:activeIdx===i?"1.5rem":"1.1rem",color:activeIdx===i?C.gold:"rgba(212,175,55,.4)",transition:"all .4s",lineHeight:1}}>{item.year}</div>
                        <div style={{fontSize:".62rem",fontWeight:700,letterSpacing:2,color:activeIdx===i?C.saffron:"rgba(240,244,255,.2)",textTransform:"uppercase",transition:"all .4s"}}>{item.event}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Brand Collabs ─────────────────────────────────────────────────────────────
function BrandCard({brand}) {
  const [hovered,setHovered]=useState(false);
  return (
    <div onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{width:160,height:90,flexShrink:0,background:hovered?"rgba(212,175,55,.08)":"rgba(255,255,255,.03)",border:`1px solid ${hovered?"rgba(212,175,55,.4)":"rgba(255,255,255,.07)"}`,borderRadius:8,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,cursor:"pointer",transition:"all .3s",transform:hovered?"translateY(-4px) scale(1.04)":"translateY(0) scale(1)",boxShadow:hovered?`0 8px 28px rgba(0,0,0,.4),0 0 0 1px ${brand.color}44`:"none",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:hovered?brand.color:"transparent",transition:"background .3s"}}/>
      <img src={`/assets/brands/${brand.name.toLowerCase().replace(/ /g,"-")}.png`} alt={brand.name}
        onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}}
        style={{width:90,height:36,objectFit:"contain",filter:hovered?"brightness(1.1)":"brightness(.7) grayscale(30%)",transition:"filter .3s"}}/>
      <div style={{display:"none",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.3rem",color:hovered?brand.color:"rgba(240,244,255,.35)",letterSpacing:2,transition:"color .3s"}}>{brand.abbr}</div>
      <div style={{fontSize:".55rem",fontWeight:700,letterSpacing:2,color:hovered?"rgba(212,175,55,.7)":"rgba(240,244,255,.2)",textTransform:"uppercase",transition:"color .3s"}}>{brand.name}</div>
    </div>
  );
}

function BrandCollabs() {
  const {isMobile}=useBreakpoint();
  const doubled=[...BRANDS,...BRANDS];
  return (
    <section style={{padding:isMobile?"60px 0":"90px 0 80px",background:`linear-gradient(to bottom,${C.dark},#040f24)`,overflow:"hidden"}}>
      <div style={{maxWidth:1300,margin:"0 auto 40px",padding:isMobile?"0 20px":"0 40px"}}>
        <SectionLabel>Partnerships</SectionLabel>
        <SectionTitle>BRAND COLLABS</SectionTitle>
        <p style={{fontSize:".82rem",color:"rgba(240,244,255,.4)",marginTop:-30,letterSpacing:1}}>Trusted by the world's leading brands</p>
      </div>
      <div style={{overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",left:0,top:0,bottom:0,width:80,background:`linear-gradient(to right,${C.dark},transparent)`,zIndex:2,pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:"linear-gradient(to left,#040f24,transparent)",zIndex:2,pointerEvents:"none"}}/>
        <div style={{display:"flex",gap:16,animation:"sg-brands 28s linear infinite",width:"max-content",padding:"8px 0"}}
          onMouseEnter={e=>e.currentTarget.style.animationPlayState="paused"}
          onMouseLeave={e=>e.currentTarget.style.animationPlayState="running"}>
          {doubled.map((b,i)=><BrandCard key={i} brand={b}/>)}
        </div>
      </div>
    </section>
  );
}

// ── Socials ───────────────────────────────────────────────────────────────────
function SocialCard({s,i,transform,zIndex,opacity,onEnter,onLeave}) {
  const {isMobile}=useBreakpoint();
  const w=isMobile?160:200, h=isMobile?220:280;
  return (
    <div onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={()=>window.open(s.url,"_blank")}
      style={{position:"absolute",width:w,height:h,borderRadius:12,overflow:"hidden",cursor:"pointer",transform,zIndex,opacity,transition:"all .5s cubic-bezier(.175,.885,.32,1.275)",boxShadow:"0 8px 32px rgba(0,0,0,.6)"}}>
      <img src={`/assets/social-${i+1}.jpg`} alt={s.name} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block",filter:"brightness(.85)"}}/>
      <div style={{position:"absolute",inset:0,background:s.color,zIndex:1,opacity:0.35}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.06) 1px,transparent 1px)",backgroundSize:"20px 20px",zIndex:2}}/>
      <div style={{position:"absolute",top:12,right:12,fontSize:"1.3rem",zIndex:3}}>{s.icon}</div>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:14,background:"linear-gradient(to top,rgba(0,0,0,.85),transparent)",zIndex:3}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.1rem",letterSpacing:3,color:C.white}}>{s.name}</div>
        <div style={{fontSize:".55rem",fontWeight:700,letterSpacing:2,opacity:.75,marginTop:2,textTransform:"uppercase",color:C.white}}>{s.handle}</div>
      </div>
    </div>
  );
}

function SocialsSection() {
  const [deckHovered,setDeckHovered]=useState(false);
  const [hoveredIdx,setHoveredIdx]=useState(-1);
  const {isMobile}=useBreakpoint();
  const N=SOCIALS.length;

  const getTransform=(i)=>{
    if(!deckHovered){
      const offset=i-Math.floor(N/2);
      return `translateX(${offset*8}px) rotate(${offset*3}deg)`;
    }
    const angle=-50+(i/(N-1))*100;
    const rad=angle*Math.PI/180;
    const R=isMobile?150:200;
    const tx=Math.sin(rad)*R;
    const ty=(1-Math.cos(rad))*R;
    const rot=angle*0.5;
    const isH=hoveredIdx===i;
    return `translate(${tx}px,${ty+(isH?-16:0)}px) rotate(${rot}deg) scale(${isH?1.1:1})`;
  };

  return (
    <section id="socials" style={{padding:isMobile?"60px 20px":"100px 40px",background:`linear-gradient(to bottom,#040f24,${C.dark})`}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <SectionLabel>Connect</SectionLabel>
        <SectionTitle>WHAT'S UP ON SOCIALS</SectionTitle>
        <p style={{fontSize:".8rem",color:"rgba(240,244,255,.4)",marginBottom:isMobile?80:100,letterSpacing:1}}>Hover to fan · Click to visit</p>
        <div style={{position:"relative",height:isMobile?280:360,display:"flex",justifyContent:"center",alignItems:"center"}}
          onMouseEnter={()=>setDeckHovered(true)}
          onMouseLeave={()=>{setDeckHovered(false);setHoveredIdx(-1);}}>
          {SOCIALS.map((s,i)=>(
            <SocialCard key={s.name} s={s} i={i}
              transform={getTransform(i)}
              zIndex={hoveredIdx===i?100:i+10}
              opacity={deckHovered&&hoveredIdx>=0&&hoveredIdx!==i?0.7:1}
              onEnter={()=>{setDeckHovered(true);setHoveredIdx(i);}}
              onLeave={()=>setHoveredIdx(-1)}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const [soundOn,setSoundOn]=useState(false);
  const audioRef=useRef(null);
  const {isMobile}=useBreakpoint();

  const toggleSound=()=>{
    if(!audioRef.current){
      const ctx=new(window.AudioContext||window.webkitAudioContext)();
      const bufSize=ctx.sampleRate*3,buf=ctx.createBuffer(1,bufSize,ctx.sampleRate),data=buf.getChannelData(0);
      for(let i=0;i<bufSize;i++) data[i]=(Math.random()*2-1)*.15;
      const src=ctx.createBufferSource();src.buffer=buf;src.loop=true;
      const filter=ctx.createBiquadFilter();filter.type="bandpass";filter.frequency.value=400;filter.Q.value=.4;
      const gain=ctx.createGain();gain.gain.value=.4;
      src.connect(filter);filter.connect(gain);gain.connect(ctx.destination);
      src.start();audioRef.current={src,ctx};setSoundOn(true);
    } else {
      audioRef.current.src.stop();audioRef.current=null;setSoundOn(false);
    }
  };

  return (
    <footer style={{background:"rgba(0,10,20,1)",borderTop:"1px solid rgba(212,175,55,.2)",padding:isMobile?"40px 20px 24px":"60px 40px 30px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:-30,right:-20,fontFamily:"'Bebas Neue',sans-serif",fontSize:"18vw",color:"rgba(212,175,55,.04)",lineHeight:1,pointerEvents:"none",userSelect:"none"}}>SG77</div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"2fr 1fr 1fr",gap:isMobile?32:48,maxWidth:1200,margin:"0 auto 40px"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",color:C.gold,letterSpacing:3,fontStyle:"italic",marginBottom:12}}>SG<span style={{color:C.saffron}}>77</span></div>
          <p style={{fontSize:".8rem",color:"rgba(240,244,255,.5)",lineHeight:1.7,maxWidth:320}}>The official fan hub for Shubman Gill — India's next great batter. Elegant. Fearless. Champion.</p>
          <div style={{display:"flex",gap:8,marginTop:20,flexWrap:"wrap"}}>
            <input placeholder="Your email address" style={{flex:1,minWidth:160,background:"rgba(255,255,255,.05)",border:"1px solid rgba(212,175,55,.3)",padding:"10px 14px",color:C.white,fontSize:".8rem",fontFamily:"inherit"}}/>
            <button style={{background:C.gold,color:C.dark,border:"none",padding:"10px 20px",fontWeight:700,fontSize:".75rem",cursor:"pointer",letterSpacing:1,whiteSpace:"nowrap"}}>JOIN ARMY</button>
          </div>
        </div>
        {[
          {title:"Navigate",links:[["Home","#hero"],["STATS","#stats"],["Career","#timeline"],["Socials","#socials"]]},
          {title:"Follow",  links:[["Instagram","https://www.instagram.com/shubmangill"],["Twitter / X","https://x.com/ShubmanGill"],["LinkedIn","https://in.linkedin.com/in/shubmangill"],["BCCI Profile","https://www.bcci.tv/international/men/players/shubman-gill/62"]]},
        ].map(col=>(
          <div key={col.title}>
            <h4 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.1rem",letterSpacing:3,color:C.gold,marginBottom:16}}>{col.title}</h4>
            <ul style={{listStyle:"none"}}>
              {col.links.map(([label,href])=>(
                <li key={label} style={{marginBottom:8}}>
                  <a href={href} style={{color:"rgba(240,244,255,.5)",textDecoration:"none",fontSize:".8rem"}}
                    onMouseEnter={e=>e.target.style.color=C.gold}
                    onMouseLeave={e=>e.target.style.color="rgba(240,244,255,.5)"}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",fontSize:".7rem",color:"rgba(240,244,255,.3)",paddingTop:20,borderTop:"1px solid rgba(255,255,255,.06)"}}>
        © 2026 SG77 Fan Site · Not affiliated with BCCI or Shubman Gill · Fan-made tribute · Built with 💙 for Indian Cricket
      </div>
    </footer>
  );
}

// ── Global CSS ────────────────────────────────────────────────────────────────
const globalCSS=`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@300;400;500;600;700;900&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  html{scroll-behavior:smooth;}
  body{background:#010D1F;color:#F0F4FF;font-family:'Poppins',sans-serif;overflow-x:hidden;}
  ::-webkit-scrollbar{width:6px;} ::-webkit-scrollbar-track{background:#010D1F;} ::-webkit-scrollbar-thumb{background:#D4AF37;border-radius:3px;}
  @keyframes sg-float{0%{transform:translateY(0) rotate(0deg);opacity:0;}10%{opacity:.8;}90%{opacity:.4;}100%{transform:translateY(-100vh) rotate(720deg) translateX(60px);opacity:0;}}
  @keyframes sg-fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
  @keyframes sg-ticker{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  @keyframes sg-marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  @keyframes sg-brands{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
  @keyframes sg-rotate77{from{transform:translate(-40%,-50%) rotate(0deg);}to{transform:translate(-40%,-50%) rotate(360deg);}}
  @keyframes sg-ballspin{from{transform:translate(-50%,-50%) rotate(0deg);}to{transform:translate(-50%,-50%) rotate(360deg);}}
  .portrait-flip-inner{width:100%;height:100%;position:relative;transition:transform 0.8s cubic-bezier(.4,0,.2,1);transform-style:preserve-3d;}
  .portrait-flip-wrap:hover .portrait-flip-inner{transform:rotateY(180deg);}
  .portrait-flip-front,.portrait-flip-back{position:absolute;inset:0;border-radius:50%;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:flex;align-items:center;justify-content:center;overflow:hidden;}
  .portrait-flip-back{transform:rotateY(180deg);filter:grayscale(100%) contrast(1.1) brightness(0.85);}
  @media(max-width:640px){
    .portrait-flip-wrap:hover .portrait-flip-inner{transform:none;}
    .portrait-flip-wrap:active .portrait-flip-inner{transform:rotateY(180deg);}
  }
`;

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{globalCSS}</style>
      <Navbar/>
      <Hero/>
      <Marquee texts={["TEST CENTURION","FUTURE OF INDIAN CRICKET","SIMPLY ELEGANT","208* VS NEW ZEALAND","IPL CHAMPION","PUNJAB DA MUNDA"]}/>
      <StatsSection/>
      <Marquee texts={["FUTURE OF INDIAN CRICKET","SIMPLY ELEGANT","BORN TO BAT","SG 77","GT CHAMPION 2022","PUNJAB DA MUNDA"]} reverse/>
      <QuoteSection/>
      <TimelineSection/>
      <BrandCollabs/>
      <SocialsSection/>
      <Footer/>
    </>
  );
}
