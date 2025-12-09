<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Added responsive padding and better mobile layout -->
        <div class="flex min-h-screen items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>
          
          <div :class="modalClasses" @click.stop>
            <div class="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h3 class="text-lg md:text-xl font-semibold text-gray-900 pr-4">{{ title }}</h3>
              <button @click="close" class="text-gray-400 hover:text-gray-600 flex-shrink-0">
                <X class="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div class="p-4 md:p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <slot />
            </div>
            
            <div v-if="$slots.footer" class="flex items-center justify-end gap-2 md:gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const modalClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  
  return [
    'relative bg-white w-full',
    'rounded-t-2xl sm:rounded-lg',
    'shadow-xl',
    'max-h-[95vh] sm:max-h-[90vh]',
    'flex flex-col',
    sizes[props.size]
  ].join(' ')
})

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
