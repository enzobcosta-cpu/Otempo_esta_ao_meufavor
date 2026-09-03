// =====================================================
// SERVICE WORKER
// Guarda os arquivos principais do projeto em cache.
// =====================================================

const CACHE_NAME = "consulta-clima-v1";


// =====================================================
// ARQUIVOS QUE SERÃO SALVOS NO CACHE
// =====================================================

const ARQUIVOS_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// =====================================================
// INSTALAÇÃO DO SERVICE WORKER
// =====================================================

self.addEventListener("install", function(evento) {

    evento.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(ARQUIVOS_CACHE);

            })

    );

    self.skipWaiting();
});


// =====================================================
// ATIVAÇÃO DO SERVICE WORKER
// =====================================================

self.addEventListener("activate", function(evento) {

    evento.waitUntil(

        caches.keys()
            .then(function(chaves) {

                return Promise.all(

                    chaves
                        .filter(function(chave) {

                            return chave !== CACHE_NAME;

                        })

                        .map(function(chave) {

                            return caches.delete(chave);

                        })

                );

            })

    );

    self.clients.claim();
});


// =====================================================
// BUSCA DOS ARQUIVOS
// =====================================================

self.addEventListener("fetch", function(evento) {

    evento.respondWith(

        caches.match(evento.request)
            .then(function(respostaCache) {

                // Se o arquivo estiver no cache,
                // usa a versão salva.
                if (respostaCache) {
                    return respostaCache;
                }

                // Caso contrário, tenta buscar na internet.
                return fetch(evento.request);

            })

    );

});