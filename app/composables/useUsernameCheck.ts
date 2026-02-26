import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { authService } from '@/services/api/auth.service'

export function useUsernameCheck() {
    const status = ref<'idle' | 'available' | 'taken'>('idle')
    const loading = ref(false)

    const checkUsername = useDebounceFn(async (username: string | undefined) => {
        if (!username || username.trim().length < 3) {
            status.value = 'idle'
            return
        }

        loading.value = true
        try {
            const res = await authService.checkUsername(username.trim())
            // Adapt this mapping based on the actual API response structure
            // Usually { data: { data: { available: true } } } or similar
            const isAvailable = res.data?.data?.available ?? res.data?.available
            status.value = isAvailable ? 'available' : 'taken'
        } catch (error) {
            status.value = 'idle'
            console.error('Username check failed:', error)
        } finally {
            loading.value = false
        }
    }, 500)

    return {
        status,
        loading,
        checkUsername
    }
}
