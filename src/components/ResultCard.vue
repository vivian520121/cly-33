<script setup lang="ts">
import { Copy, Check, History } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps<{
  title: string
  content: string
  showHistory?: boolean
}>()

const emit = defineEmits<{
  copy: [content: string]
  save: [content: string]
}>()

const copied = ref(false)

const handleCopy = async () => {
  emit('copy', props.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <div class="group relative bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 animate-fade-in">
    <div class="flex items-center justify-between mb-3">
      <span class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ title }}</span>
      <div class="flex items-center gap-1">
        <button
          v-if="showHistory"
          @click="$emit('save', content)"
          class="p-1.5 rounded-lg text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-200"
          title="保存到历史"
        >
          <History :size="16" />
        </button>
        <button
          @click="handleCopy"
          class="p-1.5 rounded-lg text-slate-400 hover:text-accent-500 hover:bg-accent-50 dark:hover:bg-accent-900/30 transition-all duration-200"
          title="复制"
        >
          <Check v-if="copied" :size="16" class="text-green-500" />
          <Copy v-else :size="16" />
        </button>
      </div>
    </div>
    <div class="font-mono text-sm break-all leading-relaxed text-slate-800 dark:text-slate-200 min-h-[40px]">
      {{ content || '...' }}
    </div>
  </div>
</template>
