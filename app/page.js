"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const STICKERS = [
{ id:"s1",  name:"Sakura",      emoji:"\u{1F338}", coins:10,  rarity:"basic",   color:["#ff6eb4","#ff9dd4"], anim:"float",   value:500   },
{ id:"s2",  name:"Star",        emoji:"\u2B50", coins:10,  rarity:"basic",   color:["#fbbf24","#fde68a"], anim:"spin",    value:500   },
{ id:"s3",  name:"Heart",       emoji:"\u{1F497}", coins:15,  rarity:"basic",   color:["#f43f5e","#fb7185"], anim:"pulse",   value:750   },
{ id:"s4",  name:"Flame",       emoji:"\u{1F525}", coins:20,  rarity:"basic",   color:["#f97316","#fb923c"], anim:"wiggle",  value:1000  },
{ id:"s5",  name:"Ice",         emoji:"\u2744\uFE0F", coins:20,  rarity:"basic",   color:["#67e8f9","#a5f3fc"], anim:"float",   value:1000  },
{ id:"s6",  name:"Clap",        emoji:"\u{1F44F}", coins:25,  rarity:"basic",   color:["#fcd34d","#fef3c7"], anim:"shake",   value:1250  },
{ id:"s7",  name:"Kitsune",     emoji:"\u{1F98A}", coins:50,  rarity:"rare",    color:["#f97316","#7c3aed"], anim:"bounce",  value:3000  },
{ id:"s8",  name:"Dragon",      emoji:"\u{1F409}", coins:80,  rarity:"rare",    color:["#16a34a","#4ade80"], anim:"roar",    value:4800  },
{ id:"s9",  name:"Oni",         emoji:"\u{1F479}", coins:80,  rarity:"rare",    color:["#dc2626","#f87171"], anim:"shake",   value:4800  },
{ id:"s10", name:"Mochi",       emoji:"\u{1F361}", coins:50,  rarity:"rare",    color:["#ec4899","#f9a8d4"], anim:"bounce",  value:3000  },
{ id:"s11", name:"Shuriken",    emoji:"\u{1F31F}", coins:100, rarity:"rare",    color:["#0ea5e9","#7dd3fc"], anim:"spin",    value:6000  },
{ id:"s12", name:"Katana",      emoji:"\u2694\uFE0F", coins:120, rarity:"rare",    color:["#94a3b8","#e2e8f0"], anim:"slash",   value:7200  },
{ id:"s13", name:"Tenshi",      emoji:"\u{1F47C}", coins:200, rarity:"ultra",   color:["#a78bfa","#ddd6fe"], anim:"fly",     value:14000 },
{ id:"s14", name:"Ryuu God",    emoji:"\u{1F432}", coins:300, rarity:"ultra",   color:["#fbbf24","#f97316"], anim:"roar",    value:21000 },
{ id:"s15", name:"Galaxy",      emoji:"\u{1F30C}", coins:500, rarity:"ultra",   color:["#312e81","#7c3aed"], anim:"orbit",   value:35000 },
{ id:"s16", name:"Hoshi Crown", emoji:"\u{1F451}", coins:1000,rarity:"legend",  color:["#fbbf24","#dc2626"], anim:"explode", value:75000 },
];

const COIN_PACKS = [
{ id:"c1", coins:100,  price:15000,  bonus:0,   label:"Starter",  emoji:"\u{1F4B0}" },
{ id:"c2", coins:300,  price:40000,  bonus:30,  label:"Popular",  emoji:"\u{1F48E}", tag:"\u{1F525} TERLARIS" },
{ id:"c3", coins:700,  price:85000,  bonus:100, label:"Creator",  emoji:"\u{1F3C6}", tag:"\u26A1 VALUE BEST" },
{ id:"c4", coins:2000, price:220000, bonus:400, label:"Legend",   emoji:"\u{1F451}", tag:"\u{1F31F} EXCLUSIF" },
];

const MOCK_GIFTERS = [
{ rank:1, name:"NarutoBoy99", coins:12450, avatar:"\u{1F98A}" },
{ rank:2, name:"SakuraChan",  coins:8200,  avatar:"\u{1F338}" },
{ rank:3, name:"DragonZ",     coins:5500,  avatar:"\u{1F409}" },
{ rank:4, name:"OniKing",     coins:3200,  avatar:"\u{1F479}" },
{ rank:5, name:"MochiLuv",    coins:1800,  avatar:"\u{1F361}" },
];

const MOCK_HOSTS = [
{ id:1, name:"Yuki_draws \u2728",   viewers:"34.2K", emoji:"\u{1F3A8}", genre:"Art",     earning:485000, online:true  },
{ id:2, name:"RafliBeat \u{1F3B5}",   viewers:"21.8K", emoji:"\u{1F3B8}", genre:"Music",   earning:312000, online:true  },
{ id:3, name:"ZoeGaming \u{1F3AE}",   viewers:"58.1K", emoji:"\u{1F579}", genre:"Gaming",  earning:1240000,online:true  },
{ id:4, name:"ChefAnime \u{1F35C}",   viewers:"15.4K", emoji:"\u{1F35C}", genre:"Cooking", earning:198000, online:true  },
];

const fmt   = n => new Intl.NumberFormat("id-ID").format(Math.round(n));
const fmtK  = n => n >= 1000 ? (n/1000).toFixed(1)+"K" : String(n);
const uid   = () => Math.random().toString(36).slice(2,8);
const RARITY_COLOR = { basic:"#6b7280", rare:"#3b82f6", ultra:"#a855f7", legend:"#f59e0b" };
const RARITY_BG    = { basic:"#1f2937", rare:"#1e3a8a", ultra:"#4c1d95", legend:"#78350f" };


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Nunito:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&display=swap');

:root {
--or:#f97316; --orl:#fb923c; --ord:#ea580c;
--bk:#080808; --dk:#0f0f0f; --cd:#181818; --cd2:#202020;
--br:#252525; --br2:#333;
--wh:#f8f8f8; --gy:#888; --gy2:#555;
--pk:#ff6eb4; --cy:#00d4ff; --pu:#8b5cf6; --ye:#fbbf24; --gn:#10b981;
--rb:14px; --rl:20px;
}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'DM Sans',sans-serif;background:var(--bk);color:var(--wh);}
.shell{width:390px;height:844px;background:var(--bk);border-radius:42px;overflow:hidden;display:flex;flex-direction:column;position:relative;border:1.5px solid #2a2a2a;box-shadow:0 0 100px rgba(249,115,22,.12),0 50px 120px rgba(0,0,0,.9);}
.hdr{padding:14px 18px 11px;display:flex;align-items:center;justify-content:space-between;background:var(--dk);border-bottom:1px solid var(--br);flex-shrink:0;z-index:20;}
.logo{font-family:'Space Mono',monospace;font-size:22px;font-weight:700;letter-spacing:-1px;}
.logo b{color:var(--or);}
.hbtn{background:var(--cd);border:1px solid var(--br);color:var(--wh);padding:5px 10px;border-radius:20px;font-size:11px;cursor:pointer;font-family:'DM Sans';transition:all .2s;display:flex;align-items:center;gap:4px;}
.hbtn:hover{border-color:var(--or);color:var(--or);}
.hbtn.hi{background:var(--or);border-color:var(--or);color:#fff;}
.coin-pill{background:linear-gradient(135deg,#78350f,#b45309);border:1px solid #d97706;color:#fde68a;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:800;cursor:pointer;font-family:'Space Mono';display:flex;align-items:center;gap:5px;}
.content{flex:1;overflow-y:auto;overflow-x:hidden;position:relative;}
.content::-webkit-scrollbar{width:3px;}
.content::-webkit-scrollbar-thumb{background:var(--br2);border-radius:2px;}
.nav{display:flex;justify-content:space-around;align-items:center;background:var(--dk);border-top:1px solid var(--br);padding:7px 2px 10px;flex-shrink:0;z-index:20;}
.nbtn{display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;color:var(--gy);cursor:pointer;padding:3px 6px;border-radius:8px;transition:all .2s;min-width:42px;}
.nbtn.act{color:var(--or);}
.nbtn .ni{font-size:17px;}
.nbtn .nl{font-size:9px;font-weight:700;letter-spacing:.3px;}
.ndot{width:4px;height:4px;background:var(--or);border-radius:50%;margin-top:1px;}
.card{background:var(--cd);border:1px solid var(--br);border-radius:var(--rb);overflow:hidden;}
.btn-or{background:var(--or);color:#fff;border:none;border-radius:10px;padding:11px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans';transition:all .2s;}
.btn-or:hover{background:var(--ord);transform:scale(.98);}
.btn-out{background:transparent;color:var(--or);border:1.5px solid var(--or);border-radius:10px;padding:9px 14px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans';transition:all .2s;}
.btn-out:hover{background:rgba(249,115,22,.1);}
.btn-pk{background:linear-gradient(135deg,var(--pk),#c026d3);color:#fff;border:none;border-radius:10px;padding:11px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans';transition:all .2s;}
.inp{background:var(--cd2);border:1px solid var(--br2);color:var(--wh);border-radius:10px;padding:11px 13px;font-size:13px;font-family:'DM Sans';width:100%;outline:none;transition:border-color .2s;}
.inp:focus{border-color:var(--or);}
.inp::placeholder{color:var(--gy);}
.badge{background:var(--or);color:#fff;border-radius:20px;padding:1px 7px;font-size:10px;font-weight:700;}
.blv{background:#dc2626;animation:plive 1.5s infinite;}
@keyframes plive{0%,100%{opacity:1}50%{opacity:.6}}
.fi{margin:0 11px 13px;border-radius:var(--rb);overflow:hidden;border:1px solid var(--br);animation:fu .4s ease both;}
.fva{height:190px;display:flex;align-items:center;justify-content:center;font-size:52px;position:relative;overflow:hidden;}
.fva::before{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.8) 0%,transparent 60%);}
.fpb{position:absolute;width:46px;height:46px;background:rgba(249,115,22,.85);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;cursor:pointer;backdrop-filter:blur(4px);z-index:2;}
.fm{padding:11px;}
.fu2{font-size:12px;font-weight:700;color:var(--or);margin-bottom:3px;}
.fd{font-size:12px;color:#ccc;margin-bottom:6px;line-height:1.4;}
.fac{display:flex;gap:14px;}
.fact{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--gy);cursor:pointer;}
.fact:hover,.fact.lk{color:var(--or);}
@keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.lcard{margin:8px 11px;border-radius:var(--rb);overflow:hidden;border:1px solid var(--br);cursor:pointer;transition:all .2s;position:relative;}
.lcard:hover{border-color:var(--or);transform:translateY(-2px);}
.lprev{height:130px;display:flex;align-items:center;justify-content:center;font-size:44px;position:relative;}
.lover{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.9) 0%,transparent 55%);}
.linfo{padding:10px 12px;display:flex;justify-content:space-between;align-items:center;}
.stream-room{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;background:#000;}
.stream-bg{flex:1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.stream-topbar{position:absolute;top:0;left:0;right:0;z-index:10;padding:12px 14px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(to bottom,rgba(0,0,0,.7),transparent);}
.stream-host-pill{display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.5);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:5px 12px 5px 8px;}
.stream-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;background:var(--or);}
.stream-hn{font-size:12px;font-weight:700;font-family:'Nunito';}
.stream-vw{font-size:10px;color:#aaa;}
.stream-close{width:34px;height:34px;background:rgba(0,0,0,.6);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;color:#fff;}
.gift-feed{position:absolute;left:10px;bottom:200px;width:180px;z-index:10;display:flex;flex-direction:column;gap:4px;pointer-events:none;}
.gf-item{display:flex;align-items:center;gap:6px;background:rgba(0,0,0,.55);backdrop-filter:blur(8px);border-radius:20px;padding:4px 10px 4px 6px;border:1px solid rgba(255,255,255,.08);animation:gfIn .4s ease;font-size:11px;}
@keyframes gfIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
.gf-av{width:22px;height:22px;border-radius:50%;background:var(--cd2);display:flex;align-items:center;justify-content:center;font-size:11px;}
.gf-name{font-weight:700;color:var(--ye);font-size:10px;}
.gf-stk{font-size:14px;}
.cmt-feed{position:absolute;left:10px;bottom:140px;width:200px;z-index:10;display:flex;flex-direction:column;gap:3px;pointer-events:none;}
.cmt-item{font-size:11px;animation:gfIn .3s ease;line-height:1.4;}
.cmt-user{font-weight:700;color:var(--cy);margin-right:4px;}
.earn-bar{position:absolute;top:60px;right:10px;z-index:10;background:rgba(0,0,0,.65);backdrop-filter:blur(10px);border:1px solid rgba(249,115,22,.3);border-radius:12px;padding:8px 12px;text-align:center;min-width:80px;}
.earn-lbl{font-size:9px;color:var(--gy);letter-spacing:1px;text-transform:uppercase;margin-bottom:2px;}
.earn-val{font-size:15px;font-weight:900;color:var(--ye);font-family:'Space Mono';}
.lb-card{position:absolute;top:60px;left:10px;z-index:10;background:rgba(0,0,0,.65);backdrop-filter:blur(10px);border:1px solid rgba(251,191,36,.3);border-radius:12px;padding:8px 10px;min-width:100px;}
.lb-title{font-size:9px;color:var(--ye);font-weight:700;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px;}
.lb-row{display:flex;align-items:center;gap:5px;margin-bottom:3px;}
.lb-rank{font-size:9px;font-family:'Space Mono';color:var(--gy);width:10px;}
.lb-nm{font-size:10px;font-weight:600;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.lb-coins{font-size:9px;color:var(--ye);font-family:'Space Mono';}
.stk-panel{background:rgba(10,10,10,.95);backdrop-filter:blur(16px);border-top:1px solid var(--br2);padding:10px 0 6px;flex-shrink:0;z-index:15;}
.stk-panel-tabs{display:flex;gap:0;padding:0 12px 8px;border-bottom:1px solid var(--br);}
.stk-tab{background:none;border:none;color:var(--gy);font-size:11px;font-weight:600;cursor:pointer;padding:4px 10px;border-radius:12px;font-family:'DM Sans';transition:all .2s;white-space:nowrap;}
.stk-tab.act{background:rgba(249,115,22,.15);color:var(--or);}
.stk-grid{display:flex;gap:8px;padding:8px 12px 4px;overflow-x:auto;scrollbar-width:none;}
.stk-grid::-webkit-scrollbar{display:none;}
.stk-card{flex-shrink:0;width:68px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;perspective:200px;}
.stk-3d{width:58px;height:58px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:28px;position:relative;transform-style:preserve-3d;transition:transform .15s;border:2px solid transparent;overflow:visible;}
.stk-card:hover .stk-3d{transform:rotateX(-15deg) rotateY(12deg) scale(1.08);}
.stk-card:active .stk-3d{transform:rotateX(0deg) rotateY(0deg) scale(.95);}
.stk-3d::before{content:'';position:absolute;inset:0;border-radius:12px;background:inherit;opacity:.5;transform:translateZ(-8px) scale(.9);filter:blur(4px);}
.stk-3d::after{content:'';position:absolute;bottom:-6px;left:10%;width:80%;height:8px;background:rgba(0,0,0,.4);filter:blur(5px);border-radius:50%;transform:translateZ(-20px);}
.stk-name{font-size:9px;font-weight:700;color:var(--wh);text-align:center;font-family:'Nunito';white-space:nowrap;}
.stk-price{display:flex;align-items:center;gap:2px;font-size:9px;font-weight:800;color:var(--ye);font-family:'Space Mono';}
.rarity-gem{width:6px;height:6px;border-radius:1px;transform:rotate(45deg);display:inline-block;}
.send-flash{position:absolute;inset:0;background:rgba(249,115,22,.12);pointer-events:none;z-index:30;animation:sflash .4s ease forwards;}
@keyframes sflash{0%{opacity:1}100%{opacity:0}}
.fly-stk{position:absolute;z-index:35;pointer-events:none;display:flex;flex-direction:column;align-items:center;font-size:44px;animation:flyUp 2.8s ease forwards;transform-origin:center bottom;filter:drop-shadow(0 0 12px currentColor);}
.fly-stk.legend-fly{font-size:64px;animation:flyUpBig 3.2s ease forwards;}
.fly-stk-name{font-size:11px;font-weight:800;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.8);font-family:'Nunito';margin-top:2px;}
@keyframes flyUp{0%{opacity:0;transform:translateY(0) scale(.5) rotate(-8deg)}10%{opacity:1;transform:translateY(-30px) scale(1.2) rotate(5deg)}20%{transform:translateY(-60px) scale(1) rotate(-3deg)}80%{opacity:1;transform:translateY(-300px) scale(1) rotate(2deg)}100%{opacity:0;transform:translateY(-360px) scale(.8) rotate(5deg)}}
@keyframes flyUpBig{0%{opacity:0;transform:translateY(0) scale(.3) rotate(-12deg)}10%{opacity:1;transform:translateY(-20px) scale(1.4) rotate(8deg)}20%{transform:translateY(-50px) scale(1.1) rotate(-5deg)}50%{opacity:1;transform:translateY(-200px) scale(1.1) rotate(3deg)}100%{opacity:0;transform:translateY(-420px) scale(.6) rotate(15deg)}}
.anim-float{animation:afloat 2s ease-in-out infinite;}
.anim-spin{animation:aspin 1.5s linear infinite;}
.anim-pulse{animation:apulse 1s ease-in-out infinite;}
.anim-wiggle{animation:awiggle .5s ease-in-out infinite alternate;}
.anim-shake{animation:ashake .4s ease-in-out infinite;}
.anim-bounce{animation:abounce .6s ease infinite alternate;}
.anim-roar{animation:aroar .8s ease-in-out infinite;}
.anim-slash{animation:aslash .5s ease-in-out infinite alternate;}
.anim-fly{animation:afly 1.2s ease-in-out infinite;}
.anim-orbit{animation:aspin 2s linear infinite;}
.anim-explode{animation:aexplode 1s ease-in-out infinite;}
@keyframes afloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes aspin{to{transform:rotate(360deg)}}
@keyframes apulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes awiggle{from{transform:rotate(-8deg)}to{transform:rotate(8deg)}}
@keyframes ashake{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
@keyframes abounce{from{transform:translateY(0)}to{transform:translateY(-5px)}}
@keyframes aroar{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(1.15) rotate(-5deg)}}
@keyframes aslash{from{transform:rotate(-15deg)}to{transform:rotate(15deg)}}
@keyframes afly{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-6px) rotate(5deg)}}
@keyframes aexplode{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.2);filter:brightness(1.5) drop-shadow(0 0 8px gold)}}
.stream-input-bar{display:flex;align-items:center;gap:8px;padding:8px 12px;background:rgba(10,10,10,.9);backdrop-filter:blur(12px);border-top:1px solid var(--br);}
.stream-inp{flex:1;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;border-radius:20px;padding:8px 14px;font-size:12px;font-family:'DM Sans';outline:none;}
.stream-inp:focus{border-color:rgba(249,115,22,.5);}
.stream-inp::placeholder{color:rgba(255,255,255,.35);}
.send-cmt-btn{background:var(--or);border:none;color:#fff;width:34px;height:34px;border-radius:50%;font-size:14px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.cshop-overlay{position:absolute;inset:0;background:rgba(0,0,0,.8);z-index:60;display:flex;align-items:flex-end;}
.cshop-sheet{background:#0f0f0f;border-radius:22px 22px 0 0;width:100%;padding:20px;border-top:1px solid var(--br);animation:slideUp .3s ease;}
.cpack{background:linear-gradient(135deg,#1a1200,#1a0a00);border:1.5px solid #444;border-radius:14px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
.cpack:hover{border-color:var(--or);transform:scale(1.01);}
.cpack-tag{position:absolute;top:8px;right:8px;background:var(--or);color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:10px;font-family:'Nunito';}
.cpack-icon{font-size:32px;}
.cpack-label{font-size:13px;font-weight:800;font-family:'Nunito';}
.cpack-coins{font-size:20px;font-weight:900;color:var(--ye);font-family:'Space Mono';}
.cpack-price{font-size:12px;color:var(--gy);font-family:'DM Sans';}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 11px 11px;}
.pc{background:var(--cd);border:1px solid var(--br);border-radius:var(--rb);overflow:hidden;cursor:pointer;transition:all .2s;}
.pc:hover{border-color:var(--or);transform:translateY(-2px);}
.pi{height:95px;display:flex;align-items:center;justify-content:center;font-size:38px;background:var(--cd2);}
.pb{padding:9px;}
.pn{font-size:11px;font-weight:600;margin-bottom:3px;line-height:1.3;}
.pp{font-size:12px;font-weight:700;color:var(--or);margin-bottom:3px;}
.pm{font-size:10px;color:var(--gy);}
.bal-card{margin:12px;background:linear-gradient(135deg,#1a0f00,#2d1500,#1a0f00);border:1px solid var(--ord);border-radius:var(--rb);padding:20px;position:relative;overflow:hidden;}
.bal-card::before{content:'';position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,rgba(249,115,22,.18),transparent 70%);}
.srow{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--br);}
.srow:last-child{border-bottom:none;}
.tx-item{display:flex;justify-content:space-between;padding:10px 15px;border-bottom:1px solid var(--br);}
.tx-l{display:flex;align-items:center;gap:9px;}
.tx-ic{width:33px;height:33px;background:var(--cd2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;}
.ci{display:flex;align-items:center;gap:11px;padding:11px 15px;border-bottom:1px solid var(--br);cursor:pointer;transition:background .2s;}
.ci:hover{background:var(--cd);}
.cav{width:43px;height:43px;background:var(--cd2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:19px;position:relative;flex-shrink:0;}
.odot{position:absolute;bottom:1px;right:1px;width:10px;height:10px;background:#22c55e;border:2px solid var(--dk);border-radius:50%;}
.ai-bub{max-width:82%;padding:10px 13px;border-radius:14px;font-size:12px;line-height:1.55;}
.ai-bub.bot{background:var(--cd);border:1px solid var(--br);align-self:flex-start;border-radius:4px 14px 14px 14px;}
.ai-bub.usr{background:var(--or);color:#fff;align-self:flex-end;border-radius:14px 4px 14px 14px;}
.ai-dot{width:6px;height:6px;background:var(--gy);border-radius:50%;animation:aidot 1.2s ease infinite;}
.ai-dot:nth-child(2){animation-delay:.2s;}
.ai-dot:nth-child(3){animation-delay:.4s;}
@keyframes aidot{0%,80%,100%{transform:scale(.8);opacity:.5}40%{transform:scale(1);opacity:1}}
.pav-big{width:70px;height:70px;background:linear-gradient(135deg,var(--or),var(--ord));border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 11px;}
.mi{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;border-bottom:1px solid var(--br);cursor:pointer;transition:background .2s;}
.mi:hover{background:var(--cd);}
.mic{width:31px;height:31px;background:var(--cd2);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;}
.moverlay{position:absolute;inset:0;background:rgba(0,0,0,.75);z-index:50;display:flex;align-items:flex-end;animation:fIn .2s ease;}
.msheet{background:var(--dk);border-radius:20px 20px 0 0;width:100%;max-height:72%;overflow-y:auto;padding:19px;border-top:1px solid var(--br);animation:slideUp .3s ease;}
@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes fIn{from{opacity:0}to{opacity:1}}
.lg{display:grid;grid-template-columns:1fr 1fr;gap:7px;padding:10px 0;}
.lo{background:var(--cd);border:1.5px solid var(--br);color:var(--wh);border-radius:10px;padding:9px 11px;font-size:11px;font-weight:600;cursor:pointer;text-align:center;transition:all .2s;font-family:'DM Sans';}
.lo:hover{border-color:var(--or);color:var(--or);}
.lo.act{background:var(--or);border-color:var(--or);color:#fff;}
.toast{position:absolute;top:76px;left:50%;transform:translateX(-50%);background:var(--or);color:#fff;padding:9px 18px;border-radius:20px;font-size:12px;font-weight:700;z-index:100;animation:toastA 2.6s ease forwards;white-space:nowrap;pointer-events:none;}
@keyframes toastA{0%{opacity:0;transform:translateX(-50%) translateY(-8px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}72%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-8px)}}
.spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top:2px solid #fff;border-radius:50%;animation:sp .7s linear infinite;display:inline-block;}
@keyframes sp{to{transform:rotate(360deg)}}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 14px 9px;}
.sec-t{font-size:14px;font-weight:700;}
.sec-m{font-size:11px;color:var(--or);cursor:pointer;font-weight:600;}
.role-toggle{display:flex;background:var(--cd2);border-radius:10px;padding:3px;margin:10px 12px;}
.rt-btn{flex:1;padding:8px;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans';transition:all .2s;color:var(--gy);background:none;}
.rt-btn.act{background:var(--or);color:#fff;}
.studio-room{position:absolute;inset:0;z-index:40;display:flex;flex-direction:column;background:#050505;}
.studio-preview{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;}
.studio-bg{position:absolute;inset:0;background:linear-gradient(135deg,#0a0500,#150a00,#0a0500);animation:bgpulse 4s ease-in-out infinite;}
@keyframes bgpulse{0%,100%{background:linear-gradient(135deg,#0a0500,#150a00)}50%{background:linear-gradient(135deg,#120800,#1f0e00)}}
.studio-avatar{font-size:64px;z-index:2;animation:abounce .8s ease infinite alternate;}
.live-ring{position:absolute;width:110px;height:110px;border:3px solid var(--or);border-radius:50%;animation:lring 1.5s ease-in-out infinite;}
@keyframes lring{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.12);opacity:.3}}
.studio-ctrl{display:flex;gap:8px;padding:10px 12px;background:#0a0a0a;border-top:1px solid var(--br);}
`;

const L_PACK = {
ID:{n:"ID",feed:"Beranda",live:"Live",shop:"Toko",pay:"Bayar",msg:"Chat",ai:"AI",me:"Profil",send:"Kirim",gift:"Kirim Gift",coins:"Koin",buy:"Beli Koin",withdraw:"Tarik Dana",deposit:"Top Up",balance:"Saldo",txHistory:"Riwayat",sendMsg:"Ketik pesan...",aiGreet:"Halo! Saya ZAPP AI. Ada yang bisa dibantu?",addCart:"+ Keranjang",checkout:"Bayar",lang:"Bahasa",close:"Tutup",startLive:"Mulai Live",stopLive:"Stop Live",viewerMode:"Penonton",streamerMode:"Streamer",topGifter:"Top Gifter",earning:"Penghasilan",sendComment:"Komentar..."},
EN:{n:"EN",feed:"Home",live:"Live",shop:"Shop",pay:"Pay",msg:"Chat",ai:"AI",me:"Profile",send:"Send",gift:"Send Gift",coins:"Coins",buy:"Buy Coins",withdraw:"Withdraw",deposit:"Top Up",balance:"Balance",txHistory:"History",sendMsg:"Message...",aiGreet:"Hi! I'm ZAPP AI. How can I help?",addCart:"+ Cart",checkout:"Pay",lang:"Language",close:"Close",startLive:"Start Live",stopLive:"Stop Live",viewerMode:"Viewer",streamerMode:"Streamer",topGifter:"Top Gifter",earning:"Earnings",sendComment:"Comment..."},
ZH:{n:"ZH",feed:"首页",live:"直播",shop:"商城",pay:"支付",msg:"消息",ai:"AI",me:"我的",send:"发送",gift:"送礼物",coins:"金币",buy:"购买金币",withdraw:"提现",deposit:"充值",balance:"余额",txHistory:"记录",sendMsg:"发消息...",aiGreet:"你好! 我是 ZAPP AI",addCart:"加购物车",checkout:"结账",lang:"语言",close:"关闭",startLive:"开直播",stopLive:"停止直播",viewerMode:"观众",streamerMode:"主播",topGifter:"打赏榜",earning:"收益",sendComment:"评论..."},
JA:{n:"JA",feed:"ホーム",live:"ライブ",shop:"ショップ",pay:"支払",msg:"チャット",ai:"AI",me:"プロフィール",send:"送る",gift:"ギフト",coins:"コイン",buy:"コイン購入",withdraw:"出金",deposit:"チャージ",balance:"残高",txHistory:"履歴",sendMsg:"メッセージ...",aiGreet:"こんにちは! ZAPP AIです",addCart:"カートへ",checkout:"購入",lang:"言語",close:"閉じる",startLive:"配信開始",stopLive:"配信終了",viewerMode:"視聴者",streamerMode:"配信者",topGifter:"上位ギフター",earning:"収益",sendComment:"コメント..."},
KO:{n:"KO",feed:"홈",live:"라이브",shop:"쇼핑",pay:"결제",msg:"채팅",ai:"AI",me:"프로필",send:"전송",gift:"선물",coins:"코인",buy:"코인구매",withdraw:"출금",deposit:"충전",balance:"잔액",txHistory:"내역",sendMsg:"메시지...",aiGreet:"안녕하세요! ZAPP AI입니다",addCart:"장바구니",checkout:"결제",lang:"언어",close:"닫기",startLive:"방송시작",stopLive:"방송종료",viewerMode:"시청자",streamerMode:"스트리머",topGifter:"선물순위",earning:"수익",sendComment:"댓글..."},
ES:{n:"ES",feed:"Inicio",live:"Directo",shop:"Tienda",pay:"Pagar",msg:"Chat",ai:"IA",me:"Perfil",send:"Enviar",gift:"Enviar Regalo",coins:"Monedas",buy:"Comprar",withdraw:"Retirar",deposit:"Recargar",balance:"Saldo",txHistory:"Historial",sendMsg:"Mensaje...",aiGreet:"Hola! Soy ZAPP AI",addCart:"Agregar",checkout:"Pagar",lang:"Idioma",close:"Cerrar",startLive:"Iniciar",stopLive:"Detener",viewerMode:"Espectador",streamerMode:"Creador",topGifter:"Top Gifter",earning:"Ganancias",sendComment:"Comentar..."},
PT:{n:"PT",feed:"Inicio",live:"Ao Vivo",shop:"Loja",pay:"Pagar",msg:"Chat",ai:"IA",me:"Perfil",send:"Enviar",gift:"Enviar Presente",coins:"Moedas",buy:"Comprar",withdraw:"Sacar",deposit:"Depositar",balance:"Saldo",txHistory:"Historico",sendMsg:"Mensagem...",aiGreet:"Ola! Sou o ZAPP AI",addCart:"Adicionar",checkout:"Pagar",lang:"Idioma",close:"Fechar",startLive:"Iniciar",stopLive:"Encerrar",viewerMode:"Espectador",streamerMode:"Criador",topGifter:"Top Gifter",earning:"Ganhos",sendComment:"Comentar..."},
AR:{n:"AR",feed:"الرئيسية",live:"مباشر",shop:"متجر",pay:"دفع",msg:"رسائل",ai:"ذكاء",me:"حسابي",send:"إرسال",gift:"إرسال هدية",coins:"عملات",buy:"شراء",withdraw:"سحب",deposit:"إيداع",balance:"رصيد",txHistory:"السجل",sendMsg:"رسالة...",aiGreet:"مرحبا! أنا ZAPP AI",addCart:"السلة",checkout:"الدفع",lang:"اللغة",close:"إغلاق",startLive:"بدء البث",stopLive:"إيقاف",viewerMode:"مشاهد",streamerMode:"بث مباشر",topGifter:"المتبرعون",earning:"الأرباح",sendComment:"تعليق..."},
FR:{n:"FR",feed:"Accueil",live:"Direct",shop:"Boutique",pay:"Payer",msg:"Messages",ai:"IA",me:"Profil",send:"Envoyer",gift:"Envoyer Cadeau",coins:"Pieces",buy:"Acheter",withdraw:"Retirer",deposit:"Recharger",balance:"Solde",txHistory:"Historique",sendMsg:"Message...",aiGreet:"Bonjour! Je suis ZAPP AI",addCart:"Panier",checkout:"Payer",lang:"Langue",close:"Fermer",startLive:"Demarrer",stopLive:"Arreter",viewerMode:"Spectateur",streamerMode:"Createur",topGifter:"Top Gifter",earning:"Gains",sendComment:"Commenter..."},
};

const PRODUCTS = [
{id:1,name:"AirPods Pro 3",price:3500000,emoji:"🎧",rating:4.9,sold:"12K"},
{id:2,name:"Batik Premium",price:450000,emoji:"👘",rating:4.8,sold:"8.4K"},
{id:3,name:"Sepatu Lari X9",price:1200000,emoji:"👟",rating:4.7,sold:"5K"},
{id:4,name:"Power Bank 30K",price:320000,emoji:"🔋",rating:4.8,sold:"22K"},
{id:5,name:"Kopi Arabica",price:185000,emoji:"☕",rating:5.0,sold:"31K"},
{id:6,name:"Skincare Set VC",price:780000,emoji:"✨",rating:4.9,sold:"9.2K"},
];
const FEED_ITEMS = [
{id:1,user:"@ZenithStore",emoji:"👗",desc:"NEW ARRIVALS Flash sale -50%!",likes:"128K",bg:"linear-gradient(160deg,#1a1a1a 60%,#f97316 200%)"},
{id:2,user:"@TechVault_ID",emoji:"📱",desc:"iPhone 16 Pro vs S25 — siapa juara?",likes:"342K",bg:"linear-gradient(160deg,#1a1a1a 60%,#fb923c 200%)"},
{id:3,user:"@FoodieJkt",emoji:"🍜",desc:"Resep mie ayam viral bikin nagih!",likes:"87K",bg:"linear-gradient(160deg,#1a1a1a 60%,#ea580c 200%)"},
];
const CHATS = [
{id:1,name:"TechVault Store",av:"📱",last:"Pesanan sudah dikirim!",time:"09:41",unread:2,online:true},
{id:2,name:"ZAPP Support",av:"🛡",last:"Ada yang bisa kami bantu?",time:"Sen",unread:1,online:true},
{id:3,name:"GlowBeauty",av:"✨",last:"Terima kasih sudah belanja!",time:"Min",unread:0,online:false},
];

// --- COMPONENTS ---
function Sticker3D({ s, onClick, size = 58, showName = true }) {
  const gradient = "linear-gradient(135deg, " + s.color[0] + ", " + s.color[1] + ")";
  const rarityC = RARITY_COLOR[s.rarity];
  return (
    <div className="stk-card" onClick={onClick} style={{ width: size + 10 }}>
      <div className="stk-3d" style={{ width: size, height: size, background: gradient, border: "2px solid " + rarityC, boxShadow: "0 4px 12px " + s.color[0] + "55, 0 2px 4px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.25)" }}>
        <span className={"anim-" + s.anim} style={{ display: "block", lineHeight: 1 }}>{s.emoji}</span>
      </div>
      {showName && (<><div className="stk-name">{s.name}</div><div className="stk-price"><span className="rarity-gem" style={{ background: rarityC }} />{s.coins}</div></>)}
    </div>
  );
}

function FlyingSticker({ stk, x, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, []);
  return (
    <div className={"fly-stk" + (stk.rarity === "legend" ? " legend-fly" : "")} style={{ left: x + "px", bottom: "180px" }}>
      {stk.emoji}
      <div className="fly-stk-name">{stk.name}</div>
    </div>
  );
}

function CoinShop({ onClose, onBuy, L }) {
  return (
    <div className="cshop-overlay" onClick={onClose}>
      <div className="cshop-sheet" onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "Nunito" }}>{L.buy}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--gy)", fontSize: 20, cursor: "pointer" }}>X</button>
        </div>
        <div style={{ fontSize: 11, color: "var(--gy)", marginBottom: 14, lineHeight: 1.5 }}>Koin digunakan untuk kirim gift sticker ke streamer favorit kamu. 70% langsung masuk ke kantong streamer!</div>
        {COIN_PACKS.map(cp => (
          <div key={cp.id} className="cpack" onClick={() => onBuy(cp)}>
            {cp.tag && <div className="cpack-tag">{cp.tag}</div>}
            <div className="cpack-icon">{cp.emoji}</div>
            <div style={{ flex: 1 }}>
              <div className="cpack-label">{cp.label}</div>
              <div className="cpack-coins">{cp.coins + (cp.bonus || 0)} <span style={{ fontSize: 12, color: "var(--gy)" }}>koin</span></div>
              {cp.bonus > 0 && <div style={{ fontSize: 10, color: "var(--gn)", fontWeight: 700 }}>+{cp.bonus} BONUS!</div>}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "var(--wh)", fontFamily: "Space Mono" }}>Rp{fmt(cp.price)}</div>
              <div className="cpack-price">{fmt(cp.price / (cp.coins + cp.bonus))} /koin</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StreamRoom({ host, onClose, userCoins, setUserCoins, L }) {
  const [stkTab, setStkTab] = useState("basic");
  const [flyStickers, setFlyStickers] = useState([]);
  const [giftFeed, setGiftFeed] = useState([]);
  const [cmtFeed, setCmtFeed] = useState([{ id:"c0", user:"Gen_Z_Pro", text:"fire" }, { id:"c1", user:"SakuraChan", text:"I love this stream!" }]);
  const [cmtInput, setCmtInput] = useState("");
  const [showCoinShop, setShowCoinShop] = useState(false);
  const [flash, setFlash] = useState(false);
  const [topGifters, setTopGifters] = useState(MOCK_GIFTERS.map(g => ({ ...g })));
  const [hostEarning, setHostEarning] = useState(host.earning);
  const [viewers, setViewers] = useState(parseInt(host.viewers));

  const rarityFilter = { basic: ["basic"], rare: ["rare"], ultra: ["ultra", "legend"] };
  const filtered = STICKERS.filter(s => rarityFilter[stkTab]?.includes(s.rarity));

  const AUTO_CMTS = useMemo(() => ["omg you're so good","keren banget!","LET'S GOOOO","first time watching!","ZAPP is the best","bisa collab gak?","this hits different","100/10","slay","bestie vibes"], []);
  const AUTO_USERS = useMemo(() => ["kawaii_user","DragonFan99","SakuraLover","OniHunter","MochiEater","AnimeKing","ZappFan_","GenZGirl","CoolKid2025","ViralGuy"], []);

  useEffect(() => {
    const t = setInterval(() => {
      const user = AUTO_USERS[Math.floor(Math.random() * AUTO_USERS.length)] + Math.floor(Math.random() * 99);
      const text = AUTO_CMTS[Math.floor(Math.random() * AUTO_CMTS.length)];
      setCmtFeed(p => [...p.slice(-5), { id: uid(), user, text }]);
      setViewers(v => v + Math.floor(Math.random() * 6) - 2);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const s = STICKERS[Math.floor(Math.random() * 8)];
      const gifter = MOCK_GIFTERS[Math.floor(Math.random() * MOCK_GIFTERS.length)];
      addGiftEffect(s, gifter.name);
    }, 7000 + Math.random() * 4000);
    return () => clearInterval(t);
  }, []);

  const addGiftEffect = (s, senderName) => {
    const x = 30 + Math.random() * 200;
    const id = uid();
    setFlyStickers(p => [...p, { id, stk: s, x }]);
    setGiftFeed(p => [...p.slice(-4), { id, name: senderName, emoji: s.emoji, stkName: s.name }]);
    setHostEarning(e => e + Math.round(s.value * 0.7));
    setTopGifters(prev => {
      const idx = prev.findIndex(g => g.name === senderName);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], coins: n[idx].coins + s.coins }; return n.sort((a, b) => b.coins - a.coins); }
      return prev;
    });
  };

  const sendGift = (s) => {
    if (userCoins < s.coins) { setShowCoinShop(true); return; }
    setUserCoins(p => p - s.coins);
    setFlash(true);
    setTimeout(() => setFlash(false), 400);
    addGiftEffect(s, "Kamu");
  };

  const sendComment = () => {
    if (!cmtInput.trim()) return;
    setCmtFeed(p => [...p.slice(-5), { id: uid(), user: "Kamu", text: cmtInput }]);
    setCmtInput("");
  };

  const bg = [["#1a0a00","#2d1500"],["#001a0a","#002d15"],["#0a001a","#15002d"],["#1a1500","#2d2200"]][host.id % 4];

  return (
    <div className="stream-room">
      <div className="stream-bg" style={{ background: "linear-gradient(135deg," + bg[0] + "," + bg[1] + ")" }}>
        <div style={{ fontSize: 72, zIndex: 1, textShadow: "0 0 40px " + STICKERS[host.id % STICKERS.length].color[0] }}>{host.emoji}</div>
        <div style={{ position: "absolute", width: 120, height: 120, border: "2px solid rgba(249,115,22,.4)", borderRadius: "50%", animation: "lring 2s ease-in-out infinite" }} />

        <div className="stream-topbar">
          <div className="stream-host-pill">
            <div className="stream-av">{host.emoji}</div>
            <div><div className="stream-hn">{host.name}</div><div className="stream-vw">{fmtK(Math.max(100, viewers))} viewers</div></div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(8px)", border: "1px solid rgba(249,115,22,.3)", borderRadius: 10, padding: "5px 10px", fontSize: 11, fontWeight: 800, color: "var(--ye)", fontFamily: "Space Mono" }}>{userCoins}</div>
            <div className="stream-close" onClick={onClose}>X</div>
          </div>
        </div>

        <div className="lb-card">
          <div className="lb-title">{L.topGifter}</div>
          {topGifters.slice(0, 3).map((g, i) => (
            <div key={g.rank} className="lb-row"><span className="lb-rank">{["1","2","3"][i]}</span><span className="lb-nm">{g.name}</span><span className="lb-coins">{fmtK(g.coins)}</span></div>
          ))}
        </div>

        <div className="earn-bar">
          <div className="earn-lbl">{L.earning}</div>
          <div className="earn-val">Rp{fmtK(hostEarning)}</div>
          <div style={{ fontSize: 9, color: "var(--gy)", marginTop: 1 }}>70% ke streamer</div>
        </div>

        <div className="gift-feed">
          {giftFeed.map(g => (
            <div key={g.id} className="gf-item"><div className="gf-av">?</div><div><span className="gf-name">{g.name}</span><span style={{ color: "var(--gy)", fontSize: 9 }}> sent </span></div><span className="gf-stk">{g.emoji}</span></div>
          ))}
        </div>

        <div className="cmt-feed">
          {cmtFeed.slice(-4).map(c => (
            <div key={c.id} className="cmt-item"><span className="cmt-user">{c.user}</span><span style={{ color: "var(--wh)", fontSize: 11 }}>{c.text}</span></div>
          ))}
        </div>

        {flyStickers.map(fs => (<FlyingSticker key={fs.id} stk={fs.stk} x={fs.x} onDone={() => setFlyStickers(p => p.filter(x => x.id !== fs.id))} />))}
        {flash && <div className="send-flash" />}
      </div>

      <div className="stream-input-bar">
        <input className="stream-inp" placeholder={L.sendComment} value={cmtInput} onChange={e => setCmtInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendComment()} />
        <button className="send-cmt-btn" onClick={sendComment}>{">"}</button>
        <button style={{ background: "linear-gradient(135deg,var(--pk),#c026d3)", border: "none", color: "#fff", borderRadius: 8, padding: "0 10px", height: 34, fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "DM Sans" }} onClick={() => setShowCoinShop(true)}>{L.buy}</button>
      </div>

      <div className="stk-panel">
        <div className="stk-panel-tabs">
          {[["basic","Basic"],["rare","Rare"],["ultra","Ultra"]].map(([id, label]) => (
            <button key={id} className={"stk-tab " + (stkTab === id ? "act" : "")} onClick={() => setStkTab(id)}>{label}</button>
          ))}
          <button className="stk-tab" style={{ marginLeft: "auto", color: "var(--ye)" }} onClick={() => setShowCoinShop(true)}>{userCoins}</button>
        </div>
        <div className="stk-grid">{filtered.map(s => (<Sticker3D key={s.id} s={s} onClick={() => sendGift(s)} />))}</div>
        <div style={{ fontSize: 10, color: "var(--gy2)", textAlign: "center", padding: "3px 0 2px", fontFamily: "DM Sans" }}>70% penghasilan langsung ke streamer - Klik stiker untuk kirim gift</div>
      </div>

      {showCoinShop && (<CoinShop L={L} onClose={() => setShowCoinShop(false)} onBuy={(cp) => { setUserCoins(p => p + cp.coins + (cp.bonus || 0)); setShowCoinShop(false); }} />)}
    </div>
  );
}

function CreatorStudio({ onClose, L }) {
  const [isLive, setIsLive] = useState(false);
  const [earning, setEarning] = useState(0);
  const [viewers, setViewers] = useState(0);
  const [giftLog, setGiftLog] = useState([]);

  useEffect(() => {
    if (!isLive) return;
    const t = setInterval(() => {
      setViewers(v => v + Math.floor(Math.random() * 12));
      if (Math.random() > 0.5) {
        const s = STICKERS[Math.floor(Math.random() * 12)];
        const gifters = ["OniKing","SakuraChan","DragonZ","StarGirl","MochiLuv"];
        const giftName = gifters[Math.floor(Math.random() * gifters.length)];
        const earned = Math.round(s.value * 0.7);
        setEarning(e => e + earned);
        setGiftLog(p => [...p.slice(-4), { id: uid(), emoji: s.emoji, name: giftName, val: earned }]);
      }
    }, 2000);
    return () => clearInterval(t);
  }, [isLive]);

  return (
    <div className="studio-room">
      <div className="stream-bg" style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div className="studio-bg" />
        {isLive && <div className="live-ring" />}
        <div style={{ fontSize: 64, zIndex: 2, animation: "abounce .8s ease infinite alternate" }}>🎤</div>
        <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6, alignItems: "center" }}>
          <button className="stream-close" onClick={onClose}>X</button>
          {isLive && <span className="badge blv" style={{ fontSize: 11 }}>LIVE</span>}
        </div>
        {isLive && (
          <>
            <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,.7)", backdropFilter: "blur(10px)", border: "1px solid rgba(249,115,22,.4)", borderRadius: 12, padding: "10px 14px", textAlign: "right" }}>
              <div style={{ fontSize: 9, color: "var(--gy)", letterSpacing: 1 }}>PENGHASILAN</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "var(--ye)", fontFamily: "Space Mono" }}>Rp{fmt(earning)}</div>
              <div style={{ fontSize: 9, color: "var(--gn)", marginTop: 2 }}>{fmtK(viewers)} penonton</div>
            </div>
            <div className="gift-feed" style={{ bottom: 20, width: 200 }}>
              {giftLog.map(g => (
                <div key={g.id} className="gf-item"><div className="gf-av">?</div><div><span className="gf-name">{g.name}</span></div><span className="gf-stk">{g.emoji}</span><span style={{ fontSize: 9, color: "var(--gn)", marginLeft: "auto", fontFamily: "Space Mono" }}>+Rp{fmtK(g.val)}</span></div>
              ))}
            </div>
          </>
        )}
        {!isLive && (
          <div style={{ textAlign: "center", zIndex: 2, marginTop: 20 }}>
            <div style={{ fontSize: 13, color: "var(--gy)", marginBottom: 6, fontFamily: "Nunito", fontWeight: 700 }}>Tampilkan bakatmu ke ribuan Gen Z!</div>
            <div style={{ fontSize: 11, color: "var(--gy2)", maxWidth: 220, lineHeight: 1.5 }}>Terima gift sticker dari fans dan hasilkan uang dari siaran live</div>
          </div>
        )}
      </div>
      <div className="studio-ctrl">
        <button className={isLive ? "btn-out" : "btn-or"} style={{ flex: 1 }} onClick={() => { setIsLive(v => !v); if (!isLive) { setEarning(0); setViewers(0); setGiftLog([]); } }}>{isLive ? L.stopLive : L.startLive}</button>
        <button className="btn-or" style={{ padding: "11px 14px" }} onClick={onClose}>X</button>
      </div>
    </div>
  );
}

function TabLive({ userCoins, setUserCoins, L, showToast }) {
  const [activeStream, setActiveStream] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  return (
    <div style={{ paddingBottom: 80, position: "relative" }}>
      <div className="role-toggle">
        <button className={"rt-btn " + (!isCreator ? "act" : "")} onClick={() => setIsCreator(false)}>{L.viewerMode}</button>
        <button className={"rt-btn " + (isCreator ? "act" : "")} onClick={() => setIsCreator(true)}>{L.streamerMode}</button>
      </div>
      {isCreator ? (
        <div style={{ padding: "0 12px" }}>
          <div style={{ background: "linear-gradient(135deg,#1a0a00,#2d1500)", border: "1px solid var(--or)", borderRadius: "var(--rb)", padding: 20, textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎤</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: "Nunito", marginBottom: 4 }}>Creator Studio</div>
            <div style={{ fontSize: 12, color: "var(--gy)", marginBottom: 12, lineHeight: 1.5 }}>Ekspresikan bakatmu! Fans bisa kirim gift sticker 3D dan kamu dapat 70% penghasilan langsung.</div>
            <button className="btn-or" style={{ width: "100%" }} onClick={() => setShowStudio(true)}>{L.startLive}</button>
          </div>
          <div className="card" style={{ padding: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--or)", marginBottom: 8 }}>Tips Gen Z Creator</div>
            {["Be authentic","Interact with gifters","Stream 19:00-22:00","Use trending audio","Collab with creators"].map((t, i) => (
              <div key={i} style={{ fontSize: 11, color: "var(--gy)", padding: "5px 0", borderBottom: "1px solid var(--br)", display: "flex", gap: 8 }}><span style={{ color: "var(--or)" }}>*</span>{t}</div>
            ))}
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--or)", marginBottom: 8 }}>Bagi Hasil Gift Sticker</div>
            <div className="srow"><span style={{ fontSize: 11, color: "var(--gy)" }}>Streamer</span><span style={{ fontSize: 13, fontWeight: 800, color: "#22c55e" }}>70%</span></div>
            <div className="srow"><span style={{ fontSize: 11, color: "var(--gy)" }}>Platform ZAPP</span><span style={{ fontSize: 13, fontWeight: 800, color: "var(--or)" }}>30%</span></div>
            <div style={{ fontSize: 10, color: "var(--gy2)", marginTop: 8 }}>Withdraw langsung ke rekening bank / e-wallet setiap hari</div>
          </div>
        </div>
      ) : (
        <>
          <div className="sec-hdr"><span className="sec-t">Live Sekarang</span><span className="sec-m">Lihat Semua</span></div>
          {MOCK_HOSTS.map(h => (
            <div key={h.id} className="lcard" onClick={() => setActiveStream(h)}>
              <div className="lprev" style={{ background: "linear-gradient(135deg,#1a0f00,#2d1500)" }}>
                <span style={{ fontSize: 44 }}>{h.emoji}</span>
                <div className="lover" />
                <div style={{ position: "absolute", top: 8, left: 8 }}><span className="badge blv">LIVE</span></div>
                <div style={{ position: "absolute", bottom: 8, right: 8, fontSize: 11, color: "#fff" }}>{h.viewers}</div>
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,.5)", borderRadius: 8, padding: "2px 7px", fontSize: 10, color: "var(--ye)", fontFamily: "Space Mono" }}>{h.genre}</div>
              </div>
              <div className="linfo">
                <div><div style={{ fontSize: 13, fontWeight: 700 }}>{h.name}</div><div style={{ fontSize: 11, color: "var(--gy)" }}>Rp{fmtK(h.earning)} earned today</div></div>
                <button className="btn-or" style={{ fontSize: 11, padding: "6px 12px" }}>Tonton</button>
              </div>
            </div>
          ))}
          <div className="sec-hdr"><span className="sec-t">Gift Sticker 3D</span></div>
          <div style={{ padding: "0 12px 8px", display: "flex", gap: 8, overflowX: "auto" }}>
            {STICKERS.slice(0, 8).map(s => (<Sticker3D key={s.id} s={s} onClick={() => showToast("Tonton live dulu untuk kirim " + s.name + "!")} />))}
          </div>
          <div style={{ padding: "0 12px 8px", fontSize: 11, color: "var(--gy)", lineHeight: 1.5 }}>Kirim sticker 3D anime ke streamer favorit kamu! 70% langsung ke kantong streamer</div>
        </>
      )}
      {activeStream && (<StreamRoom host={activeStream} onClose={() => setActiveStream(null)} userCoins={userCoins} setUserCoins={setUserCoins} L={L} />)}
      {showStudio && <CreatorStudio onClose={() => setShowStudio(false)} L={L} />}
    </div>
  );
}

function TabFeed({ L }) {
  const [liked, setLiked] = useState(new Set());
  return (
    <div style={{ paddingTop: 10, paddingBottom: 80 }}>
      <div style={{ padding: "0 11px 9px", display: "flex", gap: 7 }}>
        {["Trending","Video","Shop"].map((f, i) => (
          <button key={i} style={{ background: i === 0 ? "var(--or)" : "var(--cd)", border: "1px solid var(--br)", color: i === 0 ? "#fff" : "var(--gy)", borderRadius: 20, padding: "5px 11px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans" }}>{f}</button>
        ))}
      </div>
      {FEED_ITEMS.map((item, i) => (
        <div key={item.id} className="fi" style={{ animationDelay: i * .08 + "s" }}>
          <div className="fva" style={{ background: item.bg }}><div className="fpb">▶</div></div>
          <div className="fm">
            <div className="fu2">{item.user}</div>
            <div className="fd">{item.desc}</div>
            <div className="fac">
              <span className={"fact " + (liked.has(item.id) ? "lk" : "")} onClick={() => setLiked(p => { const n = new Set(p); n.has(item.id) ? n.delete(item.id) : n.add(item.id); return n; })}>❤ {item.likes}</span>
              <span className="fact">💬 4.2K</span>
              <span className="fact">↗ 21K</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabShop({ showToast, L }) {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const addCart = p => { setCart(prev => { const ex = prev.find(i => i.id === p.id); return ex ? prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...p, qty: 1 }]; }); showToast(p.name + " ditambahkan!"); };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ paddingBottom: 80, position: "relative" }}>
      <div style={{ padding: "10px 11px 7px" }}><div className="inp" style={{ borderRadius: 20, padding: "9px 15px", fontSize: 12 }}>Cari produk...</div></div>
      <div className="pgrid">
        {PRODUCTS.map(p => (
          <div key={p.id} className="pc">
            <div className="pi">{p.emoji}</div>
            <div className="pb">
              <div className="pn">{p.name}</div>
              <div className="pp">Rp{fmt(p.price)}</div>
              <div className="pm">{p.rating} - {p.sold} terjual</div>
              <button className="btn-or" style={{ width: "100%", fontSize: 10, padding: "6px 4px", marginTop: 7 }} onClick={() => addCart(p)}>{L.addCart}</button>
            </div>
          </div>
        ))}
      </div>
      <button style={{ position: "absolute", bottom: 88, right: 14, width: 46, height: 46, background: "var(--or)", border: "none", borderRadius: "50%", fontSize: 19, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(249,115,22,.4)", zIndex: 20 }} onClick={() => setShowCart(true)}>
        🛒{cartCount > 0 && <span style={{ position: "absolute", top: -3, right: -3, width: 17, height: 17, background: "#dc2626", borderRadius: "50%", fontSize: 9, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
      </button>
      {showCart && (
        <div className="moverlay" onClick={() => setShowCart(false)}>
          <div className="msheet" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}><b>{L.checkout} ({cartCount})</b><button onClick={() => setShowCart(false)} style={{ background: "none", border: "none", color: "var(--gy)", fontSize: 18, cursor: "pointer" }}>X</button></div>
            {cart.length === 0 ? <div style={{ textAlign: "center", padding: 28, color: "var(--gy)" }}>Keranjang kosong</div> : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9, paddingBottom: 9, borderBottom: "1px solid var(--br)" }}>
                    <span style={{ fontSize: 26 }}>{item.emoji}</span>
                    <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: 11, color: "var(--or)" }}>Rp{fmt(item.price)} x {item.qty}</div></div>
                    <button onClick={() => setCart(p => p.filter(i => i.id !== item.id))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 15 }}>X</button>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", fontWeight: 700 }}><span>Total</span><span style={{ color: "var(--or)" }}>Rp{fmt(total)}</span></div>
                <button className="btn-or" style={{ width: "100%" }} onClick={() => { setCart([]); setShowCart(false); showToast("Pembayaran berhasil!"); }}>{L.checkout}</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabPay({ L, showToast }) {
  const [balance] = useState(4715000);
  const [simAmt, setSimAmt] = useState("");
  const adminFee = simAmt ? Math.round(Number(simAmt.replace(/\D/g, "")) * .03) : 0;
  const sellerAmt = simAmt ? Number(simAmt.replace(/\D/g, "")) - adminFee : 0;
  return (
    <div style={{ paddingBottom: 80 }}>
      <div className="bal-card">
        <div style={{ fontSize: 10, color: "var(--gy)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{L.balance}</div>
        <div style={{ fontSize: 30, fontWeight: 900, fontFamily: "Space Mono" }}>Rp{fmt(balance)}</div>
        <div style={{ fontSize: 12, color: "var(--or)", marginBottom: 14 }}>IDR - ZAPP Wallet</div>
        <div style={{ display: "flex", gap: 9 }}>
          <button className="btn-or" style={{ flex: 1, fontSize: 12 }} onClick={() => showToast("Proses withdraw...")}>{L.withdraw}</button>
          <button className="btn-out" style={{ flex: 1, fontSize: 12 }} onClick={() => showToast("Top up segera!")}>{L.deposit}</button>
        </div>
      </div>
      <div className="card" style={{ margin: "0 12px 11px", padding: 13 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--or)", marginBottom: 8 }}>Simulasi Split Pembayaran</div>
        <input className="inp" placeholder="Nominal transaksi" value={simAmt} onChange={e => setSimAmt(e.target.value)} style={{ fontSize: 12, marginBottom: 7 }} />
        {simAmt && sellerAmt > 0 && <>
          <div className="srow"><span style={{ fontSize: 11, color: "var(--gy)" }}>Admin 3%</span><span style={{ fontSize: 12, fontWeight: 700, color: "#ef4444" }}>Rp{fmt(adminFee)}</span></div>
          <div className="srow"><span style={{ fontSize: 11, color: "var(--gy)" }}>Seller 97%</span><span style={{ fontSize: 12, fontWeight: 700, color: "var(--or)" }}>Rp{fmt(sellerAmt)}</span></div>
        </>}
      </div>
    </div>
  );
}

function TabChat({ L, showToast }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "10px 11px 7px" }}><div className="inp" style={{ borderRadius: 20, padding: "9px 15px", fontSize: 12 }}>Cari pesan...</div></div>
      {CHATS.map(c => (
        <div key={c.id} className="ci" onClick={() => showToast("Membuka chat " + c.name)}>
          <div className="cav">{c.av}{c.online && <div className="odot" />}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: "var(--gy)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.last}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <span style={{ fontSize: 10, color: "var(--gy)" }}>{c.time}</span>
            {c.unread > 0 && <span className="badge">{c.unread}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TabAI({ L }) {
  const [msgs, setMsgs] = useState([{ role: "bot", text: L.aiGreet }]);
  const [inp, setInp] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);
  useEffect(() => { setMsgs([{ role: "bot", text: L.aiGreet }]); }, [L.aiGreet]);

  const send = async () => {
    const text = inp.trim(); if (!text || loading) return;
    setInp(""); setMsgs(p => [...p, { role: "user", text }]); setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: "You are ZAPP AI, an assistant inside ZAPP super app. Help with products, live gifting, creator tips, payment questions. Be fun, Gen Z-friendly. Keep responses concise. Match the user language.",
          messages: msgs.filter(m => m.text).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })).concat([{ role: "user", content: text }]),
        }),
      });
      const data = await res.json();
      setMsgs(p => [...p, { role: "bot", text: data.content?.[0]?.text || "Oops, coba lagi ya!" }]);
    } catch { setMsgs(p => [...p, { role: "bot", text: "Koneksi error. Coba lagi!" }]); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "10px 15px 7px", background: "var(--dk)", borderBottom: "1px solid var(--br)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg,var(--or),#7c3aed)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🤖</div>
          <div><div style={{ fontSize: 13, fontWeight: 700 }}>ZAPP AI</div><div style={{ fontSize: 10, color: "#22c55e" }}>Online</div></div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 9 }}>
        {msgs.map((m, i) => <div key={i} className={"ai-bub " + (m.role === "user" ? "usr" : "bot")}>{m.text}</div>)}
        {loading && <div className="ai-bub bot" style={{ display: "flex", gap: 4, padding: "10px 13px" }}><div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" /></div>}
        <div ref={endRef} />
      </div>
      <div style={{ fontSize: 10, color: "var(--gy2)", textAlign: "center", padding: "3px 14px", flexShrink: 0 }}>Powered by Claude</div>
      <div style={{ display: "flex", gap: 7, padding: 11, borderTop: "1px solid var(--br)", background: "var(--dk)", flexShrink: 0 }}>
        <input className="inp" style={{ flex: 1, padding: "9px 13px" }} placeholder={L.sendMsg} value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button style={{ background: "var(--or)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: 10, fontSize: 15, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={send} disabled={loading}>
          {loading ? <span className="spin" style={{ width: 13, height: 13 }} /> : ">"}
        </button>
      </div>
    </div>
  );
}

function TabMe({ setShowLang, showToast, L }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ padding: "22px 14px 14px", textAlign: "center" }}>
        <div className="pav-big">👤</div>
        <div style={{ fontSize: 17, fontWeight: 800, fontFamily: "Nunito", marginBottom: 3 }}>Maarten W.</div>
        <div style={{ fontSize: 12, color: "var(--gy)", marginBottom: 14 }}>@maartenw - ZAPP Pro Creator</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 28 }}>
          {[["48K","Followers"],["1.2K","Following"],["312","Sales"]].map(([v,l]) => (
            <div key={l} style={{ textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 900, color: "var(--or)", fontFamily: "Space Mono" }}>{v}</div><div style={{ fontSize: 10, color: "var(--gy)" }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 11px 14px" }}>
        <button className="btn-or" style={{ flex: 1, fontSize: 12 }}>Edit Profil</button>
        <button className="btn-out" style={{ flex: 1, fontSize: 12 }}>Share</button>
      </div>
      <div className="card" style={{ margin: "0 11px", borderRadius: "var(--rb)", overflow: "hidden" }}>
        {[
          { ic:"🌐", lb: L.lang, fn: () => setShowLang(true) },
          { ic:"🔔", lb:"Notifikasi" },
          { ic:"🔒", lb:"Keamanan & Privasi" },
          { ic:"🎁", lb:"Gift Sticker History" },
          { ic:"💰", lb:"Riwayat Pendapatan" },
          { ic:"🎨", lb:"Creator Dashboard" },
          { ic:"❓", lb:"Bantuan" },
          { ic:"🚪", lb:"Keluar", color:"#ef4444" },
        ].map((m, i) => (
          <div key={i} className="mi" onClick={m.fn || (() => showToast(m.lb))}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div className="mic">{m.ic}</div>
              <span style={{ fontSize: 13, fontWeight: 500, color: m.color || "inherit" }}>{m.lb}</span>
            </div>
            <span style={{ color: "var(--gy)", fontSize: 12 }}>{">"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ZappApp() {
  const [tab, setTab] = useState("live");
  const [lang, setLang] = useState("ID");
  const [showLang, setShowLang] = useState(false);
  const [toast, setToast] = useState(null);
  const [userCoins, setUserCoins] = useState(150);
  const L = L_PACK[lang];

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const NAV = [
    { id:"feed", icon:"🏠", label:L.feed },
    { id:"live", icon:"📡", label:L.live },
    { id:"shop", icon:"🛍", label:L.shop },
    { id:"pay",  icon:"💳", label:L.pay  },
    { id:"msg",  icon:"💬", label:L.msg  },
    { id:"ai",   icon:"🤖", label:L.ai   },
    { id:"me",   icon:"👤", label:L.me   },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "#030303", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "DM Sans" }}>
        <div className="shell">
          <div className="hdr">
            <div className="logo">Z<b>A</b>PP</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div className="coin-pill" onClick={() => showToast(userCoins + " koin tersisa")}>{userCoins}</div>
              <button className="hbtn" onClick={() => setShowLang(true)}>{lang}</button>
              <button className="hbtn hi">🔔</button>
            </div>
          </div>

          <div className="content" style={tab === "ai" ? { display: "flex", flexDirection: "column" } : {}}>
            {tab === "feed" && <TabFeed L={L} />}
            {tab === "live" && <TabLive userCoins={userCoins} setUserCoins={setUserCoins} L={L} showToast={showToast} />}
            {tab === "shop" && <TabShop L={L} showToast={showToast} />}
            {tab === "pay"  && <TabPay L={L} showToast={showToast} />}
            {tab === "msg"  && <TabChat L={L} showToast={showToast} />}
            {tab === "ai"   && <TabAI L={L} />}
            {tab === "me"   && <TabMe L={L} setShowLang={setShowLang} showToast={showToast} />}
          </div>

          <div className="nav">
            {NAV.map(n => (
              <button key={n.id} className={"nbtn " + (tab === n.id ? "act" : "")} onClick={() => setTab(n.id)}>
                <span className="ni">{n.icon}</span>
                <span className="nl">{n.label}</span>
                {tab === n.id && <div className="ndot" />}
              </button>
            ))}
          </div>

          {showLang && (
            <div className="moverlay" onClick={() => setShowLang(false)}>
              <div className="msheet" onClick={e => e.stopPropagation()}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <b style={{ fontSize: 14, fontFamily: "Nunito" }}>{L.lang}</b>
                  <button onClick={() => setShowLang(false)} style={{ background: "none", border: "none", color: "var(--gy)", fontSize: 18, cursor: "pointer" }}>X</button>
                </div>
                <div className="lg">
                  {Object.entries(L_PACK).map(([code, pack]) => (
                    <button key={code} className={"lo " + (lang === code ? "act" : "")}
                      onClick={() => { setLang(code); setShowLang(false); showToast(pack.n); }}>
                      {pack.n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </>
  );
}
