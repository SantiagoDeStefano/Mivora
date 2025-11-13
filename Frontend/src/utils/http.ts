import axios, { type AxiosInstance } from 'axios'
import usersApi from '../apis/users.api'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:4000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Add Authorization: Bearer <token> when authenticated
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem('access_token')
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Call /refresh-token to get new access_token and refresh_token
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          const refreshToken = localStorage.getItem('refresh_token')

          // Call refresh-token endpoint
          const res = await usersApi.refreshToken({ refresh_token: refreshToken })

          const newAccessToken = res.data.result.access_token

          // Save new access token
          localStorage.setItem('access_token', newAccessToken)

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return this.instance(originalRequest)
        }

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
