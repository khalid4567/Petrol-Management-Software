<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <Button @click="goBack" variant="ghost" size="sm">
          <ArrowLeft class="w-4 h-4" />
        </Button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p class="text-sm text-gray-600">View and manage customer information and sales</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Loading customer details...</p>
    </div>

    <div v-else-if="!customer" class="text-center py-12">
      <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500">Customer not found</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-1">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-4xl font-bold text-blue-600">{{ customer.name.charAt(0) }}</span>
          </div>

          <div>
            <h3 class="text-xl font-semibold text-gray-900">{{ customer.name }}</h3>
            <p class="text-sm text-gray-600">{{ customer.customer_id }}</p>
          </div>

          <div class="w-full space-y-3 text-left pt-4 border-t">
            <div class="flex items-start gap-3">
              <Phone class="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500">Phone</p>
                <p class="text-sm font-medium text-gray-900">{{ customer.contact_number }}</p>
              </div>
            </div>

            <div v-if="customer.email" class="flex items-start gap-3">
              <Mail class="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500">Email</p>
                <p class="text-sm font-medium text-gray-900">{{ customer.email }}</p>
              </div>
            </div>

            <div v-if="customer.vehicle_number" class="flex items-start gap-3">
              <Car class="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500">Vehicle</p>
                <p class="text-sm font-medium text-gray-900">{{ customer.vehicle_number }}</p>
              </div>
            </div>

            <div v-if="customer.address" class="flex items-start gap-3">
              <MapPin class="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500">Address</p>
                <p class="text-sm font-medium text-gray-900">{{ customer.address }}</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Calendar class="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p class="text-xs text-gray-500">Customer Since</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(customer.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div class="lg:col-span-2 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-600 font-medium">Total Purchases</p>
                <p class="text-2xl font-bold text-green-900 mt-1">${{ customer.total_purchases.toFixed(2) }}</p>
              </div>
              <DollarSign class="w-10 h-10 text-green-500" />
            </div>
          </Card>

          <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 font-medium">Total Sales</p>
                <p class="text-2xl font-bold text-blue-900 mt-1">{{ customerSales.length }}</p>
              </div>
              <Receipt class="w-10 h-10 text-blue-500" />
            </div>
          </Card>

          <Card class="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-amber-600 font-medium">Loyalty Points</p>
                <p class="text-2xl font-bold text-amber-900 mt-1">{{ customer.loyalty_points }}</p>
              </div>
              <Award class="w-10 h-10 text-amber-500" />
            </div>
          </Card>
        </div>

        <Card>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Purchase History</h3>
            <Badge variant="info">{{ customerSales.length }} transactions</Badge>
          </div>

          <div v-if="loadingSales" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>

          <div v-else-if="customerSales.length === 0" class="text-center py-12">
            <Receipt class="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p class="text-gray-500 text-sm">No purchase history yet</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sale #
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Items
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Payment
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="sale in customerSales" :key="sale.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-sm font-medium text-blue-600">{{ sale.sale_number }}</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(sale.sale_date) }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <Badge variant="default">{{ sale.items.length }} items</Badge>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {{ sale.payment_method }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-right">
                    <span class="text-sm font-semibold text-gray-900">${{ sale.final_total.toFixed(2) }}</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      @click="viewSaleDetails(sale)"
                      class="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>

    <Modal v-model="showDetailsModal" title="Sale Details" size="lg">
      <div v-if="selectedSale" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Sale Number</p>
            <p class="font-semibold text-blue-600">{{ selectedSale.sale_number }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Date</p>
            <p class="font-semibold">{{ formatDate(selectedSale.sale_date) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Vehicle</p>
            <p class="font-semibold">{{ selectedSale.vehicle_number }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Payment Method</p>
            <p class="font-semibold">{{ selectedSale.payment_method }}</p>
          </div>
        </div>

        <div>
          <h4 class="font-semibold mb-3">Items Purchased</h4>
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Pump</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Fuel Type</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-700">Quantity</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-700">Price/L</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedSale.items" :key="item.id" class="border-t">
                  <td class="px-4 py-2 text-sm">{{ item.pump_number }}</td>
                  <td class="px-4 py-2 text-sm">{{ item.fuel_type }}</td>
                  <td class="px-4 py-2 text-sm text-right">{{ item.quantity }}L</td>
                  <td class="px-4 py-2 text-sm text-right">${{ item.price.toFixed(2) }}</td>
                  <td class="px-4 py-2 text-sm text-right font-medium">${{ item.total.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Subtotal:</span>
            <span class="font-medium">${{ selectedSale.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Tax:</span>
            <span class="font-medium">${{ selectedSale.tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total Paid:</span>
            <span class="text-blue-600">${{ selectedSale.final_total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomersSupabaseStore } from '@/stores/customersSupabase'
import { useSalesSupabaseStore } from '@/stores/salesSupabase'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import {
  ArrowLeft,
  Phone,
  Mail,
  Car,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Receipt,
  Award,
  Eye
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const customersStore = useCustomersSupabaseStore()
const salesStore = useSalesSupabaseStore()

const customerId = route.params.id as string
const customer = ref<any>(null)
const customerSales = ref<any[]>([])
const loading = ref(true)
const loadingSales = ref(true)
const showDetailsModal = ref(false)
const selectedSale = ref<any>(null)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function goBack() {
  router.push('/customers')
}

function viewSaleDetails(sale: any) {
  selectedSale.value = sale
  showDetailsModal.value = true
}

onMounted(async () => {
  loading.value = true
  loadingSales.value = true

  await customersStore.fetchCustomers()
  customer.value = customersStore.getCustomerById(customerId)
  loading.value = false

  if (customer.value) {
    customerSales.value = await salesStore.getSalesByCustomerId(customerId)
  }
  loadingSales.value = false
})
</script>
