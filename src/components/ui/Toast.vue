<template>
  <Teleport to="body">
    <!-- Made toast notifications responsive and mobile-friendly -->
    <div class="fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="toastClasses(toast.type)"
        >
          <component :is="getIcon(toast.type)" class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <p class="flex-1 text-xs md:text-sm">{{ toast.message }}</p>
          <button @click="removeToast(toast.id)" class="text-current opacity-70 hover:opacity-100 flex-shrink-0">
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const toastStore = useToastStore()
const toasts = computed(() => toastStore.toasts)

function toastClasses(type: string) {
  const base = 'flex items-center gap-2 md:gap-3 w-full sm:min-w-[300px] sm:max-w-md p-3 md:p-4 rounded-lg shadow-lg border'
  
  const variants = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }
  
  return [base, variants[type as keyof typeof variants]].join(' ')
}

function getIcon(type: string) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[type as keyof typeof icons]
}

function removeToast(id: string) {
  toastStore.remove(id)
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
