

self.addEventListener('install', function(event) {
  //console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll([
          'manifest.json',
          'index.html',
          'lightblue.png',
          'lightgold.png',
          'icon_192x192.png',
          'icon_256x256.png',
          'icon_384x384.png',
          'icon_512x512.png',
          'style.css'        
        ]);
      })
  )
});



self.addEventListener('activate', function(event) {
    //console.log('[Service Worker] Activating Service Worker ...', event);
    event.waitUntil(
        caches.keys()
        .then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_STATIC_NAME) {
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


self.addEventListener('fetch', function(event) {
    //console.log('[Service Worker] Fetching something ....', event);
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request);
            }
        })
    );
});