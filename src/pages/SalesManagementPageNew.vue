<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Sales</p>
            <p class="text-2xl font-bold text-blue-900 mt-1">{{ salesStore.sales.length }}</p>
          </div>
          <Receipt class="w-10 h-10 text-blue-500" />
        </div>
      </Card>

      <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">Total Revenue</p>
            <p class="text-2xl font-bold text-green-900 mt-1">${{ totalRevenue.toFixed(2) }}</p>
          </div>
          <DollarSign class="w-10 h-10 text-green-500" />
        </div>
      </Card>

      <Card class="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-amber-600 font-medium">Today's Sales</p>
            <p class="text-2xl font-bold text-amber-900 mt-1">{{ todaySales }}</p>
          </div>
          <TrendingUp class="w-10 h-10 text-amber-500" />
        </div>
      </Card>

      <Card class="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-cyan-600 font-medium">Avg Sale Value</p>
            <p class="text-2xl font-bold text-cyan-900 mt-1">${{ avgSaleValue.toFixed(2) }}</p>
          </div>
          <BarChart3 class="w-10 h-10 text-cyan-500" />
        </div>
      </Card>
    </div>

    <Card>
      <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div class="flex-1 max-w-md">
          <Input
            v-model="searchQuery"
            placeholder="Search by customer, vehicle, or sale number..."
            :icon="Search"
          />
        </div>
        <Button @click="openAddModal" variant="primary" class="w-full sm:w-auto">
          <Plus class="w-5 h-5" />
          <span class="ml-2">New Sale</span>
        </Button>
      </div>
    </Card>

    <Card>
      <div v-if="salesStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading sales...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale #
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-blue-600">{{ sale.sale_number }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sale.customer_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ sale.vehicle_number }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(sale.sale_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="info">{{ sale.items.length }} items</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ sale.payment_method }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="text-sm font-semibold text-gray-900">${{ sale.final_total.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewSaleDetails(sale)"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="openEditModal(sale)"
                    class="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(sale.id)"
                    class="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredSales.length === 0" class="text-center py-12">
          <Receipt class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No sales found. Create your first sale to get started.</p>
        </div>
      </div>
    </Card>

    <Modal v-model="showModal" :title="isEditMode ? 'Edit Sale' : 'New Sale'" size="xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Customer <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.customer_id"
              @change="handleCustomerSelect"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Customer</option>
              <option v-for="customer in customersStore.customers" :key="customer.id" :value="customer.id">
                {{ customer.name }} ({{ customer.customer_id }})
              </option>
            </select>
          </div>

          <Input
            v-model="formData.vehicle_number"
            label="Vehicle Number"
            placeholder="e.g., MH18 BH2116"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="formData.sale_date"
            type="date"
            label="Sale Date"
            required
          />

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              v-model="formData.payment_method"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-medium text-gray-900">Sale Items</h3>
            <Button type="button" @click="addItem" variant="secondary" size="sm">
              <Plus class="w-4 h-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div class="overflow-x-auto border border-gray-200 rounded-lg">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">#</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Pump</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Fuel Type</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Qty (L)</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Price/L</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-700">Total</th>
                  <th class="px-4 py-2 text-center text-xs font-medium text-gray-700"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in formData.items" :key="item.id" class="border-t">
                  <td class="px-4 py-3 text-sm text-gray-900">{{ index + 1 }}</td>
                  <td class="px-4 py-3">
                    <input
                      v-model="item.pump_number"
                      type="text"
                      placeholder="P001"
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <select
                      v-model="item.fuel_type"
                      @change="updateItemPrice(index)"
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Select</option>
                      <option value="Petrol 95">Petrol 95</option>
                      <option value="Petrol 98">Petrol 98</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Diesel Premium">Diesel Premium</option>
                    </select>
                  </td>
                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.quantity"
                      type="number"
                      step="0.01"
                      min="0"
                      @input="updateItemTotal(index)"
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td class="px-4 py-3">
                    <input
                      v-model.number="item.price"
                      type="number"
                      step="0.01"
                      min="0"
                      @input="updateItemTotal(index)"
                      class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-medium text-gray-900">
                    ${{ item.total.toFixed(2) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button
                      v-if="formData.items.length > 1"
                      type="button"
                      @click="removeItem(index)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tax (10%):</span>
            <span class="font-medium">${{ tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-base font-semibold border-t pt-2">
            <span>Final Total:</span>
            <span class="text-blue-600">${{ finalTotal.toFixed(2) }}</span>
          </div>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button @click="showModal = false" variant="secondary">Cancel</Button>
          <Button @click="handleSubmit" variant="primary">
            {{ isEditMode ? 'Update Sale' : 'Create Sale' }}
          </Button>
        </div>
      </template>
    </Modal>

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
            <p class="text-sm text-gray-600">Customer</p>
            <p class="font-semibold">{{ selectedSale.customer_name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Vehicle</p>
            <p class="font-semibold">{{ selectedSale.vehicle_number }}</p>
          </div>
        </div>

        <div>
          <h4 class="font-semibold mb-3">Items Purchased</h4>
          <div class="border rounded-lg overflow-hidden">
            <table class="min-w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Pump</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Fuel</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-700">Qty</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-700">Price</th>
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
            <span>Total:</span>
            <span class="text-blue-600">${{ selectedSale.final_total.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </Modal>

    <ConfirmationAlert
      v-model="showDeleteConfirm"
      title="Delete Sale"
      message="Are you sure you want to delete this sale? This action cannot be undone."
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSalesSupabaseStore } from '@/stores/salesSupabase'
import { useCustomersSupabaseStore } from '@/stores/customersSupabase'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Receipt,
  DollarSign,
  TrendingUp,
  BarChart3
} from 'lucide-vue-next'

const salesStore = useSalesSupabaseStore()
const customersStore = useCustomersSupabaseStore()

const showModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditMode = ref(false)
const editingId = ref('')
const deletingId = ref('')
const searchQuery = ref('')
const selectedSale = ref<any>(null)

const formData = ref({
  customer_id: '',
  customer_name: '',
  vehicle_number: '',
  sale_date: new Date().toISOString().split('T')[0],
  payment_method: 'Cash',
  items: [
    {
      id: '1',
      pump_number: '',
      fuel_type: '',
      quantity: 0,
      price: 0,
      total: 0
    }
  ]
})

const filteredSales = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return salesStore.sales

  return salesStore.sales.filter(sale =>
    sale.customer_name.toLowerCase().includes(query) ||
    sale.vehicle_number.toLowerCase().includes(query) ||
    sale.sale_number.toLowerCase().includes(query)
  )
})

const totalRevenue = computed(() =>
  salesStore.sales.reduce((sum, sale) => sum + sale.final_total, 0)
)

const todaySales = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return salesStore.sales.filter(sale => sale.sale_date === today).length
})

const avgSaleValue = computed(() => {
  if (salesStore.sales.length === 0) return 0
  return totalRevenue.value / salesStore.sales.length
})

const subtotal = computed(() =>
  formData.value.items.reduce((sum, item) => sum + item.total, 0)
)

const tax = computed(() => subtotal.value * 0.1)
const finalTotal = computed(() => subtotal.value + tax.value)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function openAddModal() {
  isEditMode.value = false
  resetForm()
  showModal.value = true
}

function openEditModal(sale: any) {
  isEditMode.value = true
  editingId.value = sale.id
  formData.value = {
    customer_id: sale.customer_id || '',
    customer_name: sale.customer_name,
    vehicle_number: sale.vehicle_number,
    sale_date: sale.sale_date,
    payment_method: sale.payment_method,
    items: JSON.parse(JSON.stringify(sale.items))
  }
  showModal.value = true
}

function viewSaleDetails(sale: any) {
  selectedSale.value = sale
  showDetailsModal.value = true
}

function handleCustomerSelect() {
  const customer = customersStore.customers.find(c => c.id === formData.value.customer_id)
  if (customer) {
    formData.value.customer_name = customer.name
    if (customer.vehicle_number) {
      formData.value.vehicle_number = customer.vehicle_number
    }
  }
}

function addItem() {
  formData.value.items.push({
    id: String(formData.value.items.length + 1),
    pump_number: '',
    fuel_type: '',
    quantity: 0,
    price: 0,
    total: 0
  })
}

function removeItem(index: number) {
  formData.value.items.splice(index, 1)
}

function updateItemPrice(index: number) {
  const item = formData.value.items[index]
  const prices: Record<string, number> = {
    'Petrol 95': 1.45,
    'Petrol 98': 1.65,
    'Diesel': 1.35,
    'Diesel Premium': 1.55
  }
  if (item.fuel_type) {
    item.price = prices[item.fuel_type] || 0
    updateItemTotal(index)
  }
}

function updateItemTotal(index: number) {
  const item = formData.value.items[index]
  item.total = item.quantity * item.price
}

async function handleSubmit() {
  if (!formData.value.customer_name) {
    return
  }

  const saleData = {
    customer_id: formData.value.customer_id || null,
    customer_name: formData.value.customer_name,
    vehicle_number: formData.value.vehicle_number,
    sale_date: formData.value.sale_date,
    payment_method: formData.value.payment_method,
    items: formData.value.items,
    subtotal: subtotal.value,
    tax: tax.value,
    discount: 0,
    final_total: finalTotal.value
  }

  if (isEditMode.value) {
    await salesStore.updateSale(editingId.value, saleData)
  } else {
    await salesStore.addSale(saleData as any)
  }

  showModal.value = false
  resetForm()
}

function confirmDelete(id: string) {
  deletingId.value = id
  showDeleteConfirm.value = true
}

async function handleDelete() {
  await salesStore.deleteSale(deletingId.value)
  deletingId.value = ''
}

function resetForm() {
  formData.value = {
    customer_id: '',
    customer_name: '',
    vehicle_number: '',
    sale_date: new Date().toISOString().split('T')[0],
    payment_method: 'Cash',
    items: [
      {
        id: '1',
        pump_number: '',
        fuel_type: '',
        quantity: 0,
        price: 0,
        total: 0
      }
    ]
  }
}

onMounted(async () => {
  await Promise.all([
    salesStore.fetchSales(),
    customersStore.fetchCustomers()
  ])
})
</script>
