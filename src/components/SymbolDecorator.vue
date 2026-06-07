<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, Minus, Smile, Settings } from 'lucide-vue-next'
import ResultCard from './ResultCard.vue'
import { symbolStyles, dividerStyles, emojis, symbolDecorator } from '@/utils/symbolDecorator'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'
import { useHistory } from '@/composables/useHistory'
import type { SymbolStyle, DividerStyle } from '@/types'

const props = defineProps<{
  inputText: string
}>()

const { copyToClipboard } = useClipboard()
const { showToast } = useToast()
const { addToHistory } = useHistory()

const activeTab = ref<'decoration' | 'divider' | 'emoji'>('decoration')
const customPrefix = ref('')
const customSuffix = ref('')
const selectedDividerLength = ref(30)
const emojiPosition = ref<'before' | 'after' | 'both'>('before')

const decoratedResults = computed(() => {
  if (!props.inputText.trim()) return []
  return symbolStyles.map(style => ({
    id: style.id,
    name: style.name,
    result: symbolDecorator.applyDecoration(props.inputText, style)
  }))
})

const dividerResults = computed(() => {
  return dividerStyles.map(style => ({
    id: style.id,
    name: style.name,
    result: symbolDecorator.generateDivider(style, selectedDividerLength.value)
  }))
})

const emojiResults = computed(() => {
  if (!props.inputText.trim()) return []
  return emojis.slice(0, 12).map(emoji => ({
    id: emoji,
    name: emoji,
    result: symbolDecorator.addEmoji(props.inputText, emoji, emojiPosition.value)
  }))
})

const customResult = computed(() => {
  if (!props.inputText.trim() || (!customPrefix.value && !customSuffix.value)) return ''
  return symbolDecorator.applyCustomDecoration(props.inputText, customPrefix.value, customSuffix.value)
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
  addToHistory(props.inputText, content, 'symbol')
  showToast('已保存到历史记录', 'success')
}

const applyStyle = (style: SymbolStyle) => {
  const result = symbolDecorator.applyDecoration(props.inputText, style)
  addToHistory(props.inputText, result, 'symbol')
  handleCopy(result)
}

const applyDivider = (style: DividerStyle) => {
  const result = symbolDecorator.generateDivider(style, selectedDividerLength.value)
  addToHistory('', result, 'symbol')
  handleCopy(result)
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up" style="animation-delay: 0.3s">
    <div class="flex items-center gap-2 mb-4">
      <div class="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
        <Sparkles :size="18" class="text-white" />
      </div>
      <h2 class="text-lg font-semibold text-slate-800 dark:text-white">符号装饰</h2>
    </div>
    
    <div class="flex gap-1 mb-4 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
      <button
        @click="activeTab = 'decoration'"
        :class="[
          'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          activeTab === 'decoration'
            ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        ]"
      >
        <Sparkles :size="14" />
        花边装饰
      </button>
      <button
        @click="activeTab = 'divider'"
        :class="[
          'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          activeTab === 'divider'
            ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        ]"
      >
        <Minus :size="14" />
        分割线
      </button>
      <button
        @click="activeTab = 'emoji'"
        :class="[
          'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
          activeTab === 'emoji'
            ? 'bg-white dark:bg-slate-600 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        ]"
      >
        <Smile :size="14" />
        表情
      </button>
    </div>
    
    <div v-if="activeTab === 'decoration'">
      <div class="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-2 mb-3">
          <Settings :size="14" class="text-slate-500" />
          <span class="text-sm font-medium text-slate-600 dark:text-slate-400">自定义装饰</span>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="customPrefix"
            type="text"
            placeholder="前缀"
            class="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
          <span class="text-slate-400">→</span>
          <input
            v-model="customSuffix"
            type="text"
            placeholder="后缀"
            class="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <ResultCard
          v-if="customResult"
          title="自定义效果"
          :content="customResult"
          :show-history="true"
          class="mt-3"
          @copy="handleCopy"
          @save="handleSave"
        />
      </div>
      
      <div v-if="!inputText.trim()" class="text-center py-8 text-slate-400 dark:text-slate-500">
        <Sparkles :size="36" class="mx-auto mb-2 opacity-30" />
        <p class="text-sm">请在上方输入文字</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResultCard
          v-for="(result, index) in decoratedResults"
          :key="result.id"
          :title="result.name"
          :content="result.result"
          :show-history="true"
          :style="{ animationDelay: `${0.3 + index * 0.05}s` }"
          @copy="handleCopy"
          @save="handleSave"
        />
      </div>
    </div>
    
    <div v-else-if="activeTab === 'divider'">
      <div class="mb-4">
        <label class="block text-sm text-slate-600 dark:text-slate-400 mb-2">
          分割线长度: {{ selectedDividerLength }}
        </label>
        <input
          v-model="selectedDividerLength"
          type="range"
          min="10"
          max="60"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        />
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResultCard
          v-for="(result, index) in dividerResults"
          :key="result.id"
          :title="result.name"
          :content="result.result"
          :show-history="true"
          :style="{ animationDelay: `${0.3 + index * 0.05}s` }"
          @copy="handleCopy"
          @save="(c) => addToHistory('', c, 'symbol')"
        />
      </div>
    </div>
    
    <div v-else-if="activeTab === 'emoji'">
      <div class="mb-4">
        <label class="block text-sm text-slate-600 dark:text-slate-400 mb-2">表情位置</label>
        <div class="flex gap-2">
          <button
            v-for="pos in ['before', 'after', 'both'] as const"
            :key="pos"
            @click="emojiPosition = pos"
            :class="[
              'flex-1 px-3 py-2 text-sm rounded-lg border transition-all duration-200',
              emojiPosition === pos
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            ]"
          >
            {{ pos === 'before' ? '前面' : pos === 'after' ? '后面' : '两侧' }}
          </button>
        </div>
      </div>
      
      <div v-if="!inputText.trim()" class="text-center py-8 text-slate-400 dark:text-slate-500">
        <Smile :size="36" class="mx-auto mb-2 opacity-30" />
        <p class="text-sm">请在上方输入文字</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResultCard
          v-for="(result, index) in emojiResults"
          :key="result.id"
          :title="result.name"
          :content="result.result"
          :show-history="true"
          :style="{ animationDelay: `${0.3 + index * 0.05}s` }"
          @copy="handleCopy"
          @save="handleSave"
        />
      </div>
    </div>
  </div>
</template>
