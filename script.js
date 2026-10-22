// Edit these settings to personalize the surprise.
const CONFIG = {
  birthdayISO: '2026-10-23T00:00:00+06:00', // Bangladesh midnight
  birthdayName: 'Susmita'
};

const $ = (id) => document.getElementById(id);
const pages = ['intro','countdownPanel','birthday','reasons','letter','finale'];
let currentPage = 0;
let countdownTimer;
let audioCtx = null;
let musicTimer = null;
let playing = false;
const target = new Date(CONFIG.birthdayISO).getTime();

function showPage(page) {
  currentPage = pages.indexOf(page);
  pages.forEach(id => $(id).classList.toggle('active',id===page));
  $('progressBar').style.width = `${(currentPage+1)/pages.length*100}%`;
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='birthday') { celebrate(110); }
}
function birthdayReady(){return Date.now()>=target;}
function updateCountdown(){
  const remaining = Math.max(0,target-Date.now());
  const days = Math.floor(remaining/86400000);
  const hours = Math.floor(remaining/3600000)%24;
  const minutes = Math.floor(remaining/60000)%60;
  const seconds = Math.floor(remaining/1000)%60;
  [['days',days],['hours',hours],['minutes',minutes],['seconds',seconds]].forEach(([id,v])=>$(id).textContent=String(v).padStart(2,'0'));
  if(remaining<=0 && currentPage===1)showPage('birthday');
}
$('beginBtn').addEventListener('click',()=>{startMusic();showPage(birthdayReady()?'birthday':'countdownPanel');});
$('previewBtn').addEventListener('click',()=>showPage('birthday'));
$('nextWishBtn').addEventListener('click',()=>showPage('reasons'));
$('letterBtn').addEventListener('click',()=>showPage('letter'));
$('openLetterBtn').addEventListener('click',()=>{
  $('envelope').classList.add('hidden');$('openLetterBtn').classList.add('hidden');
  $('letterPaper').classList.remove('hidden');$('finalBtn').classList.remove('hidden');
  shower(22);
});
$('finalBtn').addEventListener('click',()=>showPage('finale'));
$('wishBtn').addEventListener('click',()=>{
  document.querySelector('.cake').classList.add('blown');
  $('wishBtn').classList.add('hidden');
  $('wishResult').classList.remove('hidden');$('replayBtn').classList.remove('hidden');
  celebrate(260); shower(40);
});
$('replayBtn').addEventListener('click',()=>{
  document.querySelector('.cake').classList.remove('blown');
  $('wishBtn').classList.remove('hidden');$('wishResult').classList.add('hidden');
  $('replayBtn').classList.add('hidden');$('letterPaper').classList.add('hidden');
  $('envelope').classList.remove('hidden');$('openLetterBtn').classList.remove('hidden');
  showPage('intro');
});

// Gentle instrumental melody created with Web Audio API, no music files needed.
function tone(freq,when,duration,volume=.045){
  if(!audioCtx)return;
  const oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain();
  oscillator.type='sine';oscillator.frequency.setValueAtTime(freq,when);
  gain.gain.setValueAtTime(.0001,when);gain.gain.exponentialRampToValueAtTime(volume,when+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,when+duration);
  oscillator.connect(gain);gain.connect(audioCtx.destination);
  oscillator.start(when);oscillator.stop(when+duration+.02);
}
const melody=[[392,.4],[440,.4],[523.25,.65],[440,.4],[392,.4],[349.23,.7],[392,.4],[440,.4],[587.33,.65],[523.25,.4],[440,.4],[392,1.1],[0,.3]];
function playMelody(){
  if(!playing||!audioCtx)return;
  let t=audioCtx.currentTime+.05;
  for(const [note,duration] of melody){if(note)tone(note,t,duration*.94);t+=duration;}
  musicTimer=setTimeout(playMelody,(t-audioCtx.currentTime)*1000+220);
}
function startMusic(){
  try{
    if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    audioCtx.resume();if(playing)return;
    playing=true;$('musicBtn').querySelector('span').textContent='Music on';playMelody();
  }catch(err){$('musicBtn').querySelector('span').textContent='Audio unavailable';}
}
function stopMusic(){playing=false;clearTimeout(musicTimer);$('musicBtn').querySelector('span').textContent='Music off';}
$('musicBtn').addEventListener('click',()=>playing?stopMusic():startMusic());

// Canvas night sky + short firework bursts.
const canvas=$('sky');const ctx=canvas.getContext('2d');let width=0,height=0,stars=[],particles=[];
function resize(){
  const dpr=Math.min(window.devicePixelRatio||1,2);width=window.innerWidth;height=window.innerHeight;
  canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(170,Math.round(width*height/7500))},()=>({x:Math.random()*width,y:Math.random()*height,r:.35+Math.random()*1.5,phase:Math.random()*Math.PI*2}));
}
window.addEventListener('resize',resize);resize();
function celebrate(count=100){
  const shades=['#ff9cca','#ffd6a2','#a995ff','#ffffff','#9be4f9'];
  const sources=[{x:width*.25,y:height*.36},{x:width*.75,y:height*.33},{x:width*.5,y:height*.22}];
  for(let i=0;i<count;i++){
    const src=sources[Math.floor(Math.random()*sources.length)];const angle=Math.random()*Math.PI*2,speed=1+Math.random()*6;
    particles.push({x:src.x,y:src.y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:80+Math.random()*45,max:125,color:shades[Math.floor(Math.random()*shades.length)],r:1.5+Math.random()*2.8});
  }
}
function draw(t){
  ctx.clearRect(0,0,width,height);
  for(const star of stars){const a=.3+.5*(.5+.5*Math.sin(t*.0015+star.phase));ctx.globalAlpha=a;ctx.fillStyle='#fff4ff';ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.045;p.vx*=.993;p.life--;ctx.globalAlpha=Math.min(1,p.life/55);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
function shower(n){
  const icons=['🌸','✨','💗','🌷','⭐'];
  for(let i=0;i<n;i++){
    const item=document.createElement('span');item.className='petal';item.textContent=icons[Math.floor(Math.random()*icons.length)];
    item.style.left=`${Math.random()*100}%`;item.style.animationDuration=`${3+Math.random()*4}s`;
    item.style.animationDelay=`${Math.random()*1.7}s`;item.style.setProperty('--drift',`${Math.random()*250-125}px`);
    $('petals').appendChild(item);setTimeout(()=>item.remove(),9000);
  }
}
updateCountdown();countdownTimer=setInterval(updateCountdown,1000);
