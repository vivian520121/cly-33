import { ref } from 'vue'
import type { HistoryItem } from '@/types'
import { storage } from '@/utils/storage'

const history = ref<HistoryItem[]>([])

const loadHistory = () => {
  history.value = storage.getHistory()
}

loadHistory()

export function useHistory() {
  const addToHistory = (originalText: string, convertedText: string, type: 'font' | 'symbol' | 'format') => {
    const item: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      originalText,
      convertedText,
      type,
      timestamp: Date.now()
    }
    storage.saveHistory(item)
    loadHistory()
  }

  const deleteHistoryItem = (id: string) => {
    storage.deleteHistoryItem(id)
    loadHistory()
  }

  const clearHistory = () => {
    storage.clearHistory()
    loadHistory()
  }

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
    
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return {
    history,
    loadHistory,
    addToHistory,
    deleteHistoryItem,
    clearHistory,
    formatTime
  }
}
