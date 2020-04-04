const version = "0.0.1";
const CACHE = 'cache-only';

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
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
    evt.waitUntil(precache());
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return fromCache(event.request);
        })
    );
});
