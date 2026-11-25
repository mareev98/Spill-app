const version = '1-e0ceb29af227';
const prefix = 'spill-shell-' + self.registration.scope + '-';
const cacheName = prefix + version;
const entry = new URL('./index.html', self.registration.scope).href;
const scope = new URL(self.registration.scope);
const shell = ['./', './index.html', './install.js', './manifest.webmanifest', './icons/spill-180.png', './icons/spill-192.png', './icons/spill-512.png'].map(path => new URL(path, scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(shell.map(url => new Request(url, {cache: 'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== scope.origin) return;
  if (request.mode === 'navigate' && [scope.pathname, new URL(entry).pathname].includes(url.pathname)) {
    event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(entry)) || fetch(request)));
  } else if (shell.includes(url.href)) {
    event.respondWith(caches.open(cacheName).then(async cache => (await cache.match(request)) || fetch(request)));
  }
});
