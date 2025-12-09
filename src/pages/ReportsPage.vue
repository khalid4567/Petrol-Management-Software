<template>
  <div class="space-y-6">
    <Card title="Sales Reports">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            v-model="filters.startDate"
            type="date"
            label="Start Date"
          />
          
          <Input
            v-model="filters.endDate"
            type="date"
            label="End Date"
          />
          
          <Select
            v-model="filters.pump"
            label="Pump"
            :options="pumpFilterOptions"
            placeholder="All Pumps"
          />
          
          <Select
            v-model="filters.fuelType"
            label="Fuel Type"
            :options="fuelTypeFilterOptions"
            placeholder="All Types"
          />
        </div>
        
        <div class="flex gap-3">
          <Button variant="primary">
            <Filter class="w-4 h-4" />
            Apply Filters
          </Button>
          <Button variant="secondary">
            <Download class="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </Card>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <div class="text-center">
          <p class="text-sm text-gray-600">Total Revenue</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">$45,231</p>
          <p class="text-sm text-green-600 mt-1">+15% vs last period</p>
        </div>
      </Card>
      
      <Card>
        <div class="text-center">
          <p class="text-sm text-gray-600">Total Transactions</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">1,247</p>
          <p class="text-sm text-blue-600 mt-1">+8% vs last period</p>
        </div>
      </Card>
      
      <Card>
        <div class="text-center">
          <p class="text-sm text-gray-600">Avg Transaction</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">$36.27</p>
          <p class="text-sm text-gray-600 mt-1">-2% vs last period</p>
        </div>
      </Card>
      
      <Card>
        <div class="text-center">
          <p class="text-sm text-gray-600">Total Litres Sold</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">31,245</p>
          <p class="text-sm text-green-600 mt-1">+12% vs last period</p>
        </div>
      </Card>
    </div>
    
    <Card title="Detailed Sales Report">
      <Table :columns="reportColumns">
        <tr v-for="report in reportData" :key="report.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.date }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.pump }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.fuelType }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.transactions }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ report.litres }}L</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${{ report.revenue.toFixed(2) }}</td>
        </tr>
      </Table>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import { Filter, Download } from 'lucide-vue-next'

const filters = ref({
  startDate: '2025-01-01',
  endDate: '2025-01-15',
  pump: '',
  fuelType: ''
})

const pumpFilterOptions = [
  { label: 'P001', value: 'P001' },
  { label: 'P002', value: 'P002' },
  { label: 'P003', value: 'P003' },
  { label: 'P004', value: 'P004' },
  { label: 'P005', value: 'P005' },
  { label: 'P006', value: 'P006' }
]

const fuelTypeFilterOptions = [
  { label: 'Petrol 95', value: 'Petrol 95' },
  { label: 'Petrol 98', value: 'Petrol 98' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Diesel Premium', value: 'Diesel Premium' }
]

const reportColumns = [
  { key: 'date', label: 'Date' },
  { key: 'pump', label: 'Pump' },
  { key: 'fuelType', label: 'Fuel Type' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'litres', label: 'Litres' },
  { key: 'revenue', label: 'Revenue' }
]

const reportData = ref([
  { id: 1, date: '2025-01-15', pump: 'P001', fuelType: 'Petrol 95', transactions: 45, litres: 1250, revenue: 1812.50 },
  { id: 2, date: '2025-01-15', pump: 'P002', fuelType: 'Diesel', transactions: 38, litres: 1580, revenue: 2133.00 },
  { id: 3, date: '2025-01-15', pump: 'P003', fuelType: 'Petrol 98', transactions: 32, litres: 890, revenue: 1468.50 },
  { id: 4, date: '2025-01-14', pump: 'P001', fuelType: 'Petrol 95', transactions: 52, litres: 1420, revenue: 2059.00 },
  { id: 5, date: '2025-01-14', pump: 'P005', fuelType: 'Petrol 95', transactions: 48, litres: 1310, revenue: 1899.50 },
  { id: 6, date: '2025-01-14', pump: 'P002', fuelType: 'Diesel', transactions: 41, litres: 1690, revenue: 2281.50 },
  { id: 7, date: '2025-01-13', pump: 'P003', fuelType: 'Petrol 98', transactions: 29, litres: 820, revenue: 1353.00 }
])
</script>
