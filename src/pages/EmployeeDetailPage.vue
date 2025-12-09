<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
   

    
    <div class="space-y-6">
      <!-- Employee Profile Card -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Profile Info -->
        <Card class="lg:col-span-1">
           <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-4">
              <Button @click="goBack" variant="secondary" size="sm">
                <ArrowLeft class="w-4 h-4" />
              </Button>
              
            </div>
            <div class="flex gap-2">
              <span @click="openEditModal">
                  <Pencil class="w-4 h-4" />
              </span>
              
            </div>
          </div>
          <div class="flex flex-col items-center text-center space-y-4 mt-5">
             <div class="w-24 h-24 rounded-full overflow-hidden shadow-lg ring-2 ring-indigo-200">
                <img 
                  src="/vuero-1.svg" 
                  alt="Avatar" 
                  class="w-full h-full object-cover"
                />
              </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ employee.name }}</h3>
              <p class="text-sm text-gray-600">{{ employee.employeeId }}</p>
              <Badge :variant="getStatusBadgeVariant(employee.status)" class="mt-2">
                {{ employee.status }}
              </Badge>
            </div>
            <div class="w-full space-y-3 text-left pt-4 border-t">
              <div class="flex items-center gap-2 text-sm">
                <Mail class="w-4 h-4 text-gray-500" />
                <span class="text-gray-900">{{ employee.email }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <Phone class="w-4 h-4 text-gray-500" />
                <span class="text-gray-900">{{ employee.contactNumber }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <Building class="w-4 h-4 text-gray-500" />
                <span class="text-gray-900">{{ employee.department }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <Clock class="w-4 h-4 text-gray-500" />
                <span class="text-gray-900">{{ employee.shift }} Shift</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <Calendar class="w-4 h-4 text-gray-500" />
                <span class="text-gray-900">Joined {{ formatDate(employee.joinDate) }}</span>
              </div>
            </div>
          </div>
        </Card>

        <!-- Stats Cards -->
        <div class="lg:col-span-3">
          <!-- Tabs -->
      <Card class="p-0 overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- Shift Schedule Tab -->
          <div v-if="activeTab === 'schedule'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">Shift Schedule</h3>
            </div>
            <div class="overflow-x-auto">
              <Table :columns="scheduleColumns">
                <tr v-for="schedule in employeeSchedules" :key="schedule.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(schedule.date) }}</td>
                  <td class="px-6 py-4">
                    <Badge variant="info">{{ schedule.shiftType }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ schedule.isRecurring ? 'Yes' : 'No' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ schedule.recurringPattern || '-' }}
                  </td>
                </tr>
              </Table>
              <div v-if="employeeSchedules.length === 0" class="text-center py-8 text-gray-500">
                No shifts scheduled
              </div>
            </div>
          </div>

          <!-- Shift History Tab -->
          <div v-if="activeTab === 'history'" class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Shift History</h3>
            <div class="overflow-x-auto">
              <Table :columns="historyColumns">
                <tr v-for="shift in employeeShifts" :key="shift.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(shift.startDate) }}</td>
                  <td class="px-6 py-4">
                    <Badge variant="info">{{ shift.shiftType }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ shift.startTime }} - {{ shift.endTime || 'In Progress' }}
                  </td>
                  <td class="px-6 py-4">
                    <Badge :variant="getShiftStatusVariant(shift.status)">{{ shift.status }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">₹{{ shift.openingCash }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">₹{{ shift.closingCash || '-' }}</td>
                  <td class="px-6 py-4 text-sm" :class="getVarianceColor(shift.variance)">
                    {{ shift.variance ? `₹${shift.variance}` : '-' }}
                  </td>
                </tr>
              </Table>
              <div v-if="employeeShifts.length === 0" class="text-center py-8 text-gray-500">
                No shift history
              </div>
            </div>
          </div>

          <!-- Expenses Tab -->
          <div v-if="activeTab === 'expenses'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">Expenses</h3>
              <Button @click="openAddExpenseModal" variant="primary" size="sm">
                <Plus class="w-4 h-4" />
                <span>Add Expense</span>
              </Button>
            </div>
            <div class="overflow-x-auto">
              <Table :columns="expenseColumns">
                <tr v-for="expense in employeeExpenses" :key="expense.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(expense.date) }}</td>
                  <td class="px-6 py-4">
                    <Badge variant="default">{{ expense.category }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ expense.description }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">₹{{ expense.amount }}</td>
                  <td class="px-6 py-4">
                    <Badge :variant="getExpenseStatusVariant(expense.status)">{{ expense.status }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        v-if="expense.status === 'Pending'"
                        @click="approveExpense(expense.id)"
                        class="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        <CheckCircle class="w-4 h-4" />
                      </button>
                      <button
                        @click="openDeleteExpenseConfirmation(expense.id)"
                        class="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              </Table>
              <div v-if="employeeExpenses.length === 0" class="text-center py-8 text-gray-500">
                No expenses recorded
              </div>
            </div>
          </div>

          <!-- Payments Tab -->
          <div v-if="activeTab === 'payments'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900">Payment History</h3>
              <Button @click="openAddPaymentModal" variant="primary" size="sm">
                <Plus class="w-4 h-4" />
                <span>Add Payment</span>
              </Button>
            </div>
            <div class="overflow-x-auto">
              <Table :columns="paymentColumns">
                <tr v-for="payment in employeePayments" :key="payment.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ formatDate(payment.date) }}</td>
                  <td class="px-6 py-4">
                    <Badge variant="info">{{ payment.type }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ payment.month || payment.description || '-' }}</td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">₹{{ payment.amount.toLocaleString() }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ payment.paymentMethod }}</td>
                  <td class="px-6 py-4">
                    <Badge :variant="getPaymentStatusVariant(payment.status)">{{ payment.status }}</Badge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ payment.referenceNumber || '-' }}</td>
                </tr>
              </Table>
              <div v-if="employeePayments.length === 0" class="text-center py-8 text-gray-500">
                No payment history
              </div>
            </div>
          </div>
        </div>
      </Card>
          <!-- <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-blue-600 font-medium">Monthly Salary</p>
                <p class="text-2xl font-bold text-blue-900">₹{{ employee.monthlySalary.toLocaleString() }}</p>
              </div>
              <IndianRupee class="w-10 h-10 text-blue-500" />
            </div>
          </Card>
          <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-green-600 font-medium">Total Paid</p>
                <p class="text-2xl font-bold text-green-900">₹{{ totalPaid.toLocaleString() }}</p>
              </div>
              <Wallet class="w-10 h-10 text-green-500" />
            </div>
          </Card>
          <Card class="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-orange-600 font-medium">Pending Expenses</p>
                <p class="text-2xl font-bold text-orange-900">₹{{ pendingExpenses.toLocaleString() }}</p>
              </div>
              <Receipt class="w-10 h-10 text-orange-500" />
            </div>
          </Card>
          <Card class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-purple-600 font-medium">Shifts Completed</p>
                <p class="text-2xl font-bold text-purple-900">{{ completedShifts }}</p>
              </div>
              <Clock class="w-10 h-10 text-purple-500" />
            </div>
          </Card> -->
        </div>
      </div>

      
    </div>

    <!-- Edit Employee Modal -->
    <Modal v-model="showEditModal" title="Edit Employee Profile" size="lg">
      <form @submit.prevent="handleUpdateEmployee" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input v-model="editForm.name" label="Employee Name" required />
          <Input v-model="editForm.email" type="email" label="Email" required />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input v-model="editForm.contactNumber" label="Contact Number" required />
          <Input v-model="editForm.emergencyContact" label="Emergency Contact" />
        </div>
        <Input v-model="editForm.address" label="Address" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input v-model.number="editForm.monthlySalary" type="number" label="Monthly Salary (₹)" required />
          <Input v-model="editForm.bankAccount" label="Bank Account" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select v-model="editForm.status" label="Status" :options="statusOptions" required />
          <Select v-model="editForm.shift" label="Shift" :options="shiftOptions" required />
        </div>
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button @click="showEditModal = false" type="button" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Update Profile</Button>
        </div>
      </form>
    </Modal>

    <!-- Add Expense Modal -->
    <Modal v-model="showExpenseModal" title="Add Expense" size="md">
      <form @submit.prevent="handleAddExpense" class="space-y-4">
        <Input v-model="expenseForm.date" type="date" label="Date" required />
        <Select v-model="expenseForm.category" label="Category" :options="expenseCategoryOptions" required />
        <Input v-model.number="expenseForm.amount" type="number" label="Amount (₹)" required />
        <Input v-model="expenseForm.description" label="Description" required />
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button @click="showExpenseModal = false" type="button" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Add Expense</Button>
        </div>
      </form>
    </Modal>

    <!-- Add Payment Modal -->
    <Modal v-model="showPaymentModal" title="Add Payment" size="md">
      <form @submit.prevent="handleAddPayment" class="space-y-4">
        <Input v-model="paymentForm.date" type="date" label="Date" required />
        <Select v-model="paymentForm.type" label="Type" :options="paymentTypeOptions" required />
        <Input v-model.number="paymentForm.amount" type="number" label="Amount (₹)" required />
        <Input v-model="paymentForm.month" label="Month (for Salary)" v-if="paymentForm.type === 'Salary'" />
        <Input v-model="paymentForm.description" label="Description" v-if="paymentForm.type !== 'Salary'" />
        <Select v-model="paymentForm.paymentMethod" label="Payment Method" :options="paymentMethodOptions" required />
        <Input v-model="paymentForm.referenceNumber" label="Reference Number" />
        <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <Button @click="showPaymentModal = false" type="button" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Add Payment</Button>
        </div>
      </form>
    </Modal>

    <!-- Delete Expense Confirmation -->
    <ConfirmationAlert
      v-model="showDeleteExpenseConfirmation"
      title="Delete Expense"
      message="Are you sure you want to delete this expense?"
      confirmText="Delete"
      @confirm="handleDeleteExpense"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { useShiftsStore } from '@/stores/shifts'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import Table from '@/components/ui/Table.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Modal from '@/components/ui/Modal.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import {
  ArrowLeft, Pencil, Mail, Phone, Building, Clock, Calendar, IndianRupee, Wallet,
  Receipt, Plus, CheckCircle, Trash2
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const employeesStore = useEmployeesStore()
const shiftsStore = useShiftsStore()
const toastStore = useToastStore()

const employeeId = route.params.id as string
const employee = computed(() => employeesStore.getEmployeeById(employeeId))

const activeTab = ref('schedule')
const showEditModal = ref(false)
const showExpenseModal = ref(false)
const showPaymentModal = ref(false)
const showDeleteExpenseConfirmation = ref(false)
const deleteExpenseId = ref<string | null>(null)

const editForm = ref({
  name: '',
  email: '',
  contactNumber: '',
  emergencyContact: '',
  address: '',
  monthlySalary: 0,
  bankAccount: '',
  status: '',
  shift: ''
})

const expenseForm = ref({
  date: new Date().toISOString().split('T')[0],
  category: '',
  amount: 0,
  description: ''
})

const paymentForm = ref({
  date: new Date().toISOString().split('T')[0],
  type: '',
  amount: 0,
  month: '',
  description: '',
  paymentMethod: '',
  referenceNumber: ''
})

const tabs = [
  { id: 'schedule', label: 'Shift Schedule' },
  { id: 'history', label: 'Shift History' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'payments', label: 'Payments' }
]

const scheduleColumns = [
  { key: 'date', label: 'Date' },
  { key: 'shiftType', label: 'Shift Type' },
  { key: 'recurring', label: 'Recurring' },
  { key: 'pattern', label: 'Pattern' }
]

const historyColumns = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Shift Type' },
  { key: 'time', label: 'Time' },
  { key: 'status', label: 'Status' },
  { key: 'opening', label: 'Opening Cash' },
  { key: 'closing', label: 'Closing Cash' },
  { key: 'variance', label: 'Variance' }
]

const expenseColumns = [
  { key: 'date', label: 'Date' },
  { key: 'category', label: 'Category' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' }
]

const paymentColumns = [
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'method', label: 'Method' },
  { key: 'status', label: 'Status' },
  { key: 'reference', label: 'Reference' }
]

const statusOptions = [
  { label: 'Active', value: 'Active' },
  { label: 'Inactive', value: 'Inactive' },
  { label: 'On Leave', value: 'On Leave' }
]

const shiftOptions = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Afternoon', value: 'Afternoon' },
  { label: 'Night', value: 'Night' },
  { label: 'Flexible', value: 'Flexible' }
]

const expenseCategoryOptions = [
  { label: 'Food', value: 'Food' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Uniform', value: 'Uniform' },
  { label: 'Other', value: 'Other' }
]

const paymentTypeOptions = [
  { label: 'Salary', value: 'Salary' },
  { label: 'Bonus', value: 'Bonus' },
  { label: 'Expense Reimbursement', value: 'Expense Reimbursement' },
  { label: 'Advance', value: 'Advance' }
]

const paymentMethodOptions = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Bank Transfer', value: 'Bank Transfer' },
  { label: 'Cheque', value: 'Cheque' }
]

const employeeSchedules = computed(() => 
  shiftsStore.schedules.filter(s => s.employeeId === employeeId)
)

const employeeShifts = computed(() => 
  shiftsStore.shifts.filter(s => s.employeeId === employeeId)
)

const employeeExpenses = computed(() => 
  employeesStore.getExpensesByEmployee(employeeId)
)

const employeePayments = computed(() => 
  employeesStore.getPaymentsByEmployee(employeeId)
)

const totalPaid = computed(() => 
  employeePayments.value
    .filter(p => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0)
)

const pendingExpenses = computed(() => 
  employeeExpenses.value
    .filter(e => e.status === 'Approved')
    .reduce((sum, e) => sum + e.amount, 0)
)

const completedShifts = computed(() => 
  employeeShifts.value.filter(s => s.status === 'Completed').length
)

function goBack() {
  router.push('/employees')
}

function openEditModal() {
  if (employee.value) {
    editForm.value = {
      name: employee.value.name,
      email: employee.value.email,
      contactNumber: employee.value.contactNumber,
      emergencyContact: employee.value.emergencyContact || '',
      address: employee.value.address || '',
      monthlySalary: employee.value.monthlySalary,
      bankAccount: employee.value.bankAccount || '',
      status: employee.value.status,
      shift: employee.value.shift
    }
    showEditModal.value = true
  }
}

function handleUpdateEmployee() {
  employeesStore.updateEmployee(employeeId, editForm.value as any)
  toastStore.success('Employee profile updated successfully!')
  showEditModal.value = false
}

function openAddExpenseModal() {
  expenseForm.value = {
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: 0,
    description: ''
  }
  showExpenseModal.value = true
}

function handleAddExpense() {
  if (!employee.value) return
  
  employeesStore.addExpense({
    employeeId: employeeId,
    employeeName: employee.value.name,
    ...expenseForm.value,
    status: 'Pending'
  } as any)
  
  toastStore.success('Expense added successfully!')
  showExpenseModal.value = false
}

function approveExpense(expenseId: string) {
  employeesStore.updateExpense(expenseId, { status: 'Approved', approvedBy: 'Admin' })
  toastStore.success('Expense approved!')
}

function openDeleteExpenseConfirmation(expenseId: string) {
  deleteExpenseId.value = expenseId
  showDeleteExpenseConfirmation.value = true
}

function handleDeleteExpense() {
  if (deleteExpenseId.value) {
    employeesStore.deleteExpense(deleteExpenseId.value)
    toastStore.success('Expense deleted!')
    deleteExpenseId.value = null
  }
}

function openAddPaymentModal() {
  paymentForm.value = {
    date: new Date().toISOString().split('T')[0],
    type: '',
    amount: 0,
    month: '',
    description: '',
    paymentMethod: '',
    referenceNumber: ''
  }
  showPaymentModal.value = true
}

function handleAddPayment() {
  if (!employee.value) return
  
  employeesStore.addPayment({
    employeeId: employeeId,
    employeeName: employee.value.name,
    ...paymentForm.value,
    status: 'Completed'
  } as any)
  
  toastStore.success('Payment recorded successfully!')
  showPaymentModal.value = false
}

function getStatusBadgeVariant(status: string) {
  const variants: Record<string, string> = {
    Active: 'success',
    Inactive: 'danger',
    'On Leave': 'warning'
  }
  return variants[status] || 'default'
}

function getShiftStatusVariant(status: string) {
  const variants: Record<string, string> = {
    Scheduled: 'info',
    Active: 'warning',
    Completed: 'success',
    Cancelled: 'danger'
  }
  return variants[status] || 'default'
}

function getExpenseStatusVariant(status: string) {
  const variants: Record<string, string> = {
    Pending: 'warning',
    Approved: 'info',
    Rejected: 'danger',
    Paid: 'success'
  }
  return variants[status] || 'default'
}

function getPaymentStatusVariant(status: string) {
  const variants: Record<string, string> = {
    Pending: 'warning',
    Completed: 'success',
    Failed: 'danger'
  }
  return variants[status] || 'default'
}

function getVarianceColor(variance?: number) {
  if (!variance) return 'text-gray-900'
  return variance > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(() => {
  if (!employee.value) {
    toastStore.error('Employee not found')
    router.push('/employees')
  }
})
</script>
