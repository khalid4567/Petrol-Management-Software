import { defineStore } from "pinia"
import { ref } from "vue"

export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>({
    id: "1",
    name: "John Doe",
    email: "john@petrolpump.com",
    role: "Manager",
  })

  const isAuthenticated = ref(true)

  function login(email: string, password: string) {
    // Mock login - in real app, this would call API
    user.value = {
      id: "1",
      name: "John Doe",
      email: email,
      role: "Manager",
    }
    isAuthenticated.value = true
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
  }
})
