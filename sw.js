const CACHE_VERSION = 'pixel-quest-v12';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './css/pixel-quest.css',
    './js/soundEngine.js',
    './js/medals.js',
    './js/mascot.js',
    './js/dataManager.js',
    './js/animations.js',
    './js/app.js'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_VERSION).then(c => c.addAll(urlsToCache)));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const copy = res.clone();
                caches.open(CACHE_VERSION).then(c => c.put(e.request, copy));
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
