<template>
  <aside class="w-64 md:w-72 lg:w-64 bg-white border-r border-gray-200 flex flex-col h-full  bg-gradient-to-br from-green-50 via-white to-green-100">
    <div class="p-4 md:p-6 border-b border-gray-200">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Fuel class="w-6 h-6 text-white" />
          </div>
          <div class="min-w-0">
            <h1 class="font-bold text-lg text-gray-900 truncate">FuelFlow</h1>
            <p class="text-xs text-gray-500 truncate">Management System</p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <X class="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
    
    <nav class="flex-1 p-3 md:p-4 overflow-y-auto scrollbar-thin">
      <div class="space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="$emit('close')"
          class="flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          active-class="bg-primary-50 text-primary-700 hover:bg-primary-50"
        >
          <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span class="font-medium text-sm md:text-base truncate">{{ item.label }}</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { 
  LayoutDashboard, 
  Fuel, 
  ShoppingCart, 
  Store, 
  Clock, 
  Package, 
  Truck, 
  FileText, 
  Settings,
  Receipt,
  Users,
  X,
  UserCog,
  CalendarDays
} from 'lucide-vue-next'

defineEmits(['close'])

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/pumps', label: 'Pump Management', icon: Fuel },
  { path: '/fuel-sale', label: 'Fuel Sale (POS)', icon: ShoppingCart },
  { path: '/retail-store', label: 'Retail Store', icon: Store },
  { path: '/sales-management', label: 'Sales Management', icon: Receipt },
  { path: '/customers', label: 'Customer Management', icon: Users },
  { path: '/employees', label: 'Employee Management', icon: UserCog },
  { path: '/shift', label: 'Shift Operations', icon: Clock },
  { path: '/shift-schedule', label: 'Shift Schedule', icon: CalendarDays },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/deliveries', label: 'Deliveries', icon: Truck },
  { path: '/reports', label: 'Reports', icon: FileText },
  { path: '/settings', label: 'Settings', icon: Settings }
]
</script>
