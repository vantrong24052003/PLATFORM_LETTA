export type ThemeValue =
  | 'red-light'
  | 'blue-light'
  | 'green-light'
  | 'purple-light'
  | 'orange-light'
  | 'pink-light'
  | 'red-dark'
  | 'blue-dark'
  | 'green-dark'
  | 'purple-dark'
  | 'orange-dark'
  | 'pink-dark'

export type LocaleCode = 'vi' | 'en' | 'ja'

export interface Theme {
  value: ThemeValue
  color: string
}

export interface Locale {
  code: LocaleCode
  name: string
  englishName: string
}

export interface User {
  id: number
  email: string
  name: string
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  message: string
  details?: string
}

export interface ApiErrorResponse {
  errors: ApiError[]
}

export interface HandleKeyOptions {
  key?: string | string[]
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  preventDefault?: boolean
}
