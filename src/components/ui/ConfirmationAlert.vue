<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Made dialog responsive with better mobile padding -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="onCancel"></div>
          
          <div class="relative bg-white rounded-lg shadow-xl w-full max-w-sm md:max-w-md" @click.stop>
            <div class="p-4 md:p-6">
              <div class="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-full bg-red-100">
                <AlertTriangle class="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              </div>
              
              <h3 class="text-base md:text-lg font-semibold text-gray-900 text-center mb-2">
                {{ title }}
              </h3>
              
              <p class="text-xs md:text-sm text-gray-600 text-center mb-4 md:mb-6">
                {{ message }}
              </p>
              
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  full-width
                  @click="onCancel"
                >
                  {{ cancelText }}
                </Button>
                <Button
                  variant="danger"
                  full-width
                  @click="onConfirm"
                >
                  {{ confirmText }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import Button from './Button.vue'

interface Props {
  modelValue: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Are you sure?',
  message: 'This action cannot be undone.',
  confirmText: 'Delete',
  cancelText: 'Cancel'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'confirm': []
  'cancel': []
}>()

function onConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function onCancel() {
  emit('cancel')
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
