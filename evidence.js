const wins = document.getElementById('windows');
const notif = document.getElementById('notifications');
const clock = document.getElementById('clock');
const statusLeft = document.getElementById('statusLeft');
const statusMid = document.getElementById('statusMid');
const minTray = document.getElementById('minTray');
const rail = document.getElementById('timelineRail');
let z = 20;
let openWins = {};
let layoutIndex = 0;
const layoutSlots = [
  {x:28,y:108,w:430,h:365},
  {x:490,y:92,w:520,h:330},
  {x:1040,y:112,w:430,h:330},
  {x:76,y:510,w:440,h:320},
  {x:560,y:455,w:560,h:355},
  {x:880,y:500,w:620,h:365},
  {x:360,y:160,w:650,h:430},
  {x:250,y:300,w:790,h:480}
];
setInterval(()=>clock.textContent=new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),1000);
function setStatus(text){ statusMid.textContent = text; }
function clamp(v,min,max){return Math.max(min,Math.min(max,v));}
function slot(w,h){
  const s=layoutSlots[layoutIndex++ % layoutSlots.length];
  return {x:s.x,y:s.y,w:w||s.w,h:h||s.h};
}
function keepOnScreen(el){
  const pad=8, bottom=32;
  const maxX=Math.max(pad, window.innerWidth-el.offsetWidth-pad);
  const maxY=Math.max(72, window.innerHeight-el.offsetHeight-bottom);
  el.style.left=clamp(parseInt(el.style.left)||pad,pad,maxX)+'px';
  el.style.top=clamp(parseInt(el.style.top)||72,72,maxY)+'px';
}
function addRail(title,sub){
  const div=document.createElement('div'); div.className='railItem';
  div.innerHTML=`<b>${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})} — ${title}</b>${sub||''}`;
  rail.prepend(div);
  while(rail.children.length>9) rail.lastElementChild.remove();
}
function notify(title,msg){
  const n=document.createElement('div'); n.className='notify';
  n.innerHTML=`<b>${title}</b>${msg}<br><small>${new Date().toLocaleTimeString()}</small>`;
  notif.appendChild(n); setTimeout(()=>{n.style.opacity=0;n.style.transform='translateY(12px)'},3600); setTimeout(()=>n.remove(),4200);
}
function flash(){const d=document.createElement('div'); d.className='dimFlash'; document.body.appendChild(d); setTimeout(()=>d.remove(),850)}
function progress(label,pct){return `<p>${label}</p><div class="progress"><div style="width:${pct}%"></div></div>`}
function addMinButton(id,title){
  let b=document.getElementById('min-'+id);
  if(!b){ b=document.createElement('button'); b.className='minBtn'; b.id='min-'+id; minTray.appendChild(b); }
  b.textContent=title;
  b.onclick=()=>{const el=openWins[id]; if(el){el.classList.remove('minimised'); el.style.display='block'; el.style.zIndex=++z;} b.remove();};
}
function makeDraggable(el){
  const bar=el.querySelector('.winTitle'); let sx=0,sy=0,ox=0,oy=0,drag=false;
  bar.addEventListener('mousedown',e=>{ if(e.target.closest('.traffic')) return; if(el.classList.contains('max')) return; drag=true; sx=e.clientX; sy=e.clientY; ox=parseInt(el.style.left)||0; oy=parseInt(el.style.top)||0; el.style.zIndex=++z; el.classList.add('dragging'); e.preventDefault(); });
  window.addEventListener('mousemove',e=>{ if(!drag) return; el.style.left=clamp(ox+e.clientX-sx,4,window.innerWidth-el.offsetWidth-4)+'px'; el.style.top=clamp(oy+e.clientY-sy,72,window.innerHeight-el.offsetHeight-32)+'px'; });
  window.addEventListener('mouseup',()=>{ if(drag){drag=false; el.classList.remove('dragging');} });
  const [min,max,close]=el.querySelectorAll('.traffic span');
  min.onclick=e=>{e.stopPropagation(); el.classList.add('minimised'); el.style.display='none'; addMinButton(el.dataset.id,el.dataset.title)};
  max.onclick=e=>{e.stopPropagation(); toggleMax(el)};
  close.onclick=e=>{e.stopPropagation(); el.remove(); delete openWins[el.dataset.id]; document.getElementById('min-'+el.dataset.id)?.remove();};
  bar.ondblclick=e=>{ if(!e.target.closest('.traffic')) toggleMax(el); };
  const res=el.querySelector('.resizer'); let rs=false,rw=0,rh=0,rx=0,ry=0;
  res.addEventListener('mousedown',e=>{rs=true; rw=el.offsetWidth; rh=el.offsetHeight; rx=e.clientX; ry=e.clientY; el.style.zIndex=++z; e.stopPropagation(); e.preventDefault();});
  window.addEventListener('mousemove',e=>{ if(!rs) return; el.style.width=clamp(rw+e.clientX-rx,320,window.innerWidth-20)+'px'; el.style.height=clamp(rh+e.clientY-ry,220,window.innerHeight-70)+'px'; });
  window.addEventListener('mouseup',()=>rs=false);
}
function toggleMax(el){
  if(el.classList.contains('max')){ el.classList.remove('max'); const p=JSON.parse(el.dataset.prev||'{}'); if(p.left){Object.assign(el.style,p);} keepOnScreen(el); }
  else{ el.dataset.prev=JSON.stringify({left:el.style.left,top:el.style.top,width:el.style.width,height:el.style.height}); el.classList.add('max'); }
  el.style.zIndex=++z;
}
function win(id,title,x,y,w,h,html,opts={}){
  if(openWins[id]) openWins[id].remove();
  const p=(x==null)?slot(w,h):{x,y,w,h};
  const el=document.createElement('div'); el.dataset.id=id; el.dataset.title=title; el.className='win';
  el.style.left=p.x+'px'; el.style.top=p.y+'px'; el.style.width=p.w+'px'; el.style.height=p.h+'px'; el.style.zIndex=++z;
  el.innerHTML=`<div class="winTitle"><span>${title}</span><span class="traffic"><span title="Minimise">_</span><span title="Maximise">□</span><span title="Close">×</span></span></div><div class="winMenu">File&nbsp;&nbsp;Edit&nbsp;&nbsp;View&nbsp;&nbsp;Tools&nbsp;&nbsp;Window&nbsp;&nbsp;Help</div><div class="winBody">${html}</div><div class="winStatus">${opts.status||'Ready'}</div><div class="resizer"></div>`;
  el.addEventListener('mousedown',()=>el.style.zIndex=++z); wins.appendChild(el); openWins[id]=el; keepOnScreen(el); makeDraggable(el); addRail(title, opts.status||''); return el;
}
function closeAll(){wins.innerHTML=''; notif.innerHTML=''; minTray.innerHTML=''; rail.innerHTML=''; openWins={}; layoutIndex=0;}
function appendLog(t){let l=document.getElementById('liveLog'); if(l){l.textContent += `${new Date().toLocaleTimeString()}  ${t}\n`; l.scrollTop=l.scrollHeight;} addRail('Log',t)}
function splash(){
  const s=document.createElement('div'); s.className='splash'; s.innerHTML='<h1>Garda Digital Forensics Suite</h1><div class="body"><b>Analysis Workspace</b><br><br>Waiting for operator workstation.<br>Case GFU-11-0179 loaded read-only.<br><br><div class="progress"><div style="width:100%"></div></div></div>';
  document.body.appendChild(s); setTimeout(()=>{s.classList.add('fadeOut'); setTimeout(()=>s.remove(),380)},1300);
}
function startup(){
  closeAll(); statusLeft.textContent='Connected to operator workstation'; setStatus('Analysis queue idle');
  win('log','Recovery Log',null,null,430,370,`<div class="queueList" id="liveLog">09:41:08  Evidence workspace ready\n09:41:10  Waiting for operator search\n09:41:12  Case GFU-11-0179 loaded read-only\n</div>`,{status:'Live log connected'});
  win('summary','Case Summary',null,null,520,300,`<div class="moduleTitle"><span class="moduleIcon">GF</span>Current Case</div><div class="kv"><b>Case</b><span>GFU-11-0179</span><b>Evidence</b><span>SUSPECT-PC.E01</span><b>Mode</b><span>Read-only forensic image</span><b>Brief</b><span>Search suspect computer for filename matches and browser artefacts</span><b>Current task</b><span>No evidence selected</span></div>`,{status:'No item loaded'});
  win('queue','Analysis Queue',null,null,430,270,`<div class="timelineMini"><b>Queued modules</b><br><br>□ File system index<br>□ Archive header scan<br>□ Metadata inspection<br>□ Keyword search<br>□ Browser artefacts<br>□ SQLite page recovery<br>□ Private browsing reconstruction</div>`,{status:'Queue waiting'});
}
function searchNokia(){
  startup(); flash(); notify('Keyword Search Started','Searching suspect computer for filename: <b>Nokia</b>'); setStatus('Keyword search running: Nokia');
  win('keyword','Keyword Search Engine',null,null,560,330,`<div class="moduleTitle"><span class="moduleIcon">🔎</span>Filename Keyword Search</div><div class="kv"><b>Keyword</b><span>Nokia</span><b>Scope</b><span>All drives / deleted records / unallocated clusters</span><b>Current source</b><span>C:\\Documents and Settings\\Patrick</span><b>Hits found</b><span>0</span></div>${progress('Scanning computer image...',36)}`,{status:'Searching'}); appendLog('Keyword search launched: Nokia');
}
function metadata(){setStatus('Inspecting source image metadata'); win('metadata','Metadata Inspector',null,null,470,330,`<div class="toolbarIcons"><span class="ico"></span><span class="ico"></span><span class="ico"></span> Source image mounted</div><div class="moduleTitle"><span class="moduleIcon">i</span>Source Image Metadata</div><div class="kv"><b>Image</b><span>SUSPECT-PC.E01</span><b>File system</b><span>NTFS</span><b>Operating system</b><span>Windows XP / user profile recovered</span><b>Examiner</b><span>D. Fitzpatrick</span><b>Integrity</b><span class="ok">MD5 verified</span></div>`,{status:'Image mounted read-only'}); appendLog('Metadata inspector opened');}
function archive(){setStatus('Archive header scan queued'); win('archive','Archive Inspector',null,null,585,360,`<div class="moduleTitle"><span class="moduleIcon">ZIP</span>Archive Header Scan</div><div class="toolGrid"><div class="sidePanel"><b>Sources</b><br><br>Temp folders<br>Application Data<br>PC Suite<br>Recycle Bin<br>Unallocated</div><div>${progress('Reading archive headers...',58)}<p>Searching for compressed, renamed or partially deleted files containing the filename keyword.</p><table><tr><th>Candidate</th><th>Status</th></tr><tr><td>Nokia.nbu</td><td>header pending</td></tr><tr><td>Nokia</td><td>unknown file type</td></tr></table></div></div>`,{status:'Archive analysis running'}); appendLog('Archive header scan queued');}
function hex(){setStatus('File signature viewer analysing recovered bytes'); win('hex','File Signature Viewer',null,null,520,320,`<div class="moduleTitle"><span class="moduleIcon">0x</span>Signature Analysis</div><div class="hexview">00000000  4E 4F 4B 49 41 00 00 00  50 4B 03 04 14 00 06 00  NOKIA...PK......\n00000010  08 00 4A 99 6E 3A 42 91  A1 22 08 00 00 00 12 00  ..J.n:B..\"......\n00000020  00 00 62 61 63 6B 75 70  2E 64 61 74 00 00 00 00  ..backup.dat....\n00000030  53 51 4C 69 74 65 20 66  6F 72 6D 61 74 20 33 00  SQLite format 3.</div><p><b>Result:</b> compressed container / embedded SQLite records suspected.</p>`,{status:'Signature match'}); appendLog('Embedded database marker found');}
function nokiaHit(){flash(); notify('Filename Match Found','Several recovered files contain <b>Nokia</b> in the filename.'); setStatus('Filename matches located: Nokia'); win('hit','Keyword Match Viewer',null,null,720,430,`<div class="moduleTitle"><span class="moduleIcon">✓</span>Filename Matches: Nokia</div><table><tr><th>Filename</th><th>Recovered path</th><th>Status</th></tr><tr><td>Nokia</td><td>C:\\Documents and Settings\\Patrick\\Local Settings\\Temp</td><td>Partial access</td></tr><tr><td>Nokia.nbu</td><td>Application Data\\PC Suite\\Backups</td><td>Archive header recovered</td></tr><tr><td>Nokia_private.dat</td><td>Temporary Internet Files</td><td>Locked</td></tr><tr><td>old_nokia_notes.txt</td><td>My Documents\\Notes</td><td>Accessible</td></tr></table><p><b>Important:</b> filename match on the suspect computer image. No physical phone is shown as recovered.</p>`,{status:'Matches located'}); appendLog('Filename matches located: Nokia');}
function inspectArchive(){flash(); notify('Opening Recovered File','Inspecting Nokia file header and associated artefacts.'); setStatus('Recovered container listing reconstructed'); win('inspect','Archive Explorer',null,null,760,470,`<div class="moduleTitle"><span class="moduleIcon">📁</span>Recovered Container: Nokia</div><div class="toolGrid"><div class="sidePanel"><b>Nokia</b><br><br>Documents<br>Images<br>Database<br>Cache<br>Unknown.bin</div><div><p>The file was recovered from the suspect computer image and is being examined as a file/archive.</p>${progress('Recovering internal listing...',100)}<table><tr><th>Name</th><th>Type</th><th>Recovered</th></tr><tr><td>history.dat</td><td>Browser/cache</td><td>Yes</td></tr><tr><td>private.dat</td><td>Locked data</td><td>Partial</td></tr><tr><td>notes.txt</td><td>Text fragment</td><td>Yes</td></tr><tr><td>sqlite_pages.bin</td><td>Database fragments</td><td>Partial</td></tr></table></div></div>`,{status:'Container listing recovered'}); appendLog('Container listing recovered from Nokia filename match');}
function decompStart(){notify('Keyword Search Started','Searching recovered artefacts for <b>decomposition</b>'); setStatus('Keyword search running: decomposition'); win('keyword2','Keyword Search Engine',null,null,580,340,`<div class="moduleTitle"><span class="moduleIcon">🔎</span>Keyword Search</div><div class="kv"><b>Keyword</b><span>decomposition</span><b>Scope</b><span>Recovered files / browser artefacts / unallocated records</span><b>Display rule</b><span>Do not show typed word on operator monitor close-up until needed</span><b>Hits found</b><span>0</span></div>${progress('Searching indexes...',29)}`,{status:'Searching'}); appendLog('Keyword search launched: decomposition');}
function keywordViewer(){setStatus('Keyword hit viewer scanning recovered artefacts'); win('kviewer','Keyword Hit Viewer',null,null,650,380,`<div class="moduleTitle"><span class="moduleIcon">KW</span>Keyword Hit Viewer</div>${progress('Scanning recovered archive and cache fragments...',45)}<table><tr><th>Term</th><th>Source</th><th>Hits</th></tr><tr><td>decomposition</td><td>Nokia_private.dat</td><td>pending</td></tr><tr><td>decomposition</td><td>Browser cache</td><td>pending</td></tr></table>`,{status:'Index scan'}); appendLog('Keyword hit viewer opened');}
function sqlite(){setStatus('SQLite deleted page reconstruction'); win('sqlite','SQLite Record Viewer',null,null,620,410,`<div class="moduleTitle"><span class="moduleIcon">DB</span>SQLite / Browser Database Recovery</div><div class="hexview">Page 0007: freelist trunk\nPage 0012: deleted cell fragments\nPage 0015: url table partial\nPage 0021: private browsing cache fragment\n</div>${progress('Reassembling deleted pages...',72)}`,{status:'SQLite fragments found'}); appendLog('SQLite fragments found in recovered cache');}
function privateView(){flash(); notify('Private Browsing Records','Recovered private browsing artefacts located.'); setStatus('Private browsing artefacts recovered'); win('private','Private Browsing Artefacts',null,null,900,520,`<div class="moduleTitle"><span class="moduleIcon">PB</span>Recovered Private Browsing</div><table><tr><th>Time</th><th>Recovered term / page fragment</th><th>Source</th></tr><tr><td>08:17</td><td><span class="hit">peat decomposition</span></td><td>browser cache fragments</td></tr><tr><td>08:23</td><td>soil acidity</td><td>temporary internet files</td></tr><tr><td>08:31</td><td>delete browsing history</td><td>unallocated space</td></tr></table><p>These entries were reconstructed from the computer image. The source file remains partially inaccessible.</p>`,{status:'Private browsing recovered'}); appendLog('Private browsing artefacts recovered');}
function recoveryLog(){win('rlog','Recovery Log Detail',null,null,520,300,`<div class="queueList">${new Date().toLocaleTimeString()}  Unallocated scan complete\n${new Date().toLocaleTimeString()}  Browser cache fragments identified\n${new Date().toLocaleTimeString()}  Keyword hit: decomposition\n${new Date().toLocaleTimeString()}  Source: Nokia_private.dat\n${new Date().toLocaleTimeString()}  Preparing evidence viewer record\n</div>`,{status:'Recovery complete'}); appendLog('Recovery log generated');}
function note(){flash(); notify('Retrieved Information Found','Keyword association recovered from locked Nokia file.'); setStatus('Retrieved information displayed'); win('note','Retrieved Information Found',null,null,900,555,`<div class="moduleTitle"><span class="moduleIcon">TXT</span>Recovered Text / Cache Fragment</div><div class="evidenceDoc">Recovered from:\nC:\\Documents and Settings\\Patrick\\Local Settings\\Temporary Internet Files\\Nokia_private.dat\n\nPrivate Browsing records were recovered from the suspect computer image.\n\nKeyword association: <span class="hit">decomposition</span>\nStatus: recovered from cache fragments\nOriginal file: locked / inaccessible\n\nThis supports Fitzpatrick's line: the computer history was accessed, including times that Private Browsing was used.</div>`,{status:'Evidence item displayed'}); appendLog('Retrieved information found and displayed');}
function onCue(c){
  const map={reset:startup,searchNokia,metadata,archive,hex,nokiaHit,inspectArchive,decompStart,keywordViewer,sqlite,private:privateView,recoveryLog,note};
  if(map[c]) map[c]();
}
function onMsg(d){ if(d && d.type==='cue') onCue(d.payload); }
channel.onmessage=e=>onMsg(e.data);
window.addEventListener('storage',e=>{if(e.key===CHANNEL_NAME){try{onMsg(JSON.parse(e.newValue))}catch(_){}}});
document.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='f')document.documentElement.requestFullscreen?.();
  if(e.key==='1')searchNokia(); if(e.key==='2')nokiaHit(); if(e.key==='3')inspectArchive(); if(e.key==='4')privateView(); if(e.key==='5')note();
});
startup(); splash();
