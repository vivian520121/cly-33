<script setup lang="ts">
import { ref } from 'vue'
import { Github, Heart, Sparkles } from 'lucide-vue-next'
import ThemeToggle from './components/ThemeToggle.vue'
import TextInput from './components/TextInput.vue'
import FontConverter from './components/FontConverter.vue'
import SymbolDecorator from './components/SymbolDecorator.vue'
import FormatProcessor from './components/FormatProcessor.vue'
import PinyinAnnotator from './components/PinyinAnnotator.vue'
import HistoryPanel from './components/HistoryPanel.vue'
import ToastContainer from './components/ToastContainer.vue'

const inputText = ref('Hello World! 你好世界！')

const handleApplyText = (text: string) => {
  inputText.value = text
}

const handleClear = () => {
  inputText.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-grid-pattern">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/50 dark:to-slate-900/50 pointer-events-none"></div>
    
    <header class="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3 animate-fade-in">
            <div class="relative">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 animate-pulse-soft">
                <Sparkles :size="20" class="text-white" />
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-accent-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gradient">字符样式美化工具</h1>
              <p class="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Text Style Beautifier</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            >
              <Github :size="20" class="text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <TextInput
            v-model="inputText"
            @clear="handleClear"
          />
          
          <FontConverter :input-text="inputText" />
          
          <PinyinAnnotator :input-text="inputText" />
          
          <SymbolDecorator :input-text="inputText" />
          
          <FormatProcessor
            :input-text="inputText"
            @apply="handleApplyText"
          />
        </div>
        
        <div class="lg:col-span-1 space-y-6">
          <HistoryPanel @apply="handleApplyText" />
          
          <div class="bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl p-5 border border-primary-200/50 dark:border-primary-800/30 animate-slide-up" style="animation-delay: 0.6s">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles :size="16" class="text-primary-500" />
              使用提示
            </h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                输入文字后自动生成各种样式
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                拼音标注支持自定义字号和颜色
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                点击汉字可手动修改拼音
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                点击复制按钮一键复制结果
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                历史记录自动保存最近10条
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary-500 mt-0.5">•</span>
                支持深色/浅色模式切换
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    
    <footer class="border-t border-slate-200/50 dark:border-slate-700/50 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <p class="flex items-center gap-1.5">
            Made with <Heart :size="14" class="text-red-500 fill-red-500 animate-pulse" /> 
            for creative minds
          </p>
          <p>© 2024 Text Style Beautifier. All rights reserved.</p>
        </div>
      </div>
    </footer>
    
    <ToastContainer />
  </div>
</template>
