import { io } from 'socket.io-client'
import { getAccessTokenFromLocalStorage } from './auth'

const API_URL = 'http://26.35.82.76:4000' // your backend URL

export const socket = io(API_URL, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
  }
})
