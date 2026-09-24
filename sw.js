const C='rc-v1';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./manifest.json','./appicon180.png'])).catch(()=>{}));});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  const font=/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(u.origin!==location.origin&&!font)return;
  if(font){
    e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res;}))));
    return;
  }
  const nav=r.mode==='navigate'||u.pathname.endsWith('/index.html');
  const key=nav?'./':r;
  const netReq=nav?new Request('./',{cache:'no-cache'}):r;
  e.respondWith(caches.open(C).then(c=>c.match(key,{ignoreSearch:true}).then(m=>{
    const net=fetch(netReq).then(res=>{if(res.ok)c.put(key,res.clone());return res;});
    if(m){e.waitUntil(net.catch(()=>{}));return m;}
    return net;
  })));
});
