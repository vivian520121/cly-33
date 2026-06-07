<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <button
    @click="toggleTheme"
    class="relative p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-lg hover:scale-105 group"
    :title="theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
  >
    <Sun
      v-if="theme === 'dark'"
      :size="20"
      class="text-yellow-400 transition-transform duration-500 group-hover:rotate-180"
    />
    <Moon
      v-else
      :size="20"
      class="text-slate-600 transition-transform duration-500 group-hover:-rotate-12"
    />
    <span class="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
  </button>
</template>
