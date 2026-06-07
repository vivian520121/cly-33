import { ref } from 'vue'
import type { ToastMessage } from '@/types'

const toasts = ref<ToastMessage[]>([])

export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString()
    const toast: ToastMessage = { id, message, type }
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, 2500)
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
