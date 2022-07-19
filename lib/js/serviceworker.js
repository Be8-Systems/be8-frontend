const PRECACHE = 'v0.1.13243';
const RUNTIME = 'v0.0.9999';
const PRECACHE_URLS = Object.freeze([
    '/',
    'bundle.css'
]);
const NOTIFICATIONS = Object.freeze({
    NEWMESSAGE: 'New message from {{nickname}}',
});

self.addEventListener('activate', event => {
    const currentCaches = [PRECACHE, RUNTIME];

    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});
self.addEventListener('fetch', event => {
    if (event.request.method === 'POST' || event.request.destination === '') {
        return;
    } 
    // Skip cross-origin requests, like those for Google Analytics.
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME).then(cache => {
                return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
});
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
});
self.addEventListener('push', function pushNotification (event) {   
    const data = event.data.json();
    const text = NOTIFICATIONS.NEWMESSAGE.replace('{{nickname}}', data.nickname);
    console.log(data);
    self.clients.matchAll({ type: 'window' }).then(function (clients) {
        clients.forEach(function (client) {
            if (client.visibilityState !== 'visible') {
                self.registration.showNotification(text, {
                    badge: 'https://be8.live/external/img/icon-96x96.png',
                    vibrate: [150, 150, 150, 150, 75, 75, 150, 150, 150, 150, 450]
                });
            }
        });
    });
});