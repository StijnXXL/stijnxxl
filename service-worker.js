const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png'
];

// Installatie van de Service Worker en cache van bestanden
self.addEventListener('install', async (event) => {
    console.log('Service Worker aan het installeren...');
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            console.log('Bestanden worden gecached');
            await cache.addAll(urlsToCache);
        })()
    );
});

// Afhandelen van fetch-verzoeken met caching
self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            const cachedResponse = await caches.match(event.request);
            if (cachedResponse) {
                return cachedResponse;
            }
            try {
                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                console.error('Fetch-fout:', error);
                throw error;
            }
        })()
    );
});

// Activeren van de Service Worker en opruimen van oude caches
self.addEventListener('activate', async (event) => {
    console.log('Service Worker geactiveerd');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(async (cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log(`Cache ${cacheName} wordt verwijderd`);
                        await caches.delete(cacheName);
                    }
                })
            );
        })()
    );
});
