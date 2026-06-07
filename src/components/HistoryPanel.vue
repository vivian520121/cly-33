<script setup lang="ts">
import { ref } from 'vue'
import { History, Trash2, Copy, X, ChevronDown, ChevronUp, Clock, Type, Sparkles, AlignLeft } from 'lucide-vue-next'
import { useHistory } from '@/composables/useHistory'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{
  apply: [text: string]
}>()

const { history, deleteHistoryItem, clearHistory, formatTime } = useHistory()
const { copyToClipboard } = useClipboard()
const { showToast } = useToast()

const isExpanded = ref(true)

const typeIcons: Record<string, any> = {
  font: Type,
  symbol: Sparkles,
  format: AlignLeft
}

const typeLabels: Record<string, string> = {
  font: '字体',
  symbol: '装饰',
  format: '格式'
}

const handleCopy = async (text: string) => {
  const success = await copyToClipboard(text)
  if (success) {
    showToast('已复制到剪贴板', 'success')
  } else {
    showToast('复制失败', 'error')
  }
}

const handleApply = (text: string) => {
  emit('apply', text)
  showToast('已应用到输入框', 'success')
}

const handleDelete = (id: string) => {
  deleteHistoryItem(id)
  showToast('已删除记录', 'info')
}

const handleClearAll = () => {
  if (confirm('确定要清空所有历史记录吗？')) {
    clearHistory()
    showToast('历史记录已清空', 'info')
  }
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up overflow-hidden" style="animation-delay: 0.5s">
    <button
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200"
    >
      <div class="flex items-center gap-2">
        <div class="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
          <History :size="18" class="text-white" />
        </div>
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white">历史记录</h2>
        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
          {{ history.length }}/10
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="history.length > 0"
          @click.stop="handleClearAll"
          class="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          title="清空历史"
        >
          <Trash2 :size="16" />
        </button>
        <ChevronUp v-if="isExpanded" :size="20" class="text-slate-400" />
        <ChevronDown v-else :size="20" class="text-slate-400" />
      </div>
    </button>
    
    <div v-show="isExpanded" class="border-t border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
      <div v-if="history.length === 0" class="py-12 text-center text-slate-400 dark:text-slate-500">
        <Clock :size="40" class="mx-auto mb-3 opacity-30" />
        <p class="text-sm">暂无历史记录</p>
        <p class="text-xs mt-1">转换结果会自动保存在这里</p>
      </div>
      
      <div v-else class="divide-y divide-slate-100 dark:divide-slate-700/50">
        <div
          v-for="(item, index) in history"
          :key="item.id"
          class="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 group animate-fade-in"
          :style="{ animationDelay: `${index * 0.03}s` }"
        >
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex items-center gap-1.5">
              <span
                :class="[
                  'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full',
                  item.type === 'font' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                  item.type === 'symbol' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                ]"
              >
                <component :is="typeIcons[item.type]" :size="12" />
                {{ typeLabels[item.type] }}
              </span>
              <span class="text-xs text-slate-400">{{ formatTime(item.timestamp) }}</span>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click="handleCopy(item.convertedText)"
                class="p-1 rounded text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-200"
                title="复制"
              >
                <Copy :size="14" />
              </button>
              <button
                @click="handleApply(item.convertedText)"
                class="p-1 rounded text-slate-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/30 transition-all duration-200"
                title="应用"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button
                @click="handleDelete(item.id)"
                class="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                title="删除"
              >
                <X :size="14" />
              </button>
            </div>
          </div>
          
          <div v-if="item.originalText" class="text-xs text-slate-400 dark:text-slate-500 mb-1 truncate">
            原文: {{ item.originalText }}
          </div>
          <div class="font-mono text-sm text-slate-700 dark:text-slate-300 break-all line-clamp-2">
            {{ item.convertedText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
