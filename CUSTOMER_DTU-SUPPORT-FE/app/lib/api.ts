import type { ApiResponse, ApiErrorResponse } from '@/types/common'
import type { UseFetchOptions } from 'nuxt/app'

export const useApiFetch = <T>(
  endpoint: string,
  options?: UseFetchOptions<ApiResponse<T>>
) => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.backendUrl as string
  const url = `${backendUrl}${endpoint}`

  const defaultOptions: UseFetchOptions<ApiResponse<T>> = {
    credentials: 'include',
    ...options,
  }

  return useFetch<ApiResponse<T>>(url, defaultOptions)
}

export const apiFetch = async <T>(
  endpoint: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: Record<string, unknown> | unknown[]
    query?: Record<string, string | number | boolean>
  }
): Promise<ApiResponse<T>> => {
  const config = useRuntimeConfig()
  const backendUrl = config.public.backendUrl as string
  const url = `${backendUrl}${endpoint}`

  const response = await $fetch<ApiResponse<T>>(url, {
    method: options?.method || 'GET',
    body: options?.body as BodyInit | undefined,
    query: options?.query,
    credentials: 'include',
  })

  return response
}

export const extractErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'An unknown error occurred'
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object') {
    if ('data' in error && error.data) {
      const errorData = error.data as ApiErrorResponse
      if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        const firstError = errorData.errors[0]
        if (firstError && 'message' in firstError) {
          return firstError.message || 'An error occurred'
        }
      }
    }

    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    if ('errors' in error && Array.isArray(error.errors) && error.errors.length > 0) {
      const firstError = error.errors[0]
      if (typeof firstError === 'object' && firstError && 'message' in firstError) {
        return String(firstError.message)
      }
    }
  }

  return 'An unknown error occurred'
}
