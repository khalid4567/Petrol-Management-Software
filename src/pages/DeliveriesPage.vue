<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Fuel Deliveries</h2>
        <p class="text-gray-600">Track incoming fuel deliveries</p>
      </div>
      <Button variant="primary">
        <Plus class="w-4 h-4" />
        New Delivery
      </Button>
    </div>
    
    <Card>
      <Table :columns="deliveryColumns">
        <tr v-for="delivery in deliveries" :key="delivery.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ delivery.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ delivery.date }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ delivery.supplier }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ delivery.fuelType }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ delivery.quantity }}L</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${{ delivery.costPerLitre }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ delivery.totalCost.toFixed(2) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <Badge :variant="getStatusVariant(delivery.status)">
              {{ delivery.status }}
            </Badge>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <button class="text-primary-600 hover:text-primary-700">View</button>
          </td>
        </tr>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { Plus } from 'lucide-vue-next'

const deliveryColumns = [
  { key: 'id', label: 'Delivery ID' },
  { key: 'date', label: 'Date' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'fuelType', label: 'Fuel Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'costPerLitre', label: 'Cost/L' },
  { key: 'totalCost', label: 'Total Cost' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const deliveries = ref([
  {
    id: 'DEL001',
    date: '2025-01-15',
    supplier: 'FuelCorp Ltd',
    fuelType: 'Petrol 95',
    quantity: 20000,
    costPerLitre: 1.20,
    totalCost: 24000,
    status: 'Delivered'
  },
  {
    id: 'DEL002',
    date: '2025-01-14',
    supplier: 'Energy Supplies Inc',
    fuelType: 'Diesel',
    quantity: 15000,
    costPerLitre: 1.10,
    totalCost: 16500,
    status: 'Delivered'
  },
  {
    id: 'DEL003',
    date: '2025-01-18',
    supplier: 'FuelCorp Ltd',
    fuelType: 'Petrol 98',
    quantity: 10000,
    costPerLitre: 1.40,
    totalCost: 14000,
    status: 'Scheduled'
  },
  {
    id: 'DEL004',
    date: '2025-01-12',
    supplier: 'Premium Fuels Co',
    fuelType: 'Diesel Premium',
    quantity: 8000,
    costPerLitre: 1.30,
    totalCost: 10400,
    status: 'Delivered'
  },
  {
    id: 'DEL005',
    date: '2025-01-20',
    supplier: 'Energy Supplies Inc',
    fuelType: 'Petrol 95',
    quantity: 25000,
    costPerLitre: 1.22,
    totalCost: 30500,
    status: 'Pending'
  }
])

function getStatusVariant(status: string) {
  const variants: Record<string, 'success' | 'warning' | 'info'> = {
    'Delivered': 'success',
    'Scheduled': 'info',
    'Pending': 'warning'
  }
  return variants[status] || 'default'
}
</script>
