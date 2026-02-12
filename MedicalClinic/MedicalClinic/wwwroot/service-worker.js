const OFFLINE_CACHE = 'medical-offline-v1';

// Archivos a cachear
const OFFLINE_ASSETS = [
    '/offline/',           // index.html
    '/offline/styles.css', // CSS
    '/offline/app.js',     // JavaScript
    'offline/favicon.png'  // Favicon
];

// Instalación: cachear los assets
self.addEventListener('install', event => {
    console.log('[SW] Instalando app offline');
    event.waitUntil(
        caches.open(OFFLINE_CACHE)
            .then(cache => cache.addAll(OFFLINE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activación: limpiar caches antiguos
self.addEventListener('activate', event => {
    console.log('[SW] Activando y limpiando caches antiguos');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== OFFLINE_CACHE) {
                        console.log('[SW] Borrando cache antiguo', key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: servir de cache, actualizar en background
self.addEventListener('fetch', event => {
    const requestURL = new URL(event.request.url);

    // Solo para los archivos offline
    if (requestURL.pathname.startsWith('/offline/')) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                // Actualizar cache en background
                const fetchPromise = fetch(event.request).then(networkResponse => {
                    return caches.open(OFFLINE_CACHE).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => null);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // Para navegación (páginas)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match('/offline/'))
        );
    }
});
