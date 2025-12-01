import { USERS_MESSAGES } from '../constants/messages'
import LIMIT_MIN_MAX from '../constants/limits'
import * as yup from 'yup'

// helper: counts for each character class
const countMatches = (s: string, re: RegExp) => (s.match(re) || []).length

// --- SCHEMAS ---
// These rules was taken from users.middlewaress's registerValidator
export const registerSchema = yup.object({
  name: yup
    .string()
    .required(USERS_MESSAGES.NAME_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.NAME_LENGTH_MIN, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .max(LIMIT_MIN_MAX.NAME_LENGTH_MAX, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .trim(),
  email: yup
    .string()
    .required(USERS_MESSAGES.EMAIL_IS_REQUIRED)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, USERS_MESSAGES.EMAIL_IS_INVALID)
    .trim(),
  password: yup
    .string()
    .required(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .test(
      'strong-password',
      USERS_MESSAGES.STRONG_PASSWORD, // one generic message like backend
      (value) => {
        if (!value) return false

        const {
          STRONG_PASSWORD_MIN_LENGTH,
          STRONG_PASSWORD_MIN_LOWERCASE,
          STRONG_PASSWORD_MIN_UPPERCASE,
          STRONG_PASSWORD_MIN_NUMBER,
          STRONG_PASSWORD_MIN_SYMBOL
        } = LIMIT_MIN_MAX

        // if you want to enforce the "strong" min length independently of .min/.max:
        if (value.length < STRONG_PASSWORD_MIN_LENGTH) return false

        const lowers = countMatches(value, /[a-z]/g)
        const uppers = countMatches(value, /[A-Z]/g)
        const numbers = countMatches(value, /\d/g)
        const symbols = countMatches(value, /[^A-Za-z0-9]/g) // like validator.js: “symbols” = non-alphanumeric

        return (
          lowers >= STRONG_PASSWORD_MIN_LOWERCASE &&
          uppers >= STRONG_PASSWORD_MIN_UPPERCASE &&
          numbers >= STRONG_PASSWORD_MIN_NUMBER &&
          symbols >= STRONG_PASSWORD_MIN_SYMBOL
        )
      }
    ),
  confirm_password: yup
    .string()
    .required(USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_FROM_8_TO_24)
    .oneOf([yup.ref('password')], USERS_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH_PASSWORD)
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .required(USERS_MESSAGES.EMAIL_IS_REQUIRED)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, USERS_MESSAGES.EMAIL_IS_INVALID)
    .trim(),
  password: yup
    .string()
    .required(USERS_MESSAGES.PASSWORD_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.PASSWORD_LENGTH_MIN, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
    .max(LIMIT_MIN_MAX.PASSWORD_LENGTH_MAX, USERS_MESSAGES.PASSWORD_MUST_BE_FROM_8_TO_24)
})

export const updateMe = yup.object({
  name: yup
    .string()
    .required(USERS_MESSAGES.NAME_IS_REQUIRED)
    .min(LIMIT_MIN_MAX.NAME_LENGTH_MIN, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .max(LIMIT_MIN_MAX.NAME_LENGTH_MAX, USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_3_TO_100)
    .trim(),
  role: yup.string().oneOf(['organizer'], USERS_MESSAGES.UPDATE_ROLE_MUST_BE_ORGANIZER),
})

export const updateAvatar = yup.object({
  image: yup.mixed().required(USERS_MESSAGES.INVALID_IMAGE)
})

export const eventTitleSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Event title is required.')
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be at most 120 characters')
})

// --- TYPES ---
export type RegisterSchema = Required<yup.InferType<typeof registerSchema>>
export type LoginSchema = Required<yup.InferType<typeof loginSchema>>

export type EventTitleSchema = yup.InferType<typeof eventTitleSchema>
export type UpdateMeSchema = yup.InferType<typeof updateMe>
export type UpdateAvatarSchema = yup.InferType<typeof updateAvatar>
