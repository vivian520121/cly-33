<script setup lang="ts">
import { CheckCircle, XCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info
}

const colors = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500'
}

const bgColors = {
  success: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
}

const textColors = {
  success: 'text-emerald-800 dark:text-emerald-300',
  error: 'text-red-800 dark:text-red-300',
  info: 'text-blue-800 dark:text-blue-300'
}
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-bounce-in',
          bgColors[toast.type]
        ]"
      >
        <div :class="['p-1 rounded-full', colors[toast.type]]">
          <component :is="icons[toast.type]" :size="16" class="text-white" />
        </div>
        <span :class="['text-sm font-medium flex-1', textColors[toast.type]]">
          {{ toast.message }}
        </span>
        <button
          @click="removeToast(toast.id)"
          :class="['p-1 rounded-lg transition-colors duration-200', textColors[toast.type], 'hover:bg-white/30']"
        >
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
