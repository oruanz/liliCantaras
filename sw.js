const CACHE_NAME = 'pjl-liberdade-v1';

// Ficheiros que serão guardados no telemóvel/PC do utilizador para funcionar offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './phrases.json',
  './single.mp3',
  './sw.js'
];

// Instalação do Service Worker e criação da Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberta');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Interceta os pedidos e devolve os ficheiros da cache se não houver internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se o ficheiro estiver na cache, devolve. Se não, tenta ir à internet
        return response || fetch(event.request);
      })
  );
});

// Atualiza a cache caso haja novas versões
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});