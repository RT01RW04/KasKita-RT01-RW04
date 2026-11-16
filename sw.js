/* KasKita service worker v3 — offline-first untuk aset aplikasi, kartu QR, dan pemindai. */
const VERSION = 'kaskita-v3.0.7-cross1';
const ASSETS = ['./', './index.html', './compat.js', './styles.css', './core.js', './auth.js', './drive.js', './cards.js', './scanner.js', './reports.js', './app.js', './manifest.json', './assets/qrcode-generator.js', './assets/jsQR.js', './assets/pdf-lib.min.js', './assets/jakarta.woff2', './Panduan-Instalasi-KasKita-Lintas-Platform.pdf', './icons/icon-192.png', './icons/icon.png', './icons/maskable-192.png', './icons/maskable.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('kaskita-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(async res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put('./index.html', copy));
        return res;
      }
      const cached = (await caches.match('./index.html')) || (await caches.match('./'));
      return cached || res;
    }).catch(() => caches.match('./index.html').then(cached => cached || caches.match('./'))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => {
    const network = fetch(req).then(res => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then(cache => cache.put(req, copy));
      }
      return res;
    }).catch(() => cached);
    return cached || network;
  }));
});
