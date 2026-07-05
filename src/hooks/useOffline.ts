"use client"

import { useState, useEffect, useCallback } from "react"

interface OfflineAction {
  id: string
  url: string
  method: string
  headers: Record<string, string>
  body: string
  timestamp: number
}

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false)
  const [pendingActions, setPendingActions] = useState<OfflineAction[]>([])

  const syncPendingActions = useCallback(async () => {
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
          console.error("Sync failed for action:", action.id)
        }
      }

      setPendingActions([])
    } catch (e) {
      console.error("Sync error:", e)
    }
  }, [])

  useEffect(() => {
    setIsOffline(!navigator.onLine)

    const handleOnline = () => {
      setIsOffline(false)
      syncPendingActions()
    }

    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [syncPendingActions])

  const queueAction = useCallback(async (url: string, options: RequestInit) => {
    const action: OfflineAction = {
      id: crypto.randomUUID(),
      url,
      method: options.method || "GET",
      headers: (options.headers as Record<string, string>) || {},
      body: options.body as string,
      timestamp: Date.now(),
    }

    const db = await openDB()
    const tx = db.transaction("offline-actions", "readwrite")
    tx.objectStore("offline-actions").add(action)

    setPendingActions((prev) => [...prev, action])
  }, [])

  return { isOffline, pendingActions, queueAction, syncPendingActions }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("jamsawli-offline", 1)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains("offline-actions")) {
        db.createObjectStore("offline-actions", { keyPath: "id" })
      }
    }
  })
}

function getAllFromStore(store: IDBObjectStore): Promise<OfflineAction[]> {
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
