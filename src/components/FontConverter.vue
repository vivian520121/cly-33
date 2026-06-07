<script setup lang="ts">
import { computed } from 'vue'
import { Bold, Italic, Square, RefreshCw, Type, Sparkles } from 'lucide-vue-next'
import ResultCard from './ResultCard.vue'
import { fontConverter } from '@/utils/fontConverter'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'
import { useHistory } from '@/composables/useHistory'

const props = defineProps<{
  inputText: string
}>()

const { copyToClipboard } = useClipboard()
const { showToast } = useToast()
const { addToHistory } = useHistory()

const fontResults = computed(() => {
  if (!props.inputText.trim()) return []
  return fontConverter.convertAll(props.inputText)
})

const handleCopy = async (content: string) => {
  const success = await copyToClipboard(content)
  if (success) {
    showToast('已复制到剪贴板', 'success')
  } else {
    showToast('复制失败', 'error')
  }
}

const handleSave = (content: string) => {
  addToHistory(props.inputText, content, 'font')
  showToast('已保存到历史记录', 'success')
}

const fontIcons: Record<string, any> = {
  '粗体': Bold,
  '斜体': Italic,
  '粗斜体': Type,
  '空心字': Square,
  '手写体': Sparkles,
  '哥特体': Type,
  '颠倒文字': RefreshCw,
  '拼音标注': Type
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up" style="animation-delay: 0.2s">
    <div class="flex items-center gap-2 mb-4">
      <div class="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
        <Type :size="18" class="text-white" />
      </div>
      <h2 class="text-lg font-semibold text-slate-800 dark:text-white">花式字体转换</h2>
    </div>
    
    <div v-if="!inputText.trim()" class="text-center py-12 text-slate-400 dark:text-slate-500">
      <Type :size="48" class="mx-auto mb-3 opacity-30" />
      <p>请在上方输入文字</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <ResultCard
        v-for="(result, index) in fontResults"
        :key="result.style"
        :title="result.name"
        :content="result.result"
        :show-history="true"
        :style="{ animationDelay: `${0.3 + index * 0.05}s` }"
        @copy="handleCopy"
        @save="handleSave"
      />
    </div>
  </div>
</template>
