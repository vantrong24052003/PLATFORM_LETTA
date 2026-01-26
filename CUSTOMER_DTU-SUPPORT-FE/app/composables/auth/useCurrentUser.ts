import type { User, ApiResponse } from '@/types/common'
import { useApiFetch } from '@/lib/api'
import { USER_API } from '@/constants/api/user.api'
import { useAuthStore } from '@/stores/auth'

export const useCurrentUser = () => {
  const { setUser, setHasSessionChecked, user } = useAuthStore()

  const getCurrentUser = async () => {
    if (import.meta.server) {
      return null
    }

    if (user) {
      return user
    }

    const { data, error, execute } = useApiFetch<User>(USER_API.me(), {
      method: 'GET',
      immediate: false,
    })

    await execute()

    if (data.value?.data) {
      setUser(data.value.data)
      setHasSessionChecked(true)
      return data.value.data
    } else if (error.value) {
      setUser(null)
      setHasSessionChecked(true)
      return null
    }

    return null
  }

  return {
    getCurrentUser,
  }
}
