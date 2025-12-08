import { io } from 'socket.io-client'
import { getAccessTokenFromLocalStorage } from './auth'

const API_URL = 'http://47.129.118.52:4000' // your backend URL

export const socket = io(API_URL, {
  auth: {
    Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`
  },
  transports: ["websocket"]
})
