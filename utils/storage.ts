import localforage from 'localforage'

const OFFLINE_KEY = 'offline-submissions'

export async function saveSubmissionOffline(data: any) {
  const current = (await localforage.getItem(OFFLINE_KEY)) || []
  const updated = [...(current as any[]), data]
  await localforage.setItem(OFFLINE_KEY, updated)
}

export async function getAllOfflineSubmissions(): Promise<any[]> {
  const submissions = await localforage.getItem(OFFLINE_KEY)
  return (submissions as any[]) || []
}

export async function clearOfflineSubmissions() {
  await localforage.setItem(OFFLINE_KEY, [])
}
