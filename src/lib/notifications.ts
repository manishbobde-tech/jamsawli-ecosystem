const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ""

export interface NotificationPreference {
  dailyWisdom: boolean
  eventAlerts: boolean
  streakRemind: boolean
  quietStart: string
  quietEnd: string
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  const permission = await Notification.requestPermission()
  return permission
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js")
    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

export async function subscribeToPush(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPI_PUBLIC_KEY,
    })
    return subscription
  } catch (error) {
    console.error("Push subscription failed:", error)
    return null
  }
}

export function isQuietHours(start: string, end: string): boolean {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes

  const [startHour, startMin] = start.split(":").map(Number)
  const [endHour, endMin] = end.split(":").map(Number)
  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin

  if (startTime > endTime) {
    return currentTime >= startTime || currentTime < endTime
  }

  return currentTime >= startTime && currentTime < endTime
}

export async function showNotification(
  title: string,
  body: string,
  icon?: string,
  tag?: string
): Promise<void> {
  if (Notification.permission !== "granted") return

  const registration = await navigator.serviceWorker?.ready
  if (!registration) return

  registration.showNotification(title, {
    body,
    icon: icon || "/icon-192.png",
    tag: tag || "jamsawli-notification",
    badge: "/icon-192.png",
    vibrate: [200, 100, 200],
  })
}
