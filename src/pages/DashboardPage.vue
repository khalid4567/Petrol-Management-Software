<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Stats Cards -->
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

  <!-- Total Fuel Sales -->
  <Card
    class="hover:shadow-lg transition-shadow rounded-2xl 
           bg-gradient-to-br from-green-50 via-white to-green-100 border border-green-100"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs md:text-sm text-gray-600 truncate">Total Fuel Sales</p>
        <p class="text-2l md:text-2xl font-bold text-gray-900 mt-1">$11,371</p>
        <p class="text-xs md:text-sm text-green-600 mt-1 truncate">+12.5% from yesterday</p>
      </div>

      <div
        class="w-12 h-12 bg-green-200/60 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 shadow-sm"
      >
        <TrendingUp class="w-6 h-6 text-green-700" />
      </div>
    </div>
  </Card>

  <!-- Pumps Active -->
  <Card
    class="hover:shadow-lg transition-shadow rounded-2xl 
           bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-100"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs md:text-sm text-gray-600 truncate">Pumps Active</p>
        <p class="text-2xl md:text-2xl font-bold text-gray-900 mt-1">4/6</p>
        <p class="text-xs md:text-sm text-gray-600 mt-1 truncate">2 idle, 1 fault, 1 maintenance</p>
      </div>

      <div
        class="w-12 h-12 bg-blue-200/60 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 shadow-sm"
      >
        <Fuel class="w-6 h-6 text-blue-700" />
      </div>
    </div>
  </Card>

  <!-- Low Stock Alerts -->
  <Card
    class="hover:shadow-lg transition-shadow rounded-2xl 
           bg-gradient-to-br from-red-50 via-white to-red-100 border border-red-100"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs md:text-sm text-gray-600 truncate">Low Stock Alerts</p>
        <p class="text-2xl md:text-2xl font-bold text-gray-900 mt-1">3</p>
        <p class="text-xs md:text-sm text-red-600 mt-1 truncate">Requires attention</p>
      </div>

      <div
        class="w-12 h-12 bg-red-200/60 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 shadow-sm"
      >
        <AlertTriangle class="w-6 h-6 text-red-700" />
      </div>
    </div>
  </Card>

  <!-- Today's Transactions -->
  <Card
    class="hover:shadow-lg transition-shadow rounded-2xl 
           bg-gradient-to-br from-purple-50 via-white to-purple-100 border border-purple-100"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1 min-w-0">
        <p class="text-xs md:text-sm text-gray-600 truncate">Today's Transactions</p>
        <p class="text-2xl md:text-2xl font-bold text-gray-900 mt-1">247</p>
        <p class="text-xs md:text-sm text-gray-600 mt-1 truncate">Last updated: 2 min ago</p>
      </div>

      <div
        class="w-12 h-12 bg-purple-200/60 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 shadow-sm"
      >
        <ShoppingCart class="w-6 h-6 text-purple-700" />
      </div>
    </div>
  </Card>

</div>

    
    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card title="Sales Overview">
        <div class="h-64 md:h-80">
          <Bar :data="salesChartData" :options="chartOptions" />
        </div>
      </Card>
      
      <Card title="Fuel Type Distribution">
        <div class="h-64 md:h-80">
          <Doughnut :data="fuelTypeChartData" :options="chartOptions" />
        </div>
      </Card>
    </div>
    
    <!-- Recent Activity -->
    <Card title="Recent Transactions">
      <div class="overflow-x-auto">
        <Table :columns="transactionColumns">
          <tr v-for="transaction in recentTransactions" :key="transaction.id">
            <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{{ transaction.id }}</td>
            <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{{ transaction.pump }}</td>
            <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{{ transaction.fuelType }}</td>
            <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{{ transaction.litres }}L</td>
            <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">${{ transaction.amount }}</td>
            <td class="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">{{ transaction.time }}</td>
          </tr>
        </Table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import { TrendingUp, Fuel, AlertTriangle, ShoppingCart } from 'lucide-vue-next'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const salesChartData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Sales ($)',
    data: [8500, 9200, 8800, 10500, 11200, 13500, 11371],
    backgroundColor: '#0ea5e9'
  }]
})

const fuelTypeChartData = ref({
  labels: ['Petrol 95', 'Diesel', 'Petrol 98', 'Diesel Premium'],
  datasets: [{
    data: [35, 30, 20, 15],
    backgroundColor: ['#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6']
  }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
})

const transactionColumns = [
  { key: 'id', label: 'ID' },
  { key: 'pump', label: 'Pump' },
  { key: 'fuelType', label: 'Fuel Type' },
  { key: 'litres', label: 'Litres' },
  { key: 'amount', label: 'Amount' },
  { key: 'time', label: 'Time' }
]

const recentTransactions = ref([
  { id: 'TXN001', pump: 'P002', fuelType: 'Diesel', litres: 25.5, amount: 34.43, time: '10:45 AM' },
  { id: 'TXN002', pump: 'P001', fuelType: 'Petrol 95', litres: 42.0, amount: 60.90, time: '10:38 AM' },
  { id: 'TXN003', pump: 'P003', fuelType: 'Petrol 98', litres: 30.2, amount: 49.83, time: '10:22 AM' },
  { id: 'TXN004', pump: 'P005', fuelType: 'Petrol 95', litres: 38.7, amount: 56.12, time: '10:15 AM' },
  { id: 'TXN005', pump: 'P002', fuelType: 'Diesel', litres: 55.0, amount: 74.25, time: '10:05 AM' }
])
</script>

<style scoped>
canvas {
  max-height: 320px;
}

@media (min-width: 768px) {
  canvas {
    max-height: 400px;
  }
}
</style>
