const CACHE_NAME = "jamsawli-v1"
const urlsToCache = [
  "/",
  "/donate",
  "/book",
  "/transparency",
  "/globals.css",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })
        return response
      })
    }).catch(() => {
      return caches.match("/")
    })
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    })
  )
})

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-offline-actions") {
    event.waitUntil(syncOfflineActions())
  }
})

async function syncOfflineActions() {
  try {
    const db = await openDB()
    const tx = db.transaction("offline-actions", "readwrite")
    const store = tx.objectStore("offline-actions")
    const actions = await getAllFromStore(store)

    for (const action of actions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body,
        })
        store.delete(action.id)
      } catch (e) {
        console.error("Failed to sync action:", action)
      }
    }
  } catch (e) {
    console.error("Sync failed:", e)
  }
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("jamsawli-offline", 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains("offline-actions")) {
        db.createObjectStore("offline-actions", { keyPath: "id" })
      }
    }
  })
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
