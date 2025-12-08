import { io } from 'socket.io-client'
import { getAccessTokenFromLocalStorage } from './auth'

const API_URL = 'https://khoinguyenpham.name.vn' // your backend URL

export const socket = io(API_URL, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
  },
  transports: ["websocket"]
})
