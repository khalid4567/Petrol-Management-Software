<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-4 md:mb-6">
      <h1 class="text-xl md:text-2xl font-bold text-gray-800">Customer Management</h1>
      <Button @click="openAddModal" variant="primary" class="w-full sm:w-auto">
        <Plus class="w-4 h-4" />
        <span class="ml-2">Add Customer</span>
      </Button>
    </div>

    <!-- Customers Table -->
    <Card>
      <div class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Sr No
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Customer Name
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Customer ID
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Contact Number
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Vehicle
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Created Date
                </th>
                <th class="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(customer, index) in customersStore.customers" :key="customer.id" class="hover:bg-gray-50">
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ customer.name }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.customerId }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.contactNumber }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.email || '-' }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.vehicleNumber || '-' }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(customer.createdAt) }}
                </td>
                <td class="px-3 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-1 md:gap-2">
                    <Button @click="viewCustomer(customer.id)" variant="secondary" size="sm">
                      View
                    </Button>
                    <Button @click="openEditModal(customer)" variant="outline" size="sm">
                      <Edit class="w-4 h-4" />
                    </Button>
                    <Button @click="openDeleteConfirmation(customer)" variant="danger" size="sm">
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="customersStore.customers.length === 0">
                <td colspan="6" class="px-4 md:px-6 py-8 text-center text-gray-500 text-sm md:text-base">
                  No customers found. Click "Add Customer" to create one.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>

    <!-- Add/Edit Customer Modal -->
    <Modal v-model="isModalOpen" title="Add Customer" size="lg">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h2 class="text-lg md:text-xl font-semibold text-gray-800">
          {{ isEditMode ? 'Edit Customer' : 'Add Customer' }}
        </h2>
        <button @click="handleViewAll" class="w-full sm:w-auto px-4 py-2 bg-indigo-900 text-white text-sm rounded hover:bg-indigo-800 transition-colors">
          View All
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Customer Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Customer Name <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="formData.name"
              placeholder="Enter customer name"
              required
            />
          </div>

          <!-- Customer ID -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Customer ID <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="formData.customerId"
              placeholder="Enter customer ID"
              required
            />
          </div>
        </div>

        <!-- Contact Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Contact Number <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="formData.contactNumber"
            type="tel"
            placeholder="Enter contact number"
            required
          />
        </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input v-model="formData.email" type="email" placeholder="name@example.com" />
          </div>
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <Input v-model="formData.address" placeholder="Customer address" />
        </div>

        <!-- Vehicle Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
          <Input v-model="formData.vehicleNumber" placeholder="e.g. MH18 BH2116" />
        </div>
        <!-- Submit Button -->
        <div class="flex justify-start pt-4">
          <Button type="submit" variant="primary" class="w-full sm:w-auto">
            Submit
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation -->
    <ConfirmationAlert
      v-model="isDeleteConfirmOpen"
      title="Delete Customer"
      message="Are you sure you want to delete this customer? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="handleDelete"
      @cancel="closeDeleteConfirmation"
    />

    <!-- Toast Notification -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCustomersStore } from '@/stores/customers'
import type { Customer } from '@/stores/customers'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Toast from '@/components/ui/Toast.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const customersStore = useCustomersStore()
const router = useRouter()

const isModalOpen = ref(false)
const isEditMode = ref(false)
const isDeleteConfirmOpen = ref(false)
const currentCustomerId = ref<string | null>(null)

const formData = reactive({
  name: '',
  customerId: '',
  contactNumber: '',
  email: '',
  address: '',
  vehicleNumber: '',
})

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
})

function openAddModal() {
  isEditMode.value = false
  resetForm()
  isModalOpen.value = true
}

function openEditModal(customer: Customer) {
  isEditMode.value = true
  currentCustomerId.value = customer.id
  formData.name = customer.name
  formData.customerId = customer.customerId
  formData.contactNumber = customer.contactNumber
  formData.email = customer.email || ''
  formData.address = customer.address || ''
  formData.vehicleNumber = customer.vehicleNumber || ''
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  resetForm()
}

function resetForm() {
  formData.name = ''
  formData.customerId = ''
  formData.contactNumber = ''
  formData.email = ''
  formData.address = ''
  formData.vehicleNumber = ''
  currentCustomerId.value = null
}

function handleViewAll() {
  closeModal()
}

function viewCustomer(id: string) {
  router.push({ name: 'CustomerDetail', params: { id } })
}

function handleSubmit() {
  if (isEditMode.value && currentCustomerId.value) {
    const updated = customersStore.updateCustomer(currentCustomerId.value, {
      name: formData.name,
      customerId: formData.customerId,
      contactNumber: formData.contactNumber,
      email: formData.email,
      address: formData.address,
      vehicleNumber: formData.vehicleNumber,
    })

    if (updated) {
      showToast('Customer updated successfully!', 'success')
    } else {
      showToast('Failed to update customer', 'error')
    }
  } else {
    customersStore.addCustomer({
      name: formData.name,
      customerId: formData.customerId,
      contactNumber: formData.contactNumber,
      email: formData.email,
      address: formData.address,
      vehicleNumber: formData.vehicleNumber,
    })
    showToast('Customer added successfully!', 'success')
  }

  closeModal()
}

function openDeleteConfirmation(customer: Customer) {
  currentCustomerId.value = customer.id
  isDeleteConfirmOpen.value = true
}

function closeDeleteConfirmation() {
  isDeleteConfirmOpen.value = false
  currentCustomerId.value = null
}

function handleDelete() {
  if (currentCustomerId.value) {
    const deleted = customersStore.deleteCustomer(currentCustomerId.value)
    if (deleted) {
      showToast('Customer deleted successfully!', 'success')
    } else {
      showToast('Failed to delete customer', 'error')
    }
  }
  closeDeleteConfirmation()
}

function showToast(message: string, type: 'success' | 'error' | 'info') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
