<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Type, Palette, Copy, Edit3, Check, X, RotateCcw, BookOpen } from 'lucide-vue-next'
import { parseTextToPinyinChars, generatePlainText, type PinyinChar, type PinyinOptions } from '@/utils/pinyinAnnotator'
import { useClipboard } from '@/composables/useClipboard'
import { useToast } from '@/composables/useToast'
import { useHistory } from '@/composables/useHistory'

const props = defineProps<{
  inputText: string
}>()

const { copyToClipboard } = useClipboard()
const { showToast } = useToast()
const { addToHistory } = useHistory()

const fontSize = ref(14)
const pinyinColor = ref('#6366f1')
const showPinyin = ref(true)
const customPinyins = ref<Record<string, string>>({})
const editingChar = ref<string | null>(null)
const editValue = ref('')

const pinyinChars = computed<PinyinChar[]>(() => {
  return parseTextToPinyinChars(props.inputText, customPinyins.value)
})

const pinyinOptions = computed<PinyinOptions>(() => ({
  fontSize: fontSize.value,
  color: pinyinColor.value,
  showPinyin: showPinyin.value
}))

const plainTextResult = computed(() => {
  if (!showPinyin.value) return props.inputText
  return generatePlainText(pinyinChars.value)
})

const hanziCount = computed(() => {
  return pinyinChars.value.filter(c => c.isHanzi).length
})

const handleCopy = async () => {
  const success = await copyToClipboard(plainTextResult.value)
  if (success) {
    showToast('已复制到剪贴板', 'success')
  } else {
    showToast('复制失败', 'error')
  }
}

const handleSave = () => {
  addToHistory(props.inputText, plainTextResult.value, 'pinyin')
  showToast('已保存到历史记录', 'success')
}

const startEdit = (char: PinyinChar) => {
  if (!char.isHanzi) return
  editingChar.value = char.char
  editValue.value = char.customPinyin || char.pinyin
}

const saveEdit = () => {
  if (editingChar.value && editValue.value.trim()) {
    customPinyins.value = {
      ...customPinyins.value,
      [editingChar.value]: editValue.value.trim()
    }
    showToast('拼音已更新', 'success')
  }
  cancelEdit()
}

const cancelEdit = () => {
  editingChar.value = null
  editValue.value = ''
}

const resetChar = (char: string) => {
  const newCustoms = { ...customPinyins.value }
  delete newCustoms[char]
  customPinyins.value = newCustoms
  showToast('已恢复默认拼音', 'info')
}

const resetAll = () => {
  customPinyins.value = {}
  showToast('已重置所有拼音', 'info')
}

const hasCustomPinyins = computed(() => Object.keys(customPinyins.value).length > 0)

watch(() => props.inputText, () => {
  cancelEdit()
})
</script>

<template>
  <div class="bg-white dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up" style="animation-delay: 0.25s">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
          <BookOpen :size="18" class="text-white" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white">拼音标注</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">点击汉字可手动修改拼音</p>
        </div>
      </div>
      <span v-if="hanziCount > 0" class="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
        {{ hanziCount }} 字
      </span>
    </div>

    <div v-if="!inputText.trim()" class="text-center py-12 text-slate-400 dark:text-slate-500">
      <BookOpen :size="48" class="mx-auto mb-3 opacity-30" />
      <p>请在上方输入文字</p>
    </div>

    <div v-else class="space-y-4">
      <div class="flex flex-wrap items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
        <div class="flex items-center gap-2">
          <Type :size="16" class="text-slate-500 dark:text-slate-400" />
          <span class="text-sm text-slate-600 dark:text-slate-300">字号</span>
          <input
            type="range"
            v-model.number="fontSize"
            min="10"
            max="24"
            class="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <span class="text-xs font-medium text-slate-500 dark:text-slate-400 w-8">{{ fontSize }}px</span>
        </div>

        <div class="flex items-center gap-2">
          <Palette :size="16" class="text-slate-500 dark:text-slate-400" />
          <span class="text-sm text-slate-600 dark:text-slate-300">颜色</span>
          <div class="flex items-center gap-1">
            <button
              v-for="color in ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b']"
              :key="color"
              @click="pinyinColor = color"
              class="w-5 h-5 rounded-full transition-transform hover:scale-110"
              :class="{ 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500': pinyinColor === color }"
              :style="{ backgroundColor: color }"
            />
          </div>
          <input
            type="color"
            v-model="pinyinColor"
            class="w-6 h-6 rounded cursor-pointer border-0"
            title="自定义颜色"
          />
        </div>

        <div class="flex items-center gap-2 ml-auto">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              v-model="showPinyin"
              class="w-4 h-4 rounded border-slate-300 text-violet-500 focus:ring-violet-500"
            />
            <span class="text-sm text-slate-600 dark:text-slate-300">显示拼音</span>
          </label>
        </div>
      </div>

      <div v-if="hasCustomPinyins" class="flex items-center justify-between">
        <span class="text-xs text-slate-500 dark:text-slate-400">
          已修改 {{ Object.keys(customPinyins).length }} 个拼音
        </span>
        <button
          @click="resetAll"
          class="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <RotateCcw :size="12" />
          重置全部
        </button>
      </div>

      <div class="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl min-h-24 overflow-x-auto">
        <div class="flex flex-wrap items-end gap-1 text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
          <template v-for="(item, index) in pinyinChars" :key="index">
            <div
              v-if="item.isHanzi && showPinyin"
              class="inline-flex flex-col-reverse items-center cursor-pointer group"
              @click="startEdit(item)"
            >
              <span
                class="leading-none mb-0.5 transition-colors group-hover:text-violet-600"
                :style="{ fontSize: fontSize + 'px', color: pinyinColor }"
              >
                {{ item.customPinyin || item.pinyin }}
              </span>
              <span
                class="leading-none"
                :class="{ 'text-violet-600 dark:text-violet-400': item.customPinyin }"
              >
                {{ item.char }}
              </span>
              <span
                v-if="item.customPinyin"
                class="absolute -top-1 -right-1 w-2 h-2 bg-violet-500 rounded-full"
              />
            </div>
            <span
              v-else-if="item.isHanzi && !showPinyin"
              class="cursor-pointer hover:text-violet-600 transition-colors"
              @click="startEdit(item)"
            >
              {{ item.char }}
            </span>
            <span v-else class="whitespace-pre">{{ item.char }}</span>
          </template>
        </div>
      </div>

      <div
        v-if="editingChar"
        class="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800/30"
      >
        <div class="flex items-center gap-3 mb-3">
          <span class="text-2xl font-medium text-slate-800 dark:text-slate-200">{{ editingChar }}</span>
          <span class="text-slate-400">→</span>
          <input
            v-model="editValue"
            type="text"
            placeholder="输入拼音"
            class="flex-1 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            autofocus
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            @click="resetChar(editingChar!)"
            class="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-amber-600 transition-colors"
          >
            <RotateCcw :size="12" />
            恢复默认
          </button>
          <div class="flex gap-2">
            <button
              @click="cancelEdit"
              class="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X :size="14" />
              取消
            </button>
            <button
              @click="saveEdit"
              class="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-violet-500 hover:bg-violet-600 rounded-lg transition-colors"
            >
              <Check :size="14" />
              确定
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button
          @click="handleCopy"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-200 font-medium"
        >
          <Copy :size="16" />
          复制文本
        </button>
        <button
          @click="handleSave"
          class="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg shadow-violet-500/25"
        >
          <Edit3 :size="16" />
          保存
        </button>
      </div>
    </div>
  </div>
</template>
