const CHANNEL_NAME = 'garda-suite-2011-v8-1';
const channel = new BroadcastChannel(CHANNEL_NAME);
function broadcast(type,payload){
  channel.postMessage({type,payload});
  localStorage.setItem(CHANNEL_NAME, JSON.stringify({type,payload,t:Date.now()}));
}

const privateBrowsingFiles = [
  {
    name:'Private Browsing',
    path:'C:\\Documents and Settings\\Patrick\\Local Settings\\Temporary Internet Files\\Private Browsing',
    size:'52 MB',
    mod:'14/03/2011 19:16',
    status:'Partial access'
  },
  {
    name:'PrivateBrowsing.db',
    path:'C:\\Documents and Settings\\Patrick\\Application Data\\Browser Cache\\PrivateBrowsing.db',
    size:'51 MB',
    mod:'14/03/2011 19:14',
    status:'Database header recovered'
  },
  {
    name:'PrivateBrowsing_Cache.db',
    path:'C:\\RECYCLER\\S-1-5-21\\Dc42.tmp\\PrivateBrowsing_Cache.db',
    size:'11 MB',
    mod:'Recovered',
    status:'Indexing'
  },
  {
    name:'PrivateBrowsing_Recovered.dat',
    path:'C:\\Documents and Settings\\Patrick\\Local Settings\\Temporary Internet Files\\PrivateBrowsing_Recovered.dat',
    size:'3 MB',
    mod:'Recovered',
    status:'Locked'
  },
  {
    name:'private_browsing_notes.txt',
    path:'C:\\Documents and Settings\\Patrick\\My Documents\\Notes\\private_browsing_notes.txt',
    size:'14 KB',
    mod:'12/03/2011 10:21',
    status:'Accessible'
  },
  {
    name:'DeletedHistory.sqlite',
    path:'D:\\EvidenceMirror\\Patrick\\BrowserRecovery\\DeletedHistory.sqlite',
    size:'6 MB',
    mod:'Recovered',
    status:'Verified'
  }
];

function escapeHtml(s){
  return String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
}
