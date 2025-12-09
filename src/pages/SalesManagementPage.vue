<template>
  <div class="md:lg:p-0 md:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 md:mb-6">
      <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by customer or vehicle..."
          class="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        />
      <Button variant="secondary" @click="openAddModal" class="w-full sm:w-auto">
        <Plus class="w-5 h-5" />
        <span class="ml-2">Add Sale</span>
      </Button>
    </div>

    <Card>
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Sale ID
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Customer Name
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Vehicle Number
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Items
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Final Total
                </th>
                <th class="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50">
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ sale.id }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ sale.customerName }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ sale.vehicleNumber }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(sale.date) }}
                </td>
                <td class="px-3 md:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {{ sale.items.length }} item(s)
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  ${{ sale.finalTotal.toFixed(2) }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end gap-1 md:gap-2">
                    <button
                      @click="openEditModal(sale)"
                      class="text-blue-600 hover:text-blue-800 p-1.5 md:p-2 rounded hover:bg-blue-50 transition-colors"
                      aria-label="Edit sale"
                    >
                      <Edit2 class="w-4 h-4" />
                    </button>
                    <button
                      @click="openDeleteConfirmation(sale.id)"
                      class="text-red-600 hover:text-red-800 p-1.5 md:p-2 rounded hover:bg-red-50 transition-colors"
                      aria-label="Delete sale"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div v-if="filteredSales.length === 0" class="text-center py-12 px-4">
            <p class="text-gray-500 text-sm md:text-base">No sales records found. Click "Add Sale" to create one.</p>
          </div>
        </div>
      </div>
    </Card>

    <Modal
      v-model="isModalOpen"
      :title="isEditMode ? 'Edit Sale' : 'Add Sales Management'"
      size="xl"
    >
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span class="text-red-500">*</span>
              <span class="text-gray-400 text-xs ml-1 hidden sm:inline">(Click here to add new customer)</span>
            </label>
            <select
              v-model="formData.customerName"
              required
              class="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
            >
              <option value="">Select Customer</option>
              <option v-for="customer in salesStore.customers" :key="customer.id" :value="customer.name">
                {{ customer.name }}
              </option>
            </select>
          </div>
          
          <Input
            v-model="formData.vehicleNumber"
            label="Vehicle Number"
            placeholder="MH18 BH2116"
            required
          />
        </div>

        <div class="mb-6">
          <Input
            v-model="formData.date"
            type="date"
            label="Date"
            required
          />
        </div>

        <div class="mb-4">
          <div class="overflow-x-auto border border-gray-200 rounded-lg -mx-4 sm:mx-0">
            <div class="inline-block min-w-full align-middle">
              <table class="min-w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Sr No</th>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Select Pump</th>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Select Fuel</th>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Quantity</th>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Price</th>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Total</th>
                    <th class="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in formData.items" :key="item.id" class="border-t border-gray-200">
                    <td class="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900">{{ index + 1 }}</td>
                    <td class="px-2 md:px-4 py-2 md:py-3">
                      <select
                        v-model="item.pumpNumber"
                        class="w-full min-w-[100px] px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @change="updateItemTotal(index)"
                      >
                        <option value="">Select Pump</option>
                        <option v-for="pump in pumpsStore.pumps" :key="pump.id" :value="pump.number">
                          {{ pump.number }}
                        </option>
                      </select>
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3">
                      <select
                        v-model="item.fuelType"
                        class="w-full min-w-[120px] px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @change="updateItemTotal(index)"
                      >
                        <option value="">--Select fuel--</option>
                        <option value="Petrol 95">Petrol 95</option>
                        <option value="Petrol 98">Petrol 98</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Diesel Premium">Diesel Premium</option>
                      </select>
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3">
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        placeholder="Qty"
                        min="0"
                        step="0.01"
                        class="w-full min-w-[80px] px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @input="updateItemTotal(index)"
                      />
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3">
                      <input
                        v-model.number="item.price"
                        type="number"
                        placeholder="Sale Price"
                        min="0"
                        step="0.01"
                        class="w-full min-w-[80px] px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @input="updateItemTotal(index)"
                      />
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3">
                      <input
                        :value="item.total.toFixed(2)"
                        type="text"
                        placeholder="Total"
                        readonly
                        class="w-full min-w-[80px] px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-md text-xs md:text-sm bg-gray-50"
                      />
                    </td>
                    <td class="px-2 md:px-4 py-2 md:py-3">
                      <button
                        v-if="formData.items.length > 1"
                        type="button"
                        @click="removeItem(index)"
                        class="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <button
            type="button"
            @click="addItem"
            class="mt-3 inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-green-600 text-white text-xs md:text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus class="w-4 h-4" />
            Add Item
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Final Total</label>
          <div class="w-full md:w-48 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-base md:text-lg font-semibold text-gray-900">
            {{ finalTotal.toFixed(2) }}
          </div>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
          <Button variant="secondary" type="button" @click="closeModal" class="w-full sm:w-auto order-2 sm:order-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" class="w-full sm:w-auto order-1 sm:order-2">
            {{ isEditMode ? 'Update' : 'Submit' }}
          </Button>
        </div>
      </form>
    </Modal>

    <ConfirmationAlert
      v-model="isDeleteAlertOpen"
      title="Delete Sale"
      message="Are you sure you want to delete this sale? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Edit2, Trash2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Modal from '@/components/ui/Modal.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import { useSalesStore, type Sale, type SaleItem } from '@/stores/sales'
import { usePumpsStore } from '@/stores/pumps'
import { useToastStore } from '@/stores/toast'

const salesStore = useSalesStore()
const pumpsStore = usePumpsStore()
const toastStore = useToastStore()

const isModalOpen = ref(false)
const isDeleteAlertOpen = ref(false)
const isEditMode = ref(false)
const editingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

interface FormData {
  customerName: string
  vehicleNumber: string
  date: string
  items: SaleItem[]
}

const formData = ref<FormData>({
  customerName: '',
  vehicleNumber: '',
  date: new Date().toISOString().split('T')[0],
  items: [
    {
      id: '1',
      pumpNumber: '',
      fuelType: '',
      quantity: 0,
      price: 0,
      total: 0
    }
  ]
})
const searchQuery = ref('')

const filteredSales = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return salesStore.sales

  return salesStore.sales.filter(sale =>
    sale.customerName.toLowerCase().includes(query) ||
    sale.vehicleNumber.toLowerCase().includes(query)
  )
})

const finalTotal = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + item.total, 0)
})

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function openAddModal() {
  isEditMode.value = false
  editingId.value = null
  resetForm()
  isModalOpen.value = true
}

function openEditModal(sale: Sale) {
  isEditMode.value = true
  editingId.value = sale.id
  formData.value = {
    customerName: sale.customerName,
    vehicleNumber: sale.vehicleNumber,
    date: sale.date,
    items: JSON.parse(JSON.stringify(sale.items))
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    customerName: '',
    vehicleNumber: '',
    date: new Date().toISOString().split('T')[0],
    items: [
      {
        id: '1',
        pumpNumber: '',
        fuelType: '',
        quantity: 0,
        price: 0,
        total: 0
      }
    ]
  }
}

function addItem() {
  formData.value.items.push({
    id: String(formData.value.items.length + 1),
    pumpNumber: '',
    fuelType: '',
    quantity: 0,
    price: 0,
    total: 0
  })
}

function removeItem(index: number) {
  formData.value.items.splice(index, 1)
}

function updateItemTotal(index: number) {
  const item = formData.value.items[index]
  
  // Auto-fill price based on fuel type
  if (item.fuelType && !item.price) {
    const fuelPrices: Record<string, number> = {
      'Petrol 95': 1.45,
      'Petrol 98': 1.65,
      'Diesel': 1.35,
      'Diesel Premium': 1.55
    }
    item.price = fuelPrices[item.fuelType] || 0
  }
  
  item.total = item.quantity * item.price
}

function handleSubmit() {
  if (isEditMode.value && editingId.value) {
    salesStore.updateSale(editingId.value, {
      customerName: formData.value.customerName,
      vehicleNumber: formData.value.vehicleNumber,
      date: formData.value.date,
      items: formData.value.items,
      finalTotal: finalTotal.value
    })
    toastStore.show('Sale updated successfully', 'success')
  } else {
    salesStore.addSale({
      customerName: formData.value.customerName,
      vehicleNumber: formData.value.vehicleNumber,
      date: formData.value.date,
      items: formData.value.items,
      finalTotal: finalTotal.value
    })
    toastStore.show('Sale added successfully', 'success')
  }
  closeModal()
}

function openDeleteConfirmation(id: string) {
  deletingId.value = id
  isDeleteAlertOpen.value = true
}

function handleDelete() {
  if (deletingId.value) {
    salesStore.deleteSale(deletingId.value)
    toastStore.show('Sale deleted successfully', 'success')
    deletingId.value = null
  }
}
</script>
