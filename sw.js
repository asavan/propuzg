const version = "0.0.2";
const CACHE = 'cache-only-' + version;

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request, {ignoreSearch: true}).then(function (matching) {
            return matching || Promise.reject('request-not-in-cache');
        });
    });
}

function precache() {
    return caches.open(CACHE).then(function (cache) {
        return cache.addAll([
            './',
            './images/male.svg',
            './images/female.svg',
            './images/they.svg',
            './images/ment.svg',
            './images/ment_192.png',
            './images/ment_512.png'
        ]);
    });
}

self.addEventListener('install', function (evt) {
    evt.waitUntil(precache().then(function () {
        return self.skipWaiting();
    }));
});

function networkOrCache(request) {
    return fetch(request).then(function (response) {
        return response.ok ? response : fromCache(request);
    })
        .catch(function () {
            return fromCache(request);
        });
}

self.addEventListener('fetch', function (evt) {
    evt.respondWith(networkOrCache(evt.request));
});

self.addEventListener('activate', function (evt) {
    evt.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName !== CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});
