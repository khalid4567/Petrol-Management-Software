<template>
  <header class="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        <button 
          @click="$emit('toggle-sidebar')"
          class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu class="w-5 h-5 text-gray-600" />
        </button>
        
        <div class="min-w-0">
          <h2 class="text-lg md:text-2xl font-bold text-gray-900 truncate">{{ pageTitle }}</h2>
          <p class="text-xs md:text-sm text-gray-500 hidden sm:block truncate">{{ currentDate }}</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button class="p-2 hover:bg-gray-100 rounded-lg relative">
          <Bell class="w-5 h-5 text-gray-600" />
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div class="relative" ref="dropdownRef">
          <button 
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center gap-2 md:gap-3 p-2 hover:bg-gray-100 rounded-lg"
          >
            <div class="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-sm font-medium">{{ userInitials }}</span>
            </div>
            <div class="text-left hidden md:block">
              <p class="text-sm font-medium text-gray-900 truncate max-w-[120px]">{{ user?.name }}</p>
              <p class="text-xs text-gray-500 truncate">{{ user?.role }}</p>
            </div>
            <ChevronDown class="w-4 h-4 text-gray-600 hidden sm:block" />
          </button>
          
          <div 
            v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <User class="w-4 h-4 inline mr-2" />
              Profile
            </a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Settings class="w-4 h-4 inline mr-2" />
              Settings
            </a>
            <hr class="my-1" />
            <button 
              @click="handleLogout"
              class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut class="w-4 h-4 inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Bell, ChevronDown, User, Settings, LogOut, Menu } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const user = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!user.value) return 'U'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const pageTitle = computed(() => {
  const name = route.name as string
  return name || 'Dashboard'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

defineEmits(['toggle-sidebar'])

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
