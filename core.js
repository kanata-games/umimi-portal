// ウミミポータル 共通部品（core.js）
// ウミミの絵・色変え・勝負服・海のなかま（カード）のデータと描画、共通セーブ「ウミミ帳」。
// 新しいゲームは <script src="core.js"></script> を先に読み込み、window.UMI から使う。
(function(){
'use strict';
const TAU = Math.PI*2;
const hooks = [];
function onAssets(fn){ hooks.push(fn); }
function fireAssets(){ hooks.forEach(f=>{ try{ f(); }catch(e){ console.error(e); } }); }

// ---------- ウミミの色 ----------
const PALS = {
  lavender:{name:'つきよ',   dot:'#b9b6ef'},
  sky:     {name:'みずいろ', dot:'#8fc8ee'},
  sakura:  {name:'さくら',   dot:'#f2b3c5'},
  mint:    {name:'ミント',   dot:'#9edcc4'},
  lemon:   {name:'レモン',   dot:'#efd48b'},
  yozora:  {name:'よぞら',   dot:'#7f7fd0'},
};
const RECOLOR = {lavender:null, sky:{h:203,s:1,l:1.02}, sakura:{h:343,s:.85,l:1.04}, mint:{h:158,s:.75,l:1.03}, lemon:{h:44,s:.9,l:1.06}, yozora:{h:236,s:1,l:.66}};

// ---------- 勝負服 ----------
const COS = Object.assign({ready:false}, {"cw": 240, "ch": 208, "cols": 8, "s": 0.8, "ex": 130, "ey": 165, "m": {"constellation": {"i": 28, "g": 216.2, "lid": "#fdfdff", "le": [-39.0, -3.8]}, "angel": {"i": 35, "g": 218.8, "lid": "#fdfdff", "le": [-39.0, -3.4]}, "gothic": {"i": 12, "g": 225.0, "lid": "#2f2c42", "le": [-39.0, -2.4]}, "idol": {"i": 10, "g": 233.8, "lid": "#fcfdfe", "le": [-39.0, -3.1]}, "space": {"i": 1, "g": 230.0, "lid": "#fdfdff", "le": [-39.0, -2.1]}, "witch": {"i": 4, "g": 216.2, "lid": "#ede3fc", "le": [-39.0, -3.3]}, "miko": {"i": 9, "g": 228.8, "lid": "#fcfdff", "le": [-39.0, -2.4]}, "yukata": {"i": 6, "g": 217.5, "lid": "#fdfdff", "le": [-39.0, -3.7]}, "crown": {"i": 38, "g": 220.0, "lid": "#fdfdff", "le": [-39.0, -3.5]}, "devil": {"i": 37, "g": 216.2, "lid": "#fdfdff", "le": [-39.0, -1.1]}, "sailor": {"i": 41, "g": 221.2, "lid": "#fdfdff", "le": [-39.0, -3.4]}, "ribbon": {"i": 43, "g": 217.5, "lid": "#fcfdff", "le": [-39.0, -3.7]}, "hoodie": {"i": 8, "g": 230.0, "lid": "#fcfdff", "le": [-35.9, -2.9]}, "cat": {"i": 40, "g": 217.5, "lid": "#fcfdff", "le": [-39.0, -3.2]}, "explorer": {"i": 2, "g": 221.2, "lid": "#fdfdff", "le": [-39.0, -3.8]}}});
const COS_KEEP = ['gothic','constellation','devil','witch'];
const DRESSES = {
  constellation:{n:'星座の しょうぶ服', r:'SSR', st:{spd:20,int:15}, u:'u_star'},
  angel:  {n:'天使の しょうぶ服', r:'SSR', st:{sta:20,gut:15}, u:'u_angel'},
  gothic: {n:'月蝕の ゴシックドレス', r:'SSR', st:{pow:20,gut:15}, u:'u_gothic'},
  idol:   {n:'アイドルステージ', r:'SSR', st:{spd:20,gut:15}, u:'u_idol'},
  space:  {n:'宇宙ひこうし', r:'SSR', st:{spd:15,sta:20}, u:'u_space'},
  witch:  {n:'まじょの マント', r:'SR', st:{int:12,pow:8}},
  miko:   {n:'みこ しょうぞく', r:'SR', st:{int:12,sta:8}},
  yukata: {n:'夏まつり ゆかた', r:'SR', st:{gut:12,spd:8}},
  crown:  {n:'王さまの マント', r:'SR', st:{pow:12,gut:8}},
  devil:  {n:'こあくま ドレス', r:'SR', st:{spd:12,pow:8}},
  sailor: {n:'セーラー', r:'R', st:{sta:10}},
  ribbon: {n:'おおきな リボン', r:'R', st:{spd:10}},
  hoodie: {n:'ふわふわ パーカー', r:'R', st:{gut:10}},
  cat:    {n:'にゃんこ フード', r:'R', st:{int:10}},
  explorer:{n:'たんけん セット', r:'R', st:{pow:10}},
};
const DRESS_KEYS = Object.keys(DRESSES);
const DRESS_RATE = {SSR:10, SR:30, R:60};
const DRESS_TICKET_SHARDS = 150;


// ---------- 海のなかま（サポートカード） ----------
const VIS = {res:1.6, ready:false, m:{"jelly":{"w":172,"h":172,"a":"c","y":0},"star":{"w":145,"h":132,"a":"b","y":172},"seahorse":{"w":121,"h":180,"a":"c","y":304},"crab":{"w":180,"h":127,"a":"b","y":484},"dolphin":{"w":236,"h":144,"a":"c","y":611},"penguin":{"w":164,"h":147,"a":"b","y":755},"turtle":{"w":212,"h":145,"a":"b","y":902},"octopus":{"w":164,"h":156,"a":"b","y":1047},"puffer":{"w":161,"h":127,"a":"c","y":1203},"otter":{"w":204,"h":156,"a":"c","y":1330}}};
const CREA = {jelly:'クラゲ', star:'ヒトデ', seahorse:'タツノオトシゴ', crab:'カニ', dolphin:'イルカ', penguin:'ペンギン', turtle:'ウミガメ', octopus:'タコ', puffer:'フグ', otter:'ラッコ'};
const RAR = {
  R:  {bonus:.08, flat:1, bond:15, naka:1.15, rate:79},
  SR: {bonus:.15, flat:2, bond:25, naka:1.25, rate:18},
  SSR:{bonus:.25, flat:3, bond:35, naka:1.35, rate:3},
};
const CARDS = [
  {id:'dolphin_ssr', v:'dolphin', r:'SSR', type:'spd', t:'なみを きる'},
  {id:'turtle_ssr',  v:'turtle',  r:'SSR', type:'sta', t:'千年の たびびと'},
  {id:'crab_ssr',    v:'crab',    r:'SSR', type:'pow', t:'いわくだき'},
  {id:'puffer_ssr',  v:'puffer',  r:'SSR', type:'gut', t:'ぜったい まけない'},
  {id:'octopus_ssr', v:'octopus', r:'SSR', type:'int', t:'うみの はかせ'},
  {id:'penguin_sr',  v:'penguin', r:'SR',  type:'spd', t:'こおりすべり'},
  {id:'otter_sr',    v:'otter',   r:'SR',  type:'sta', t:'ぷかぷか ねむり'},
  {id:'star_sr',     v:'star',    r:'SR',  type:'pow', t:'おうえん団長'},
  {id:'seahorse_sr', v:'seahorse',r:'SR',  type:'gut', t:'うみの きしどう'},
  {id:'jelly_sr',    v:'jelly',   r:'SR',  type:'int', t:'ゆめみる'},
  {id:'seahorse_r',  v:'seahorse',r:'R',   type:'spd', t:'はやおき'},
  {id:'jelly_r',     v:'jelly',   r:'R',   type:'sta', t:'ただよう'},
  {id:'penguin_r',   v:'penguin', r:'R',   type:'pow', t:'よちよち'},
  {id:'star_r',      v:'star',    r:'R',   type:'gut', t:'ねばりづよい'},
  {id:'otter_r',     v:'otter',   r:'R',   type:'int', t:'かんがえる'},
];
const CARD = Object.fromEntries(CARDS.map(c=>[c.id,c]));

// ---------- 絵 ----------
const SPR = {ready:false, sheets:{}, CW:245, CH:222, cx:135};
const FR_GROUND = [194,194,194,194,194,208,208,194,194,194];
function rgb2hsl(r,g,b){ r/=255; g/=255; b/=255; const mx=Math.max(r,g,b), mn=Math.min(r,g,b), l=(mx+mn)/2; if(mx===mn) return [0,0,l];
  const d=mx-mn, s=l>.5?d/(2-mx-mn):d/(mx+mn); const h = mx===r ? (g-b)/d+(g<b?6:0) : mx===g ? (b-r)/d+2 : (r-g)/d+4; return [h*60,s,l]; }
function hsl2rgb(h,s,l){ h=((h%360)+360)%360/360; if(!s) return [l*255,l*255,l*255];
  const q=l<.5?l*(1+s):l+s-l*s, p=2*l-q, f=t=>{ t=(t+1)%1; return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p; };
  return [f(h+1/3)*255,f(h)*255,f(h-1/3)*255]; }
function recolorSheet(img, spec){
  const c=document.createElement('canvas'); c.width=img.width; c.height=img.height; const x=c.getContext('2d'); x.drawImage(img,0,0);
  if(!spec) return c;
  try{
    const d=x.getImageData(0,0,c.width,c.height), p=d.data;
    for(let i=0;i<p.length;i+=4){ if(!p[i+3]) continue; const [h,s,l]=rgb2hsl(p[i],p[i+1],p[i+2]);
      const ch=(Math.max(p[i],p[i+1],p[i+2])-Math.min(p[i],p[i+1],p[i+2]))/255;
      if(ch>.06 && h>=205 && h<=295){ const w=Math.min(1,(ch-.06)/.22); const [r,g,b]=hsl2rgb(spec.h+(h-245)*.5, Math.min(1,s*spec.s), Math.min(.97,l*spec.l)); p[i]+=(r-p[i])*w; p[i+1]+=(g-p[i+1])*w; p[i+2]+=(b-p[i+2])*w; } }
    x.putImageData(d,0,0);
  }catch(e){}
  return c;
}
const sprImg = new Image();
sprImg.onload = () => { SPR.ready = true; fireAssets(); };
sprImg.src = 'umimi-sprites.png';
function sheetFor(col){ if(!SPR.sheets[col]) SPR.sheets[col] = recolorSheet(sprImg, RECOLOR[col]); return SPR.sheets[col]; }
// ウミミを描く。gx,gy=足もと。face=1 で右向き、-1 で左向き。
const cosImg = new Image(); cosImg.onload = () => { COS.ready = true; fireAssets(); }; cosImg.src = 'costumes.png';
const cosSheets = {};
function cosSheetFor(col){
  if(!RECOLOR[col]) return cosImg;
  if(!cosSheets[col]){ const keep = new Set(COS_KEEP.map(k=>COS.m[k] && COS.m[k].i).filter(v=>v!=null));
    cosSheets[col] = recolorSheet(cosImg, RECOLOR[col], {lo:222, hi:275, lmin:.42, skip:(x,y)=>keep.has(Math.floor(y/COS.ch)*COS.cols+Math.floor(x/COS.cw))}); }
  return cosSheets[col];
}
function drawUmi(c, col, frame, gx, gy, scale, face, outfit){
  const cm = outfit && COS.ready && COS.m[outfit];
  if(cm){
    const W1 = COS.cw/COS.s, H1 = COS.ch/COS.s, cx = COS.ex+40, g = cm.g, t = performance.now()/1000;
    const swim = frame===2||frame===3, sleep = frame===5||frame===6, happy = frame>=7;
    const hop = happy ? Math.abs(Math.sin(t*6))*6 : 0, sq = swim ? Math.sin(t*9+gx*.01)*.035 : 0;
    c.save(); c.translate(gx, gy - hop*scale); c.scale(-face*scale*(1+sq), scale*(1-sq));
    if(swim){ c.strokeStyle='rgba(255,255,255,.55)'; c.lineWidth=3; c.beginPath(); c.ellipse(-20,-4,120,14,0,0,Math.PI); c.stroke(); }
    c.drawImage(cosSheetFor(col), (cm.i%COS.cols)*COS.cw, Math.floor(cm.i/COS.cols)*COS.ch, COS.cw, COS.ch, -cx, -g, W1, H1);
    if(sleep){ const ox=-cx, oy=-g; [[COS.ex,COS.ey],[COS.ex+cm.le[0],COS.ey+cm.le[1]]].forEach(([a,b])=>{ c.fillStyle=cm.lid; c.beginPath(); c.ellipse(ox+a,oy+b,7.5,9.5,0,0,TAU); c.fill();
      c.strokeStyle='#2f2b4f'; c.lineWidth=2.6; c.lineCap='round'; c.beginPath(); c.arc(ox+a,oy+b-3,6,.15*Math.PI,.85*Math.PI); c.stroke(); }); }
    c.restore(); return;
  }
  if(!SPR.ready){
    c.fillStyle = PALS[col] ? PALS[col].dot : '#ccc';
    c.beginPath(); c.ellipse(gx, gy-30*scale, 60*scale, 30*scale, 0, 0, TAU); c.fill(); return;
  }
  const sh = sheetFor(col), gnd = FR_GROUND[frame];
  c.save(); c.translate(gx, gy); c.scale(-face*scale, scale);
  c.drawImage(sh, (frame%5)*SPR.CW, Math.floor(frame/5)*SPR.CH, SPR.CW, SPR.CH, -SPR.cx, -gnd, SPR.CW, SPR.CH);
  c.restore();
}
function fitCanvas(cv, maxDpr){
  const r = cv.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio||1, maxDpr||1.5);
  const w = Math.max(1, Math.round(r.width*dpr)), h = Math.max(1, Math.round(r.height*dpr));
  if(cv.width!==w || cv.height!==h){ cv.width=w; cv.height=h; }
  return {w, h, dpr, cw:r.width, ch:r.height};
}
const visImg = new Image();
visImg.onload = () => { VIS.ready = true; fireAssets(); };
visImg.src = 'visitors.png';
// なかまを描く（cx,cy=まんなか、size=おさめる大きさ）
function drawVis(c, k, cx, cy, size, frame, face){
  const m = VIS.m[k]; if(!m) return;
  if(!VIS.ready){ c.fillStyle='#c9cdf2'; c.beginPath(); c.arc(cx,cy,size*.35,0,TAU); c.fill(); return; }
  const s = size/Math.max(m.w,m.h);
  c.save(); c.translate(cx,cy); c.scale(-(face||-1)*s, s);
  c.drawImage(visImg, (frame||0)*m.w, m.y, m.w, m.h, -m.w/2, -m.h/2, m.w, m.h);
  c.restore();
}
function drawIcons(root){
  (root||document).querySelectorAll('canvas[data-dress]').forEach(cv=>{
    const r = cv.getBoundingClientRect(); if(!r.width) return;
    const {w,h} = fitCanvas(cv, 2); const c = cv.getContext('2d'); c.clearRect(0,0,w,h);
    drawUmi(c, cv.dataset.col||'lavender', 0, w*.52, h*.92, h/250, -1, cv.dataset.dress);
  });
  (root||document).querySelectorAll('canvas[data-vis]').forEach(cv=>{
    const r = cv.getBoundingClientRect(); if(!r.width) return;
    const {w,h} = fitCanvas(cv, 2); const c = cv.getContext('2d'); c.clearRect(0,0,w,h);
    drawVis(c, cv.dataset.vis, w/2, h/2, Math.min(w,h)*.92, 0, -1);
  });
}

// ---------- ウミミ帳（全ゲーム共通のセーブ） ----------
// shards=つきのかけら, cards=なかまカード{id:枚数}, ssrTickets/tenCount=なかまガチャ, dresses=勝負服{key:1},
// dressTickets=勝負服チケット, hall=でんどうの子, nextId=でんどうの通し番号
const BOOK_KEY = 'umimi-book-v1';
const BOOK_KEYS = ['shards','cards','ssrTickets','tenCount','dresses','dressTickets','hall','nextId'];
function bookDefault(){ return {shards:600, cards:{}, ssrTickets:0, tenCount:0, dresses:{}, dressTickets:3, hall:[], nextId:1}; }
function loadBook(){
  let b = null; try{ b = JSON.parse(localStorage.getItem(BOOK_KEY)||'null'); }catch(e){}
  const d = bookDefault(); if(!b || typeof b!=='object') return d;
  BOOK_KEYS.forEach(k=>{ if(b[k]===undefined || b[k]===null) b[k] = d[k]; });
  if(!Array.isArray(b.hall)) b.hall = [];
  return b;
}
function saveBook(b){ try{ const o = {}; BOOK_KEYS.forEach(k=>{ o[k]=b[k]; }); localStorage.setItem(BOOK_KEY, JSON.stringify(o)); }catch(e){} }
function hasBook(){ try{ return !!localStorage.getItem(BOOK_KEY); }catch(e){ return false; } }

window.UMI = {TAU, PALS, RECOLOR, COS, COS_KEEP, DRESSES, DRESS_KEYS, DRESS_RATE, DRESS_TICKET_SHARDS, VIS, CREA, RAR, CARDS, CARD, SPR,
  recolorSheet, drawUmi, drawVis, drawIcons, fitCanvas, onAssets, loadBook, saveBook, hasBook, BOOK_KEY, BOOK_KEYS};
})();
