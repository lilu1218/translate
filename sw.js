// 加到主畫面用：舊版 Android Chrome 要有 fetch handler 才肯當 app 裝。
// 網路優先，斷線才拿上次存的頁面；api.anthropic.com 等跨站請求不碰。
const CACHE = 'xlate-v1';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req)));
});
