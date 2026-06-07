import { ref, watch } from 'vue'
import { storage } from '@/utils/storage'

const theme = ref<'light' | 'dark'>('light')

const updateDocumentTheme = (t: 'light' | 'dark') => {
  const root = document.documentElement
  if (t === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

const initTheme = () => {
  const savedTheme = storage.getTheme()
  theme.value = savedTheme
  updateDocumentTheme(savedTheme)
}

initTheme()

watch(theme, (newTheme) => {
  updateDocumentTheme(newTheme)
})

export function useTheme() {
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    storage.saveTheme(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme,
    setTheme,
    toggleTheme
  }
}
