<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Customers</p>
            <p class="text-2xl font-bold text-blue-900 mt-1">{{ customersStore.customers.length }}</p>
          </div>
          <Users class="w-10 h-10 text-blue-500" />
        </div>
      </Card>

      <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">Total Purchases</p>
            <p class="text-2xl font-bold text-green-900 mt-1">${{ totalPurchases.toFixed(2) }}</p>
          </div>
          <DollarSign class="w-10 h-10 text-green-500" />
        </div>
      </Card>

      <Card class="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-amber-600 font-medium">Avg Purchase</p>
            <p class="text-2xl font-bold text-amber-900 mt-1">${{ avgPurchase.toFixed(2) }}</p>
          </div>
          <TrendingUp class="w-10 h-10 text-amber-500" />
        </div>
      </Card>

      <Card class="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-cyan-600 font-medium">Total Loyalty Points</p>
            <p class="text-2xl font-bold text-cyan-900 mt-1">{{ totalLoyaltyPoints }}</p>
          </div>
          <Award class="w-10 h-10 text-cyan-500" />
        </div>
      </Card>
    </div>

    <Card>
      <div class="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div class="flex-1 max-w-md">
          <Input
            v-model="searchQuery"
            placeholder="Search by name, ID, phone, or vehicle..."
            :icon="Search"
          />
        </div>
        <Button @click="openAddModal" variant="primary" class="w-full sm:w-auto">
          <Plus class="w-5 h-5" />
          <span class="ml-2">Add Customer</span>
        </Button>
      </div>
    </Card>

    <Card>
      <div v-if="customersStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading customers...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Purchases
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loyalty Points
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold">{{ customer.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                    <div class="text-sm text-gray-500">{{ customer.customer_id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ customer.contact_number }}</div>
                <div class="text-sm text-gray-500">{{ customer.email || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ customer.vehicle_number || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-semibold text-green-600">${{ customer.total_purchases.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant="warning">{{ customer.loyalty_points }} pts</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(customer.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewCustomer(customer.id)"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded hover:bg-blue-50 transition-colors"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="openEditModal(customer)"
                    class="text-green-600 hover:text-green-800 p-2 rounded hover:bg-green-50 transition-colors"
                    title="Edit"
                  >
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    @click="confirmDelete(customer.id)"
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

        <div v-if="filteredCustomers.length === 0" class="text-center py-12">
          <Users class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500">No customers found. Add your first customer to get started.</p>
        </div>
      </div>
    </Card>

    <Modal v-model="showModal" :title="isEditMode ? 'Edit Customer' : 'Add Customer'" size="lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="formData.customer_id"
            label="Customer ID"
            placeholder="Auto-generated"
            :disabled="isEditMode"
            required
          />

          <Input
            v-model="formData.name"
            label="Full Name"
            placeholder="Enter customer name"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="formData.contact_number"
            label="Contact Number"
            placeholder="+91 9876543210"
            required
          />

          <Input
            v-model="formData.email"
            type="email"
            label="Email (Optional)"
            placeholder="customer@example.com"
          />
        </div>

        <Input
          v-model="formData.address"
          label="Address (Optional)"
          placeholder="Enter address"
        />

        <Input
          v-model="formData.vehicle_number"
          label="Vehicle Number (Optional)"
          placeholder="e.g., MH18 BH2116"
        />
      </form>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button @click="showModal = false" variant="secondary">Cancel</Button>
          <Button @click="handleSubmit" variant="primary">
            {{ isEditMode ? 'Update Customer' : 'Add Customer' }}
          </Button>
        </div>
      </template>
    </Modal>

    <ConfirmationAlert
      v-model="showDeleteConfirm"
      title="Delete Customer"
      message="Are you sure you want to delete this customer? This action cannot be undone."
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Award
} from 'lucide-vue-next'

const router = useRouter()
const customersStore = useCustomersSupabaseStore()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditMode = ref(false)
const editingId = ref('')
const deletingId = ref('')
const searchQuery = ref('')

const formData = ref({
  customer_id: '',
  name: '',
  contact_number: '',
  email: '',
  address: '',
  vehicle_number: ''
})

const filteredCustomers = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return customersStore.customers

  return customersStore.customers.filter(customer =>
    customer.name.toLowerCase().includes(query) ||
    customer.customer_id.toLowerCase().includes(query) ||
    customer.contact_number.includes(query) ||
    (customer.vehicle_number && customer.vehicle_number.toLowerCase().includes(query))
  )
})

const totalPurchases = computed(() =>
  customersStore.customers.reduce((sum, c) => sum + c.total_purchases, 0)
)

const avgPurchase = computed(() => {
  if (customersStore.customers.length === 0) return 0
  return totalPurchases.value / customersStore.customers.length
})

const totalLoyaltyPoints = computed(() =>
  customersStore.customers.reduce((sum, c) => sum + c.loyalty_points, 0)
)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function openAddModal() {
  isEditMode.value = false
  const customerId = await customersStore.generateCustomerId()
  formData.value = {
    customer_id: customerId,
    name: '',
    contact_number: '',
    email: '',
    address: '',
    vehicle_number: ''
  }
  showModal.value = true
}

function openEditModal(customer: any) {
  isEditMode.value = true
  editingId.value = customer.id
  formData.value = {
    customer_id: customer.customer_id,
    name: customer.name,
    contact_number: customer.contact_number,
    email: customer.email || '',
    address: customer.address || '',
    vehicle_number: customer.vehicle_number || ''
  }
  showModal.value = true
}

function viewCustomer(id: string) {
  router.push(`/customers/${id}`)
}

async function handleSubmit() {
  if (isEditMode.value) {
    await customersStore.updateCustomer(editingId.value, formData.value as any)
  } else {
    await customersStore.addCustomer(formData.value as any)
  }
  showModal.value = false
}

function confirmDelete(id: string) {
  deletingId.value = id
  showDeleteConfirm.value = true
}

async function handleDelete() {
  await customersStore.deleteCustomer(deletingId.value)
  deletingId.value = ''
}

onMounted(async () => {
  await customersStore.fetchCustomers()
})
</script>
