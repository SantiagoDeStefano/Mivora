export interface SuccessResponse<Data> {
  message: string
  result: Data
}
export interface ErrorResponse<Data> {
  message: string
  errors?: Data
}
export interface ValidationErrorResponse {
  [key: string]: {
    type: string
    value: string
    msg: string
    path: string
    location: string
  }
}
