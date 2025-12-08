import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  HttpStatusCode
} from 'axios'
import usersApi from '../apis/users.api'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage
} from './auth'
import path from '../constants/path'
import { AuthResponse } from '../types/auth.types'

interface RequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()

    this.instance = axios.create({
      baseURL: 'https://khoinguyenpham.name.vn/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // REQUEST INTERCEPTOR – gắn Authorization header nếu có token
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // RESPONSE INTERCEPTOR – xử lý login/logout + refresh token + error
    this.instance.interceptors.response.use(
      // On fulfilled
      async (response) => {
        const url = response.config.url

        // LOGIN / REGISTER: lưu token + lấy profile
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse

          this.accessToken = data.result.access_token
          this.refreshToken = data.result.refresh_token

          setAccessTokenToLocalStorage(this.accessToken)
          setRefreshTokenToLocalStorage(this.refreshToken)

          try {
            const getMeResponse = await usersApi.getMe()
            setProfileToLocalStorage(getMeResponse.data.result)
          } catch (error) {
            console.error('Failed to fetch profile after login/register:', error)
          }
        }

        // LOGOUT / VERIFY EMAIL / RESET PASSWORD: clear local
        if (
          url === path.logout ||
          url === path.email_verification ||
          url === path.reset_password
        ) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLocalStorage()
        }

        return response
      },

      // On rejected
      async (error: AxiosError) => {
        const { response, config } = error
        const originalRequest = config as RequestConfigWithRetry

        // Nếu 401 → thử refresh token 1 lần
        if (response?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
          originalRequest._retry = true

          const refreshToken = getRefreshTokenFromLocalStorage()

          // Không có refresh token → xem như logout
          if (!refreshToken) {
            clearLocalStorage()
            window.location.reload()
            return Promise.reject(error)
          }

          try {
            const res = await usersApi.refreshToken({
              refresh_token: refreshToken
            })

            this.accessToken = res.data.result.access_token
            this.refreshToken = res.data.result.refresh_token

            setAccessTokenToLocalStorage(this.accessToken)
            setRefreshTokenToLocalStorage(this.refreshToken)

            if (!originalRequest.headers) {
              originalRequest.headers = {} as any
            }
            originalRequest.headers.Authorization = `Bearer ${this.accessToken}`

            // Replay request cũ với token mới
            return this.instance(originalRequest)
          } catch (refreshError) {
            // Refresh fail → logout toàn bộ
            clearLocalStorage()
            window.location.reload()
            return Promise.reject(refreshError)
          }
        }

        // Các lỗi khác: log + ném ra cho chỗ gọi tự xử lý (KHÔNG nuốt lỗi)
        console.error(
          'Axios error:',
          response?.status,
          config?.method,
          config?.url,
          response?.data
        )

        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
