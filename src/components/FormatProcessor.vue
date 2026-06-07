<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlignLeft, ArrowUp, ArrowDown, Trash2, RotateCcw, Minimize2, Type, CaseSensitive } from 'lucide-vue-next'
import ResultCard from './ResultCard.vue'
import { textFormatter } from '@/utils/textFormatter'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'
import { useHistory } from '@/composables/useHistory'
import type { FormatAction } from '@/types'

const props = defineProps<{
  inputText: string
}>()

const emit = defineEmits<{
  apply: [text: string]
}>()

const { copyToClipboard } = useClipboard()
const { showToast } = useToast()
const { addToHistory } = useHistory()

const selectedAction = ref<FormatAction | null>(null)

const formatActions: { action: FormatAction; name: string; icon: any; description: string }[] = [
  { action: 'compressSpaces', name: '压缩空格', icon: Minimize2, description: '合并多个空格为一个' },
  { action: 'toUpperCase', name: '转大写', icon: ArrowUp, description: '全部转为大写字母' },
  { action: 'toLowerCase', name: '转小写', icon: ArrowDown, description: '全部转为小写字母' },
  { action: 'capitalize', name: '首字母大写', icon: CaseSensitive, description: '每个单词首字母大写' },
  { action: 'removeNewlines', name: '去换行', icon: Trash2, description: '移除所有换行符' },
  { action: 'trim', name: '去首尾空格', icon: AlignLeft, description: '移除首尾空白字符' },
  { action: 'reverse', name: '反转文本', icon: RotateCcw, description: '颠倒文字顺序' }
]

const formatResult = computed(() => {
  if (!props.inputText.trim() || !selectedAction.value) return ''
  return textFormatter.format(props.inputText, selectedAction.value)
})

const applyFormat = (action: FormatAction) => {
  selectedAction.value = action
  if (props.inputText.trim()) {
    const result = textFormatter.format(props.inputText, action)
    addToHistory(props.inputText, result, 'format')
  }
}

const applyToInput = () => {
  if (formatResult.value) {
    emit('apply', formatResult.value)
    showToast('已应用到输入框', 'success')
  }
}

const handleCopy = async (content: string) => {
  const success = await copyToClipboard(content)
  if (success) {
    showToast('已复制到剪贴板', 'success')
  } else {
    showToast('复制失败', 'error')
  }
}

const handleSave = (content: string) => {
  addToHistory(props.inputText, content, 'format')
  showToast('已保存到历史记录', 'success')
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up" style="animation-delay: 0.4s">
    <div class="flex items-center gap-2 mb-4">
      <div class="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
        <Type :size="18" class="text-white" />
      </div>
      <h2 class="text-lg font-semibold text-slate-800 dark:text-white">格式处理</h2>
    </div>
    
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
      <button
        v-for="item in formatActions"
        :key="item.action"
        @click="applyFormat(item.action)"
        :class="[
          'flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 group',
          selectedAction === item.action
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-md'
            : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-slate-800/30'
        ]"
        :title="item.description"
      >
        <component
          :is="item.icon"
          :size="18"
          :class="[
            'transition-colors duration-200',
            selectedAction === item.action
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-500 dark:text-slate-400 group-hover:text-primary-500'
          ]"
        />
        <span
          :class="[
            'text-xs font-medium transition-colors duration-200',
            selectedAction === item.action
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-slate-600 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'
          ]"
        >
          {{ item.name }}
        </span>
      </button>
    </div>
    
    <div v-if="!inputText.trim()" class="text-center py-8 text-slate-400 dark:text-slate-500">
      <Type :size="36" class="mx-auto mb-2 opacity-30" />
      <p class="text-sm">请在上方输入文字</p>
    </div>
    
    <div v-else-if="formatResult">
      <ResultCard
        :title="formatActions.find(a => a.action === selectedAction)?.name || '处理结果'"
        :content="formatResult"
        :show-history="true"
        @copy="handleCopy"
        @save="handleSave"
      />
      <button
        @click="applyToInput"
        class="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 active:scale-98"
      >
        <RotateCcw :size="16" />
        应用到输入框
      </button>
    </div>
    
    <div v-else class="text-center py-8 text-slate-400 dark:text-slate-500">
      <p class="text-sm">请选择一个格式处理功能</p>
    </div>
  </div>
</template>
