<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Employee Management</h1>
        <p class="text-sm text-gray-600 mt-1">Manage your workforce efficiently</p>
      </div>
      <Button @click="openAddModal" variant="primary" size="lg" class="w-full sm:w-auto">
        <Plus class="w-5 h-5" />
        <span>Add Employee</span>
      </Button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-blue-600 font-medium">Total Employees</p>
            <p class="text-2xl sm:text-3xl font-bold text-blue-900">{{ totalEmployees }}</p>
          </div>
          <Users class="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
        </div>
      </Card>
      <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-green-600 font-medium">Active</p>
            <p class="text-2xl sm:text-3xl font-bold text-green-900">{{ activeEmployees }}</p>
          </div>
          <UserCheck class="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />
        </div>
      </Card>
      <Card class="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-orange-600 font-medium">On Leave</p>
            <p class="text-2xl sm:text-3xl font-bold text-orange-900">{{ onLeaveEmployees }}</p>
          </div>
          <UserMinus class="w-10 h-10 sm:w-12 sm:h-12 text-orange-500" />
        </div>
      </Card>
      <Card class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-purple-600 font-medium">Departments</p>
            <p class="text-2xl sm:text-3xl font-bold text-purple-900">3</p>
          </div>
          <Building class="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" />
        </div>
      </Card>
    </div>

    <!-- Employees Table -->
    <Card>
      <div class="overflow-x-auto">
        <Table :columns="columns">
          <tr v-for="employee in employeesStore.employees" :key="employee.id" class="hover:bg-gray-50">
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary-600 font-semibold text-sm">{{ employee.name.charAt(0) }}</span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ employee.name }}</div>
                  <div class="text-sm text-gray-500">{{ employee.employeeId }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ employee.email }}</div>
              <div class="text-sm text-gray-500">{{ employee.contactNumber }}</div>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <Badge :variant="getRoleBadgeVariant(employee.role)">
                {{ employee.role }}
              </Badge>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ employee.department }}
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <Badge variant="info">
                {{ employee.shift }}
              </Badge>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap">
              <Badge :variant="getStatusBadgeVariant(employee.status)">
                {{ employee.status }}
              </Badge>
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(employee.joinDate) }}
            </td>
            <td class="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2">
                <!-- Added View Details button -->
                <button
                  @click="viewEmployeeDetails(employee.id)"
                  class="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                  title="View Details"
                >
                  <Eye class="w-4 h-4" />
                </button>
                <button
                  @click="openEditModal(employee)"
                  class="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded transition-colors"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  @click="openDeleteConfirmation(employee.id)"
                  class="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </Table>
      </div>
    </Card>

    <!-- Add/Edit Modal -->
    <Modal v-model="showModal" :title="isEditMode ? 'Edit Employee' : 'Add Employee'" size="lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="formData.name"
            label="Employee Name"
            placeholder="Enter employee name"
            required
          />
          
          <Input
            v-model="formData.employeeId"
            label="Employee ID"
            placeholder="EMP001"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            v-model="formData.email"
            type="email"
            label="Email"
            placeholder="employee@petrolpump.com"
            required
          />
          
          <Input
            v-model="formData.contactNumber"
            type="tel"
            label="Contact Number"
            placeholder="+91 9876543210"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            v-model="formData.role"
            label="Role"
            :options="roleOptions"
            required
          />
          
          <Input
            v-model="formData.department"
            label="Department"
            placeholder="Operations"
            required
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            v-model="formData.shift"
            label="Shift"
            :options="shiftOptions"
            required
          />
          
          <Select
            v-model="formData.status"
            label="Status"
            :options="statusOptions"
            required
          />
        </div>

        <Input
          v-model="formData.joinDate"
          type="date"
          label="Join Date"
          required
        />

        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button @click="closeModal" type="button" variant="secondary" class="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" variant="primary" class="w-full sm:w-auto">
            {{ isEditMode ? 'Update' : 'Add' }} Employee
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Confirmation -->
    <ConfirmationAlert
      v-model="showDeleteConfirmation"
      title="Delete Employee"
      message="Are you sure you want to delete this employee? This action cannot be undone."
      confirmText="Delete"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import { Plus, Pencil, Trash2, Users, UserCheck, UserMinus, Building, Eye } from 'lucide-vue-next'
import type { Employee } from '@/stores/employees'

const router = useRouter()
const employeesStore = useEmployeesStore()
const toastStore = useToastStore()

const showModal = ref(false)
const showDeleteConfirmation = ref(false)
const isEditMode = ref(false)
const editingEmployeeId = ref<string | null>(null)
const deleteEmployeeId = ref<string | null>(null)

const formData = ref({
  name: '',
  employeeId: '',
  email: '',
  contactNumber: '',
  role: '',
  department: '',
  shift: '',
  status: 'Active',
  joinDate: ''
})

const columns = [
  { key: 'name', label: 'Employee' },
  { key: 'contact', label: 'Contact' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'shift', label: 'Shift' },
  { key: 'status', label: 'Status' },
  { key: 'joinDate', label: 'Join Date' },
  { key: 'actions', label: 'Actions' }
]

const roleOptions = [
  { label: 'Manager', value: 'Manager' },
  { label: 'Supervisor', value: 'Supervisor' },
  { label: 'Attendant', value: 'Attendant' },
  { label: 'Cashier', value: 'Cashier' }
]

const shiftOptions = [
  { label: 'Morning (6AM - 2PM)', value: 'Morning' },
  { label: 'Afternoon (2PM - 10PM)', value: 'Afternoon' },
  { label: 'Night (10PM - 6AM)', value: 'Night' },
  { label: 'Flexible', value: 'Flexible' }
]

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'On Leave', value: 'On Leave' }
]

const totalEmployees = computed(() => employeesStore.employees.length)

const activeEmployees = computed(() => 
  employeesStore.employees.filter(e => e.status === 'Active').length
)

const onLeaveEmployees = computed(() => 
  employeesStore.employees.filter(e => e.status === 'On Leave').length
)

function openAddModal() {
  isEditMode.value = false
  editingEmployeeId.value = null
  resetForm()
  showModal.value = true
}

function openEditModal(employee: Employee) {
  isEditMode.value = true
  editingEmployeeId.value = employee.id
  formData.value = {
    name: employee.name,
    employeeId: employee.employeeId,
    email: employee.email,
    contactNumber: employee.contactNumber,
    role: employee.role,
    department: employee.department,
    shift: employee.shift,
    status: employee.status,
    joinDate: employee.joinDate
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    name: '',
    employeeId: '',
    email: '',
    contactNumber: '',
    role: '',
    department: '',
    shift: '',
    status: 'Active',
    joinDate: ''
  }
}

function handleSubmit() {
  if (isEditMode.value && editingEmployeeId.value) {
    employeesStore.updateEmployee(editingEmployeeId.value, formData.value as any)
    toastStore.success('Employee updated successfully!')
  } else {
    employeesStore.addEmployee(formData.value as any)
    toastStore.success('Employee added successfully!')
  }
  closeModal()
}

function openDeleteConfirmation(id: string) {
  deleteEmployeeId.value = id
  showDeleteConfirmation.value = true
}

function handleDelete() {
  if (deleteEmployeeId.value) {
    employeesStore.deleteEmployee(deleteEmployeeId.value)
    toastStore.success('Employee deleted successfully!')
    deleteEmployeeId.value = null
  }
}

function getRoleBadgeVariant(role: string) {
  const variants: Record<string, string> = {
    Manager: 'info',
    Supervisor: 'warning',
    Attendant: 'default',
    Cashier: 'default'
  }
  return variants[role] || 'default'
}

function getStatusBadgeVariant(status: string) {
  const variants: Record<string, string> = {
    Active: 'success',
    Inactive: 'danger',
    'On Leave': 'warning'
  }
  return variants[status] || 'default'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function viewEmployeeDetails(employeeId: string) {
  router.push(`/employees/${employeeId}`)
}
</script>
