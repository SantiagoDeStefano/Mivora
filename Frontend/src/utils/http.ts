import axios, { type AxiosInstance } from 'axios'

class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://26.35.82.76:4000', // Your backend URL
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

const http = new Http().instance
export default http
