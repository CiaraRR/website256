const treeEl=document.getElementById('tree'), body=document.querySelector('#results tbody'), logEl=document.getElementById('log'), bar=document.getElementById('bar'), props=document.getElementById('props'), hex=document.getElementById('hex');
const drives=['Case GFU-11-0179','Suspect Computer Image — SUSPECT-PC.E01','C: NTFS Volume','Documents and Settings','Temporary Internet Files','Application Data','My Documents','RECYCLER','Unallocated Space','D: Evidence Mirror','Keyword Lists','Reports'];
treeEl.innerHTML=drives.map((d,i)=>`<div class="treeitem">${i<2?'▾':'▸'} ${d}</div>`).join('');
function addLog(t){ logEl.textContent += `[${new Date().toLocaleTimeString()}] ${t}\n`; logEl.scrollTop=logEl.scrollHeight; }
function setProgress(p){bar.style.width=p+'%'}
function renderRows(rows){ body.innerHTML=rows.map((f,i)=>`<tr ondblclick="openFile(${i})" onclick="selectFile(${i})"><td>${f.name}</td><td>${f.path}</td><td>${f.size}</td><td>${f.mod}</td><td><span class="badge ${f.status.includes('access')||f.status.includes('Locked')?'warn':'ok'}">${f.status}</span></td></tr>`).join(''); window.currentRows=rows; }
function selectFile(i){ const f=currentRows[i]; props.innerHTML=`<b>${f.name}</b><br><br>Path:<br>${f.path}<br><br>Size: ${f.size}<br>Modified: ${f.mod}<br>Status: ${f.status}<br><br>MD5:<br>${fakeHash(f.name).slice(0,32)}<br><br>SHA-1:<br>${fakeHash(f.path).slice(0,40)}`; hex.textContent=hexDump(f.name+' '+f.path); document.querySelectorAll('#results tr').forEach(r=>r.classList.remove('sel')); document.querySelectorAll('#results tbody tr')[i]?.classList.add('sel'); }
function openFile(i){ selectFile(i); const f=currentRows[i]; document.getElementById('modal').classList.remove('hidden'); document.getElementById('modalTitle').textContent=f.name; document.getElementById('modalBody').innerHTML=`<p><b>Sending selected item to analysis workspace...</b></p><div class="progress"><div style="width:62%"></div></div><p>Source: ${escapeHtml(f.path)}</p>`; broadcast('cue', f.name.toLowerCase().includes('private')?'private': f.name.toLowerCase().includes('notes')?'note':'inspectArchive'); setTimeout(()=>{ let accessible=!f.status.includes('Locked'); document.getElementById('modalBody').innerHTML= accessible ? `<h2>Recovered Item</h2><pre class="doc">${escapeHtml(f.name)}\n\nFile found during full-drive keyword search.\nFilename contains “Nokia”.\n\nThis does not prove a handset is present.\nIt is a file or archive on the suspect computer image.\n\nStatus: ${f.status}</pre>` : `<h2>Unable to access</h2><p>The file was located by filename but the contents cannot be opened yet.</p><p><b>Status:</b> ${f.status}</p>`; },900); }
function closeModal(){document.getElementById('modal').classList.add('hidden')}
async function runNokiaSearch(){
 document.getElementById('q').value='Nokia'; logEl.textContent=''; renderRows([]); setProgress(0);
 document.getElementById('status').textContent='Searching all drives for filename: Nokia'; broadcast('cue','reset'); broadcast('cue','searchNokia');
 const steps=['Preparing keyword search: Nokia','Mounting SUSPECT-PC.E01 read-only','Scanning NTFS master file table','Scanning Documents and Settings','Scanning Application Data and PC Suite folders','Scanning Recycle Bin and temporary internet files','Scanning unallocated clusters','Filename matches located: Nokia','Sending match list to analysis workspace'];
 for(let i=0;i<steps.length;i++){
  addLog(steps[i]); setProgress(Math.round((i+1)/steps.length*100));
  if(i===2) broadcast('cue','metadata');
  if(i===4) broadcast('cue','archive');
  if(i===6) broadcast('cue','hex');
  await wait(i===7?900:560);
  if(i===5) renderRows(nokiaFiles.slice(0,3));
  if(i===7){ renderRows(nokiaFiles); broadcast('cue','nokiaHit'); }
 }
 document.getElementById('status').textContent='Search complete: Nokia filename matches located'; selectFile(0);
}
async function runDecompSearch(){
 document.getElementById('q').value='decomposition'; logEl.textContent=''; setProgress(0); broadcast('cue','decompStart');
 const rows=[{name:'PrivateBrowsing_Recovered_Record',path:'C:\\Documents and Settings\\Patrick\\Local Settings\\Temporary Internet Files\\Nokia_private.dat',size:'3 MB',mod:'Recovered',status:'Retrieved'}];
 const steps=['Keyword entered by Fitzpatrick: decomposition','Searching all indexed records','Scanning browser history tables','Scanning private browsing fragments','Searching recovered deleted files','Retrieving information found'];
 const cues=['keywordViewer','sqlite','private','recoveryLog','note'];
 for(let i=0;i<steps.length;i++){ addLog(steps[i]); setProgress(Math.round((i+1)/steps.length*100)); if(cues[i]) broadcast('cue',cues[i]); await wait(780); }
 renderRows(rows); selectFile(0); document.getElementById('status').textContent='Retrieved information found';
}
function runSearchFromBox(){ document.getElementById('q').value.toLowerCase().includes('decomposition')?runDecompSearch():runNokiaSearch(); }
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function fakeHash(s){let h=0; for(let c of s)h=(h*31+c.charCodeAt(0))>>>0; return (h.toString(16).padStart(8,'0')+'d4c9a1b7e55a0f139c22ee7a4b91f08ce2d77c44b10931aa').slice(0,64)}
function hexDump(s){return Array.from({length:12},(_,r)=>String(r*16).padStart(8,'0')+'  '+Array.from({length:16},(_,i)=>((s.charCodeAt((r*16+i)%s.length)||32)%256).toString(16).padStart(2,'0')).join(' ')+'  '+s.slice(0,16)).join('\n')}
function openDirector(){document.getElementById('director').classList.remove('hidden')} function closeDirector(){document.getElementById('director').classList.add('hidden')} function toggleFull(){document.documentElement.requestFullscreen?.()}
document.addEventListener('keydown',e=>{ if(e.key==='Enter')runSearchFromBox(); if(e.key===' ')openFile(0); if(e.key==='F1'){e.preventDefault();runNokiaSearch()} if(e.key==='F2'){e.preventDefault();broadcast('cue','nokiaHit')} if(e.key==='F3'){e.preventDefault();broadcast('cue','inspectArchive')} if(e.key==='F4'){e.preventDefault();runDecompSearch()} if(e.key==='F5'){e.preventDefault();broadcast('cue','private')} if(e.key==='F6'){e.preventDefault();broadcast('cue','note')} if(e.ctrlKey&&e.key.toLowerCase()==='d'){e.preventDefault();openDirector()} if(e.key.toLowerCase()==='f')toggleFull(); });
renderRows([]); addLog('Evidence image mounted. Ready for full-drive search.');
