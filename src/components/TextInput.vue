<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Type, Eraser, Copy, CheckSquare } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
}>()

const { showToast } = useToast()
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const charCount = computed(() => props.modelValue.length)
const wordCount = computed(() => props.modelValue.trim() ? props.modelValue.trim().split(/\s+/).length : 0)

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleClear = () => {
  emit('clear')
  emit('update:modelValue', '')
  showToast('内容已清空', 'info')
}

const handleSelectAll = () => {
  if (textareaRef.value) {
    textareaRef.value.select()
    showToast('已全选文本', 'info')
  }
}

const handleCopyOriginal = async () => {
  if (props.modelValue) {
    try {
      await navigator.clipboard.writeText(props.modelValue)
      showToast('原文已复制', 'success')
    } catch {
      showToast('复制失败', 'error')
    }
  }
}

const handlePaste = async () => {
  try {
    const text = await navigator.clipboard.readText()
    if (text) {
      emit('update:modelValue', text)
      showToast('已粘贴剪贴板内容', 'success')
    }
  } catch {
    showToast('无法访问剪贴板', 'error')
  }
}

watch(() => props.modelValue, (newVal) => {
  if (textareaRef.value && textareaRef.value.value !== newVal) {
    textareaRef.value.value = newVal
  }
})
</script>

<template>
  <div class="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up" style="animation-delay: 0.1s">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="p-2 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
          <Type :size="18" class="text-white" />
        </div>
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white">文本输入</h2>
      </div>
      <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>{{ charCount }} 字符</span>
        <span>{{ wordCount }} 词</span>
      </div>
    </div>
    
    <div class="relative">
      <textarea
        ref="textareaRef"
        :value="modelValue"
        @input="handleInput"
        placeholder="在这里输入或粘贴您想要美化的文字..."
        class="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 dark:focus:border-primary-500 transition-all duration-200 font-mono text-sm leading-relaxed"
      ></textarea>
      
      <div class="absolute bottom-3 right-3 flex items-center gap-1">
        <button
          @click="handlePaste"
          class="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-200"
          title="粘贴"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
        </button>
      </div>
    </div>
    
    <div class="flex items-center gap-2 mt-4 flex-wrap">
      <button
        @click="handleSelectAll"
        class="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 active:scale-95"
      >
        <CheckSquare :size="14" />
        全选
      </button>
      <button
        @click="handleCopyOriginal"
        :disabled="!modelValue"
        class="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <Copy :size="14" />
        复制原文
      </button>
      <button
        @click="handleClear"
        :disabled="!modelValue"
        class="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
      >
        <Eraser :size="14" />
        清空
      </button>
    </div>
  </div>
</template>
