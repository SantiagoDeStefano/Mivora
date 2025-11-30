import axios, { AxiosError, type AxiosInstance } from 'axios'
import usersApi from '../apis/users.api'
import { clearLocalStorage, getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setProfileToLocalStorage, setRefreshTokenToLocalStorage } from './auth';
import path from '../constants/path';
import { AuthResponse } from '../types/auth.types';
import { HttpStatusCode } from 'axios';

class Http {
  instance: AxiosInstance;
  private accessToken: string;
  private refreshToken: string;
  
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage();
    this.refreshToken = getRefreshTokenFromLocalStorage();
    this.instance = axios.create({
      baseURL: 'http://26.35.82.76:4000', 
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Add Authorization: Bearer <token> when authenticated
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
    )
    
    // Handle login, logout, register
    this.instance.interceptors.response.use(
      async (response) => {
        const {url} = response.config
        if (url === path.login || url === path.register) {
          const data = response.data as AuthResponse
          this.accessToken = data.result.access_token
          this.refreshToken = data.result.refresh_token 
          setAccessTokenToLocalStorage(this.accessToken)
          setRefreshTokenToLocalStorage(this.refreshToken)
          const getMeResponse = await usersApi.getMe()
          setProfileToLocalStorage(getMeResponse.data.result)
        } else if (url === path.logout) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLocalStorage()
        }
        return response
      },
      function onRejected(error: AxiosError) {
        if(error.response?.status == HttpStatusCode.Unauthorized) {
          clearLocalStorage()
          window.location.reload()
        }
        return Promise.reject(error)
      }
    )

    // Call /refresh-token to get new access_token and refresh_token
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === HttpStatusCode.Unauthorized && !originalRequest._retry) {
          originalRequest._retry = true

          const refreshToken = localStorage.getItem('refresh_token')

          const res = await usersApi.refreshToken({ refresh_token: refreshToken })

          const newAccessToken = res.data.result.access_token
          const newRefreshToken = res.data.result.refresh_token
        
          localStorage.setItem('access_token', newAccessToken)
          localStorage.setItem('refresh_token', newRefreshToken)

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
