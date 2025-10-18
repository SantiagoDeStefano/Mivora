import type { User } from "../../types/user.types"

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToLocalStorage = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('access_token') || ''
}

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
  const clearLocalStorageEvent = new Event('clearLocalStorage')
  localStorageEventTarget.dispatchEvent(clearLocalStorageEvent)
}

export const getProfileFromLocalStorage = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLocalStorage = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

