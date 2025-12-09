<template>
  <div class="p-4 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-xl md:text-2xl font-bold">Customer Detail</h1>
        <p class="text-sm text-gray-600">View and manage sales for this customer</p>
      </div>
      <div>
        <Button @click="goBack" variant="ghost">Back</Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card class="lg:col-span-1">
        <div class="space-y-3">
          <h3 class="text-lg font-semibold">{{ customer?.name || '-' }}</h3>
          <div class="text-sm text-gray-600">ID: {{ customer?.customerId || '-' }}</div>
          <div class="text-sm text-gray-600">Contact: {{ customer?.contactNumber || '-' }}</div>
          <div class="text-sm text-gray-600">Email: {{ customer?.email || '-' }}</div>
          <div class="text-sm text-gray-600">Address: {{ customer?.address || '-' }}</div>
        </div>
      </Card>

      <Card class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Sales</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Date</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Vehicle</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">Items</th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sale in customerSales" :key="sale.id">
                <td class="px-4 py-3 text-sm text-gray-700">{{ formatDate(sale.timestamp) }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ sale.vehicleNumber }}</td>
                <td class="px-4 py-3 text-sm text-gray-700">{{ sale.items.length }}</td>
                <td class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">${{ sale.finalTotal.toFixed(2) }}</td>
                <td class="px-4 py-3 text-sm text-right">
                  <div class="flex items-center justify-end gap-2">
                    <Button @click="viewSale(sale.id)" variant="outline" size="sm">View</Button>
                    <Button @click="confirmDelete(sale.id)" variant="danger" size="sm">Delete</Button>
                  </div>
                </td>
              </tr>
              <tr v-if="customerSales.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-gray-500">No sales for this customer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>

    <ConfirmationAlert
      v-model="showConfirm"
      title="Delete Sale"
      :message="'Are you sure you want to delete this sale? This cannot be undone.'"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="deleteSaleConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import { useCustomersStore } from '@/stores/customers'
import { useSalesStore } from '@/stores/sales'

const route = useRoute()
const router = useRouter()
const customersStore = useCustomersStore()
const salesStore = useSalesStore()

const customerId = String(route.params.id || '')
const customer = computed(() => customersStore.getCustomerById(customerId))

// Prefer sales by customerId if present, otherwise match by name
const customerSales = computed(() => {
  if (!customer.value) return []
  const byId = salesStore.getSalesByCustomerId(customerId)
  if (byId && byId.length) return byId
  return salesStore.getSalesByCustomerName(customer.value.name)
})

const showConfirm = ref(false)
const deletingSaleId = ref('')

function goBack() {
  router.back()
}

function viewSale(id: string) {
  router.push({ name: 'SalesManagement' })
}

function confirmDelete(id: string) {
  deletingSaleId.value = id
  showConfirm.value = true
}

function deleteSaleConfirmed() {
  if (deletingSaleId.value) {
    salesStore.deleteSale(deletingSaleId.value)
    deletingSaleId.value = ''
    showConfirm.value = false
  }
}

function formatDate(d: string) {
  const dt = new Date(d)
  return dt.toLocaleString()
}
</script>
