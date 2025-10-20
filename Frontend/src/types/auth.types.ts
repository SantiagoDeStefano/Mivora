// import type { User } from "./user.types"

export interface AuthResponse {
  message: string;
  result: {
    access_token: string;
    refresh_token: string;
  };
}

export interface AuthErrorResponse {
  message: string;
  errors: {
    [key: string]: {
      type: string;
      value: string;
      msg: string;
      path: string;
      location: string;
    };
  };
}