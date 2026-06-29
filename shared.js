const CHANNEL_NAME = 'garda-suite-2011-v7';
const channel = new BroadcastChannel(CHANNEL_NAME);
function broadcast(type,payload){ channel.postMessage({type,payload}); localStorage.setItem(CHANNEL_NAME, JSON.stringify({type,payload,t:Date.now()})); }
const nokiaFiles = [
 {name:'Nokia',path:'C:\\Documents and Settings\\Patrick\\Local Settings\\Temp\\Nokia',size:'52 MB',mod:'14/03/2011 19:16',status:'Partial access'},
 {name:'Nokia.nbu',path:'C:\\Documents and Settings\\Patrick\\Application Data\\PC Suite\\Backups\\Nokia.nbu',size:'51 MB',mod:'14/03/2011 19:14',status:'Archive header recovered'},
 {name:'Nokia_cache.db',path:'C:\\RECYCLER\\S-1-5-21\\Dc42.tmp\\Nokia_cache.db',size:'11 MB',mod:'Recovered',status:'Indexing'},
 {name:'Nokia_private.dat',path:'C:\\Documents and Settings\\Patrick\\Local Settings\\Temporary Internet Files\\Nokia_private.dat',size:'3 MB',mod:'Recovered',status:'Locked'},
 {name:'old_nokia_notes.txt',path:'C:\\Documents and Settings\\Patrick\\My Documents\\Notes\\old_nokia_notes.txt',size:'14 KB',mod:'12/03/2011 10:21',status:'Accessible'},
 {name:'nokia_sms_deleted.sqlite',path:'D:\\EvidenceMirror\\Patrick\\PhoneSync\\nokia_sms_deleted.sqlite',size:'6 MB',mod:'Recovered',status:'Verified'}
];
function escapeHtml(s){return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
