import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from 'axios'

import { toast } from 'react-toastify'
import { clearLocalStorage, getAccessTokenFromLocalStorage, setAccessTokenToLocalStorage } from '../pages/Profile/auth'
import { type AuthResponse } from '../types/auth.types'

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: 'http://26.35.82.76:4000', // Your backend URL
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use((config) => {
      if(this.accessToken && config.headers) {
        config.headers.authorization = this.accessToken
        return config
      }
      return config
    })

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        const { url } = response.config
        if (url === '/users/login' || url === '/users/register') {
          const data = response.data as AuthResponse
          this.accessToken = data.result.access_token
          setAccessTokenToLocalStorage(this.accessToken)
        }
        else if(url === '/logout') {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },

      function onRejected(error: AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data.message || error.message
          toast.error(message)
        }
        if(error.response?.status == HttpStatusCode.Unauthorized) {
          clearLocalStorage()
          window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
