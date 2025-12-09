import { defineStore } from "pinia"
import { ref } from "vue"

export interface ToastMessage {
  id: string
  type: "success" | "error" | "warning" | "info"
  message: string
  duration?: number
}

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<ToastMessage[]>([])

  function show(toast: Omit<ToastMessage, "id">) {
    const id = `toast-${Date.now()}`
    toasts.value.push({ ...toast, id })

    setTimeout(() => {
      remove(id)
    }, toast.duration || 3000)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function success(message: string) {
    show({ type: "success", message })
  }

  function error(message: string) {
    show({ type: "error", message })
  }

  function warning(message: string) {
    show({ type: "warning", message })
  }

  function info(message: string) {
    show({ type: "info", message })
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    warning,
    info,
  }
})
