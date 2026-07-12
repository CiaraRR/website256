const grid = document.getElementById('cameraGrid');
const timeline = document.getElementById('timeline');
const playBtn = document.getElementById('playBtn');
const rewindBtn = document.getElementById('rewindBtn');
const stopBtn = document.getElementById('stopBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reviewLog = document.getElementById('reviewLog');
const feedCount = document.getElementById('feedCount');
const selectedCamera = document.getElementById('selectedCamera');
const reviewStatus = document.getElementById('reviewStatus');
const footerMessage = document.getElementById('footerMessage');
const systemState = document.getElementById('systemState');
const directorPanel = document.getElementById('directorPanel');
const directorRows = document.getElementById('directorRows');

const state = CCTV_CONFIG.map(x => ({...x, objectUrl:null}));
let selectedIndex = 0;
let playing = false;

function log(message){
  const line=document.createElement('div');
  line.textContent=message;
  reviewLog.prepend(line);
}

function cameraPanel(cam,index){
  const el=document.createElement('article');
  el.className='camera'+(index===0?' selected':'');
  el.dataset.index=index;
  el.innerHTML=`
    <div class="camera-head"><span>${cam.id} | ${cam.name}</span><span>ARCHIVE</span></div>
    <div class="camera-body">
      <video muted loop playsinline preload="metadata"></video>
      <div class="placeholder"><span>NO VIDEO ASSIGNED</span></div>
    </div>
    <div class="camera-foot"><span class="rec">● REC</span><span>ARCHIVE FEED</span></div>`;
  const video=el.querySelector('video');
  const placeholder=el.querySelector('.placeholder');
  if(cam.video) video.src=cam.video;
  video.addEventListener('loadeddata',()=>{placeholder.style.display='none';updateCount()});
  video.addEventListener('error',()=>{placeholder.style.display='grid';updateCount()});
  el.addEventListener('click',()=>select(index));
  el.addEventListener('dblclick',()=>toggleFocus(el));
  return el;
}

function render(){
  grid.innerHTML='';
  state.forEach((cam,i)=>grid.appendChild(cameraPanel(cam,i)));
  updateCount();
}

function videos(){return [...document.querySelectorAll('video')]}
function select(i){
  selectedIndex=i;
  document.querySelectorAll('.camera').forEach((c,n)=>c.classList.toggle('selected',n===i));
  selectedCamera.textContent=state[i].id;
  footerMessage.textContent=`${state[i].id} selected`;
  log(`${state[i].id} selected for review`);
}
function toggleFocus(el){el.classList.toggle('focused')}
function updateCount(){feedCount.textContent=`${videos().filter(v=>v.readyState>=2).length} / 4`}

function setPlaying(on){
  playing=on;
  reviewStatus.textContent=on?'Playing':'Paused';
  systemState.textContent=on?'REVIEWING':'READY';
  playBtn.textContent=on?'❚❚':'►';
  videos().forEach(v=>on?v.play().catch(()=>{}):v.pause());
  log(on?'Synchronized playback started':'Playback paused');
}

playBtn.onclick=()=>setPlaying(!playing);
stopBtn.onclick=()=>{
  setPlaying(false);
  videos().forEach(v=>{if(Number.isFinite(v.duration))v.currentTime=0});
  timeline.value=0; updateTime(); log('Playback stopped');
};
rewindBtn.onclick=()=>jump(-0.10);
forwardBtn.onclick=()=>jump(0.10);

function jump(amount){
  videos().forEach(v=>{
    if(Number.isFinite(v.duration)&&v.duration>0){
      v.currentTime=Math.max(0,Math.min(v.duration,v.currentTime+v.duration*amount));
    }
  });
  const first=videos().find(v=>Number.isFinite(v.duration)&&v.duration>0);
  if(first){timeline.value=Math.round(first.currentTime/first.duration*1000);updateTime()}
}

timeline.oninput=()=>{
  const ratio=Number(timeline.value)/1000;
  videos().forEach(v=>{if(Number.isFinite(v.duration)&&v.duration>0)v.currentTime=v.duration*ratio});
  updateTime();
};

function updateTime(){
  // Timeline remains functional without displaying a date or clock.
}

setInterval(()=>{
  if(!playing)return;
  const first=videos().find(v=>Number.isFinite(v.duration)&&v.duration>0);
  if(first){timeline.value=Math.round(first.currentTime/first.duration*1000);updateTime()}
},250);

function openDirector(){directorPanel.classList.remove('hidden')}
function closeDirector(){directorPanel.classList.add('hidden')}
function buildDirector(){
  directorRows.innerHTML='';
  state.forEach((cam,i)=>{
    const row=document.createElement('div');
    row.className='director-row';
    row.innerHTML=`<b>${cam.id}</b><input type="text" value="${cam.name}"><input type="file" accept="video/mp4,video/webm,video/quicktime">`;
    const name=row.querySelector('input[type=text]');
    const file=row.querySelector('input[type=file]');
    name.onchange=()=>{state[i].name=name.value.trim()||cam.name;render();select(i)};
    file.onchange=()=>{
      const f=file.files[0]; if(!f)return;
      if(state[i].objectUrl)URL.revokeObjectURL(state[i].objectUrl);
      state[i].objectUrl=URL.createObjectURL(f);
      state[i].video=state[i].objectUrl;
      render();select(i);log(`${cam.id} clip loaded: ${f.name}`);
    };
    directorRows.appendChild(row);
  });
}

document.getElementById('directorHotspot').ondblclick=openDirector;
document.getElementById('closeDirector').onclick=closeDirector;
document.getElementById('closeDirectorBottom').onclick=closeDirector;
document.getElementById('resetBtn').onclick=()=>{
  state.forEach((cam,i)=>{
    if(cam.objectUrl)URL.revokeObjectURL(cam.objectUrl);
    Object.assign(cam,CCTV_CONFIG[i],{objectUrl:null});
  });
  render();buildDirector();timeline.value=0;updateTime();setPlaying(false);log('Console reset for next take');
};



const vfxPlate = document.getElementById('vfxPlate');

function setScreenMode(mode){

  document.body.classList.remove('vfx-mode');
  vfxPlate.className = 'vfx-plate hidden';

  document.querySelectorAll('.camera').forEach(cam=>{
    cam.classList.remove('feed-green');
  });

  if(mode === 'green'){
    document.body.classList.add('vfx-mode');
    vfxPlate.className = 'vfx-plate green';
  }

  if(mode === 'black'){
    document.body.classList.add('vfx-mode');
    vfxPlate.className = 'vfx-plate black';
  }

  if(mode === 'feeds'){
    document.querySelectorAll('.camera').forEach(cam=>{
      cam.classList.add('feed-green');
    });
  }
}


document.addEventListener('keydown',e=>{
  if(e.key==='F1'){e.preventDefault();setPlaying(!playing)}
  if(e.key==='F2'){e.preventDefault();select((selectedIndex+1)%4)}
  if(e.key==='F3'){e.preventDefault();toggleFocus(document.querySelectorAll('.camera')[selectedIndex])}
  if(e.key==='F4'){e.preventDefault();jump(.10)}
  if(e.key==='F5'){e.preventDefault();log(`Potential sighting marked on ${state[selectedIndex].id}`);footerMessage.textContent='Potential sighting marked'}
  if(e.key.toLowerCase()==='g'){e.preventDefault();setScreenMode('green')}
  if(e.key.toLowerCase()==='b'){e.preventDefault();setScreenMode('black')}
  if(e.key.toLowerCase()==='v'){e.preventDefault();setScreenMode('feeds')}
  if(e.key.toLowerCase()==='c'){e.preventDefault();setScreenMode('normal')}
  if(e.key.toLowerCase()==='f')document.documentElement.requestFullscreen?.();
  if(e.key==='Escape')closeDirector();
});

render();buildDirector();updateTime();log('CCTV Review Console v3.4 ready');log('Waiting for archived footage');
