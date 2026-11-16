/* Service worker: ડેટા (family.ged) અને પેજ હંમેશાં પહેલાં નેટવર્કથી લે છે, એટલે GitHub પર અપડેટ કરેલો ડેટા તરત દેખાય.
   ઇન્ટરનેટ ન હોય ત્યારે છેલ્લે સાચવેલી નકલ વપરાય છે. */
const CACHE = "vansh-v1";
const CORE = ["./", "index.html", "data/family.ged", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r, { cache: "no-cache" }).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match("index.html")))
  );
});
