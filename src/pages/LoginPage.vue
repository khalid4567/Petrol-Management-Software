<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
    <Card class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Fuel class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-gray-900">FuelFlow PMS</h1>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input
          v-model="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          :icon="Mail"
          required
        />
        
        <Input
          v-model="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :icon="Lock"
          required
        />
        
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input type="checkbox" class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
            <span class="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <a href="#" class="text-sm text-primary-600 hover:text-primary-700">Forgot password?</a>
        </div>
        
        <Button type="submit" variant="primary" size="lg" full-width>
          Sign In
        </Button>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { Fuel, Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()

const email = ref('')
const password = ref('')

function handleLogin() {
  authStore.login(email.value, password.value)
  toastStore.success('Login successful!')
  router.push('/dashboard')
}
</script>
