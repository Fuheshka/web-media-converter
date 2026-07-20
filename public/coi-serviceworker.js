/*! coi-serviceworker v0.1.7 - Guido Zufolo & contributors - MIT License */
(() => {
    const n = window.navigator;
    if ("serviceWorker" in n) {
        n.serviceWorker.controller ? n.serviceWorker.controller.postMessage({ type: "coi-ping" }) : (
            n.serviceWorker.register(window.document.currentScript.src).then((r) => {
                r.addEventListener("updatefound", () => {
                    window.location.reload();
                });
            })
        );
    }

    if (window.crossOriginIsolated === false) {
        window.addEventListener("load", () => {
            if (n.serviceWorker.controller) {
                n.serviceWorker.controller.postMessage({ type: "coi-ping" });
            }
        });
    }
})();
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
    const r = e.request;
    if (r.cache === "only-if-cached" && r.mode !== "same-origin") return;

    e.respondWith(
        fetch(r).then((res) => {
            if (res.status === 0) return res;

            const newHeaders = new Headers(res.headers);
            newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
            newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

            return new Response(res.body, {
                status: res.status,
                statusText: res.statusText,
                headers: newHeaders,
            });
        }).catch((err) => console.error("coi-serviceworker error:", err))
    );
});
