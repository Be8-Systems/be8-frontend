const PRECACHE = 'v0.0.30';
const RUNTIME = 'v0.2.19';
const PRECACHE_URLS = Object.freeze([
    '/',
    'bundle.css'
]);
const NOTIFICATIONS = Object.freeze({
    NEWMESSAGE: 'Message from {{nickname}} - #{{sender}}',
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
        return event;
    } 
    // Skip cross-origin requests, like those for Google Analytics.
    if (!event.request.url.startsWith(self.location.origin)) {
        return event;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME).then(cache => {
                return fetch(event.request).then(response => {
                    if (response.status == 206) {
                        return response;                    
                    }

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

function triggerNotification (data) {
    const text = NOTIFICATIONS.NEWMESSAGE.replace('{{nickname}}', data.nickname)
                                         .replace('{{sender}}', data.sender)

    self.registration.showNotification('Be8 Messenger', {
        body: text,
        icon: '/assets/img/icon-96x96.png',
        badge: '/assets/img/icon-96x96.png',
        vibrate: [150, 150, 150, 150, 75, 75, 150, 150, 150, 150, 450]
    });


}
self.addEventListener('notificationclick', event => { 
    event.notification.close();
    event.waitUntil(clients.matchAll({ type: 'window' }).then(function (clientList) {
        // focus on tab
        console.log(clientList);
        for (const client of clientList) {
            const isCorrectURL = client.url === 'http://localhost:3000/' || client.url === 'https://be8.live'
            console.log(isCorrectURL);
            console.log(client.url);
            console.log('focus' in client);
            if (isCorrectURL && 'focus' in client) {
                return client.focus();
            }
        }

        // opens new window
        if (clients.openWindow) {
            return clients.openWindow('/');
        } 
    }));
});
self.addEventListener('push', function pushNotification (event) {   
    const data = event.data.json();

    self.clients.matchAll({ type: 'window' }).then(function (clients) {
        if (clients.length === 0) {
            return triggerNotification(data);
        }

        clients.forEach(function (client) {
            if (client.visibilityState !== 'visible') {
                return triggerNotification(data);
            }
        });
    });
});