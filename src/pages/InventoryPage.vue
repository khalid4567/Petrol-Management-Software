<template>
  <div class="space-y-6">
    <Card title="Fuel Tanks">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="tank in fuelTanks" :key="tank.id" class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium text-gray-900">{{ tank.name }}</h4>
              <p class="text-sm text-gray-600">{{ tank.fuelType }}</p>
            </div>
            <Badge :variant="getStockVariant(tank.currentLevel, tank.capacity)">
              {{ calculatePercentage(tank.currentLevel, tank.capacity) }}%
            </Badge>
          </div>
          
          <div class="space-y-2">
            <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all"
                :class="getBarColor(tank.currentLevel, tank.capacity)"
                :style="{ width: `${calculatePercentage(tank.currentLevel, tank.capacity)}%` }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-600">
              <span>{{ tank.currentLevel.toLocaleString() }} {{ tank.unit }}</span>
              <span>{{ tank.capacity.toLocaleString() }} {{ tank.unit }}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
    
    <Card title="Product Inventory">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <Input
            v-model="searchQuery"
            placeholder="Search products..."
            :icon="Search"
            class="max-w-md"
          />
          <Button variant="primary">
            <Plus class="w-4 h-4" />
            Add Product
          </Button>
        </div>
        
        <Table :columns="productColumns">
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.category }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <Badge :variant="product.stock < product.reorderLevel ? 'warning' : 'success'">
                {{ product.stock }}
              </Badge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ product.reorderLevel }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ product.price.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <button class="text-primary-600 hover:text-primary-700 mr-3">Edit</button>
              <button class="text-red-600 hover:text-red-700">Delete</button>
            </td>
          </tr>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { Search, Plus } from 'lucide-vue-next'

const inventoryStore = useInventoryStore()
const searchQuery = ref('')
const fuelTanks = computed(() => inventoryStore.fuelTanks)
const filteredProducts = computed(() => {
  if (!searchQuery.value) return inventoryStore.products
  return inventoryStore.products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const productColumns = [
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'stock', label: 'Stock' },
  { key: 'reorderLevel', label: 'Reorder Level' },
  { key: 'price', label: 'Price' },
  { key: 'actions', label: 'Actions' }
]

function calculatePercentage(current: number, capacity: number) {
  return Math.round((current / capacity) * 100)
}

function getStockVariant(current: number, capacity: number) {
  const percentage = (current / capacity) * 100
  if (percentage < 25) return 'danger'
  if (percentage < 50) return 'warning'
  return 'success'
}

function getBarColor(current: number, capacity: number) {
  const percentage = (current / capacity) * 100
  if (percentage < 25) return 'bg-red-500'
  if (percentage < 50) return 'bg-yellow-500'
  return 'bg-green-500'
}
</script>
