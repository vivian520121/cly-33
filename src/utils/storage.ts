import type { HistoryItem } from '@/types'

const HISTORY_KEY = 'text_beautifier_history'
const THEME_KEY = 'text_beautifier_theme'
const MAX_HISTORY = 10

export const storage = {
  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_KEY)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  },

  saveHistory(item: HistoryItem): void {
    const history = this.getHistory()
    const exists = history.find(h => h.convertedText === item.convertedText)
    if (exists) return
    
    history.unshift(item)
    if (history.length > MAX_HISTORY) {
      history.pop()
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  },

  clearHistory(): void {
    localStorage.removeItem(HISTORY_KEY)
  },

  deleteHistoryItem(id: string): void {
    const history = this.getHistory().filter(h => h.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  },

  getTheme(): 'light' | 'dark' {
    try {
      const theme = localStorage.getItem(THEME_KEY)
      if (theme === 'dark' || theme === 'light') return theme
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'light'
    }
  },

  saveTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(THEME_KEY, theme)
  }
}
