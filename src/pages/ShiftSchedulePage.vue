<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Shift Schedule</h1>
        <p class="text-sm text-gray-600 mt-1">Manage employee shift schedules and holidays</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button @click="showScheduleModal = true" variant="primary" size="md">
          <CalendarPlus class="w-4 h-4" />
          Add Schedule
        </Button>
        <!-- Changed button text from "Request Holiday" to "Add Holiday" -->
        <Button @click="showHolidayModal = true" variant="secondary" size="md">
          <Palmtree class="w-4 h-4" />
          Add Holiday
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Shifts</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ shiftsStore.schedules.length }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <Calendar class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active Shifts Today</p>
            <p class="text-2xl font-bold text-green-900 mt-1">{{ activeShiftsToday }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <Clock class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </Card>

      <!-- Removed "Pending Holidays" card since there's no approval workflow -->
      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Total Holidays</p>
            <p class="text-2xl font-bold text-purple-900 mt-1">{{ shiftsStore.holidays.length }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <CalendarCheck class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </Card>

      <Card class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">On Holiday Today</p>
            <p class="text-2xl font-bold text-pink-900 mt-1">{{ employeesOnHoliday }}</p>
          </div>
          <div class="p-3 bg-pink-100 rounded-lg">
            <Palmtree class="w-6 h-6 text-pink-600" />
          </div>
        </div>
      </Card>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 overflow-x-auto" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Calendar View -->
    <Card v-if="activeTab === 'calendar'" class="p-4 sm:p-6">
      <FullCalendar :options="calendarOptions" />
    </Card>

    <!-- Schedules List -->
    <Card v-if="activeTab === 'schedules'" title="Shift Schedules">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recurring</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="schedule in shiftsStore.schedules" :key="schedule.id">
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ schedule.employeeName }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                <Badge :variant="getShiftBadgeVariant(schedule.shiftType)">
                  {{ schedule.shiftType }}
                </Badge>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(schedule.date) }}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                <span v-if="schedule.isRecurring">
                  {{ schedule.recurringPattern }} until {{ formatDate(schedule.recurringEndDate!) }}
                </span>
                <span v-else class="text-gray-400">One-time</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <!-- Added button to convert shift to holiday -->
                <button
                  @click="convertShiftToHoliday(schedule)"
                  class="text-purple-600 hover:text-purple-900"
                  title="Convert to Holiday"
                >
                  <Palmtree class="w-4 h-4" />
                </button>
                <button
                  @click="editSchedule(schedule)"
                  class="text-blue-600 hover:text-blue-900"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  @click="confirmDeleteSchedule(schedule.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Updated Holidays tab title and removed status/actions columns -->
    <Card v-if="activeTab === 'holidays'" title="Employee Holidays">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="holiday in shiftsStore.holidays" :key="holiday.id">
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ holiday.employeeName }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(holiday.startDate) }} - {{ formatDate(holiday.endDate) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                <Badge variant="info">{{ holiday.type }}</Badge>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600 max-w-xs truncate">
                {{ holiday.reason }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ calculateDays(holiday.startDate, holiday.endDate) }} days
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  @click="editHoliday(holiday)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  @click="confirmDeleteHoliday(holiday.id)"
                  class="text-red-600 hover:text-red-900"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Add/Edit Schedule Modal -->
    <Modal v-model="showScheduleModal" :title="editingSchedule ? 'Edit Schedule' : 'Add Schedule'">
      <form @submit.prevent="saveSchedule" class="space-y-4">
        <Select
          v-model="scheduleForm.employeeId"
          label="Employee"
          :options="employeeOptions"
          required
        />

        <Select
          v-model="scheduleForm.shiftType"
          label="Shift Type"
          :options="shiftTypeOptions"
          required
        />

        <Input
          v-model="scheduleForm.date"
          type="date"
          label="Start Date"
          required
        />

        <div class="flex items-center space-x-2">
          <input
            v-model="scheduleForm.isRecurring"
            type="checkbox"
            id="isRecurring"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="isRecurring" class="text-sm font-medium text-gray-700">
            Recurring Schedule
          </label>
        </div>

        <div v-if="scheduleForm.isRecurring" class="space-y-4">
          <Select
            v-model="scheduleForm.recurringPattern"
            label="Recurring Pattern"
            :options="recurringOptions"
          />

          <Input
            v-model="scheduleForm.recurringEndDate"
            type="date"
            label="End Date"
          />
        </div>

        <div class="flex justify-end space-x-3">
          <Button type="button" variant="secondary" @click="showScheduleModal = false">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {{ editingSchedule ? 'Update' : 'Add' }} Schedule
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Updated modal title from "Request Holiday" to "Add Holiday" -->
    <Modal v-model="showHolidayModal" :title="editingHoliday ? 'Edit Holiday' : 'Add Holiday'">
      <form @submit.prevent="saveHoliday" class="space-y-4">
        <Select
          v-model="holidayForm.employeeId"
          label="Employee"
          :options="employeeOptions"
          required
        />

        <Input
          v-model="holidayForm.startDate"
          type="date"
          label="Start Date"
          required
        />

        <Input
          v-model="holidayForm.endDate"
          type="date"
          label="End Date"
          required
        />

        <Select
          v-model="holidayForm.type"
          label="Leave Type"
          :options="leaveTypeOptions"
          required
        />

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Reason</label>
          <textarea
            v-model="holidayForm.reason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <!-- Added warning message about shift conversion -->
        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <strong>Note:</strong> Any existing shifts scheduled for this employee during the holiday period will be automatically removed.
          </p>
        </div>

        <div class="flex justify-end space-x-3">
          <Button type="button" variant="secondary" @click="showHolidayModal = false">
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {{ editingHoliday ? 'Update' : 'Add' }} Holiday
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Confirmation Alert -->
    <ConfirmationAlert
      v-model="showDeleteConfirm"
      :title="deleteConfirmTitle"
      :message="deleteConfirmMessage"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShiftsStore } from '@/stores/shifts'
import { useEmployeesStore } from '@/stores/employees'
import { useToastStore } from '@/stores/toast'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Badge from '@/components/ui/Badge.vue'
import ConfirmationAlert from '@/components/ui/ConfirmationAlert.vue'
import {
  Calendar,
  CalendarPlus,
  CalendarCheck,
  Clock,
  Palmtree,
  Pencil,
  Trash2,
} from 'lucide-vue-next'

const shiftsStore = useShiftsStore()
const employeesStore = useEmployeesStore()
const toastStore = useToastStore()

const activeTab = ref('calendar')
const showScheduleModal = ref(false)
const showHolidayModal = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmTitle = ref('')
const deleteConfirmMessage = ref('')
const deleteType = ref<'schedule' | 'holiday'>('schedule')
const deleteId = ref('')
const editingSchedule = ref(false)
const editingHoliday = ref(false)

const tabs = [
  { id: 'calendar', name: 'Calendar View' },
  { id: 'schedules', name: 'Shift Schedules' },
  { id: 'holidays', name: 'Employee Holidays' },
]

const scheduleForm = ref({
  employeeId: '',
  shiftType: '',
  date: '',
  isRecurring: false,
  recurringPattern: 'Weekly',
  recurringEndDate: '',
})

const holidayForm = ref({
  employeeId: '',
  startDate: '',
  endDate: '',
  type: 'Annual Leave',
  reason: '',
})

const employeeOptions = computed(() => {
  return employeesStore.getActiveEmployees().map((emp) => ({
    label: `${emp.name} (${emp.employeeId}) - ${emp.role}`,
    value: emp.id,
  }))
})

const shiftTypeOptions = [
  { label: 'Morning (6AM - 2PM)', value: 'Morning' },
  { label: 'Afternoon (2PM - 10PM)', value: 'Afternoon' },
  { label: 'Night (10PM - 6AM)', value: 'Night' },
]

const recurringOptions = [
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Monthly', value: 'Monthly' },
]

const leaveTypeOptions = [
  { label: 'Annual Leave', value: 'Annual Leave' },
  { label: 'Sick Leave', value: 'Sick Leave' },
  { label: 'Emergency Leave', value: 'Emergency Leave' },
  { label: 'Unpaid Leave', value: 'Unpaid Leave' },
]

const activeShiftsToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return shiftsStore.getSchedulesByDate(today).length
})


const employeesOnHoliday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return shiftsStore.holidays.filter(
    (h) =>
      new Date(today) >= new Date(h.startDate) &&
      new Date(today) <= new Date(h.endDate)
  ).length
})

const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay',
  },
  events: getCalendarEvents(),
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  height: 'auto',
  eventClick: handleEventClick,
  dateClick: handleDateClick,
}))

function getCalendarEvents() {
  const events = []

  // Add shift schedules
  shiftsStore.schedules.forEach((schedule) => {
    const shiftColors = {
      Morning: '#3B82F6',
      Afternoon: '#F59E0B',
      Night: '#8B5CF6',
    }

    events.push({
      id: `schedule-${schedule.id}`,
      title: `${schedule.employeeName} - ${schedule.shiftType}`,
      start: schedule.date,
      backgroundColor: shiftColors[schedule.shiftType],
      borderColor: shiftColors[schedule.shiftType],
      extendedProps: {
        type: 'schedule',
        data: schedule,
      },
    })
  })

  shiftsStore.holidays.forEach((holiday) => {
    events.push({
      id: `holiday-${holiday.id}`,
      title: `${holiday.employeeName} - Holiday`,
      start: holiday.startDate,
      end: holiday.endDate,
      backgroundColor: '#EC4899',
      borderColor: '#EC4899',
      extendedProps: {
        type: 'holiday',
        data: holiday,
      },
    })
  })

  return events
}

function handleEventClick(info: any) {
  const { type, data } = info.event.extendedProps
  if (type === 'schedule') {
    editSchedule(data)
  } else if (type === 'holiday') {
    editHoliday(data)
  }
}

function handleDateClick(info: any) {
  scheduleForm.value.date = info.dateStr
  showScheduleModal.value = true
}

function saveSchedule() {
  const employee = employeesStore.getEmployeeById(scheduleForm.value.employeeId)
  if (!employee) {
    toastStore.error('Please select a valid employee')
    return
  }

  if (shiftsStore.isEmployeeOnHoliday(scheduleForm.value.employeeId, scheduleForm.value.date)) {
    toastStore.error('Cannot schedule shift: Employee is on holiday during this period')
    return
  }

  if (editingSchedule.value) {
    shiftsStore.updateSchedule(deleteId.value, {
      ...scheduleForm.value,
      employeeName: employee.name,
    })
    toastStore.success('Schedule updated successfully!')
  } else {
    shiftsStore.addSchedule({
      ...scheduleForm.value,
      employeeName: employee.name,
    })
    toastStore.success('Schedule added successfully!')
  }

  showScheduleModal.value = false
  resetScheduleForm()
}

function editSchedule(schedule: any) {
  editingSchedule.value = true
  deleteId.value = schedule.id
  scheduleForm.value = {
    employeeId: schedule.employeeId,
    shiftType: schedule.shiftType,
    date: schedule.date,
    isRecurring: schedule.isRecurring,
    recurringPattern: schedule.recurringPattern || 'Weekly',
    recurringEndDate: schedule.recurringEndDate || '',
  }
  showScheduleModal.value = true
}

function convertShiftToHoliday(schedule: any) {
  editingHoliday.value = false
  holidayForm.value = {
    employeeId: schedule.employeeId,
    startDate: schedule.date,
    endDate: schedule.date,
    type: 'Annual Leave',
    reason: 'Converted from shift',
  }
  showHolidayModal.value = true
  toastStore.info('Fill in holiday details. The shift will be removed when you save.')
}

function confirmDeleteSchedule(id: string) {
  deleteType.value = 'schedule'
  deleteId.value = id
  deleteConfirmTitle.value = 'Delete Schedule'
  deleteConfirmMessage.value = 'Are you sure you want to delete this shift schedule?'
  showDeleteConfirm.value = true
}

function confirmDeleteHoliday(id: string) {
  deleteType.value = 'holiday'
  deleteId.value = id
  deleteConfirmTitle.value = 'Delete Holiday'
  deleteConfirmMessage.value = 'Are you sure you want to delete this holiday?'
  showDeleteConfirm.value = true
}

function handleDeleteConfirm() {
  if (deleteType.value === 'schedule') {
    shiftsStore.deleteSchedule(deleteId.value)
    toastStore.success('Schedule deleted successfully!')
  } else {
    shiftsStore.deleteHoliday(deleteId.value)
    toastStore.success('Holiday deleted successfully!')
  }
}

function resetScheduleForm() {
  editingSchedule.value = false
  deleteId.value = ''
  scheduleForm.value = {
    employeeId: '',
    shiftType: '',
    date: '',
    isRecurring: false,
    recurringPattern: 'Weekly',
    recurringEndDate: '',
  }
}

function saveHoliday() {
  const employee = employeesStore.getEmployeeById(holidayForm.value.employeeId)
  if (!employee) {
    toastStore.error('Please select a valid employee')
    return
  }

  if (editingHoliday.value) {
    shiftsStore.updateHoliday(deleteId.value, {
      ...holidayForm.value,
      employeeName: employee.name,
    })
    toastStore.success('Holiday updated successfully! Overlapping shifts have been removed.')
  } else {
    shiftsStore.addHoliday({
      ...holidayForm.value,
      employeeName: employee.name,
    })
    const shiftsRemoved = shiftsStore.schedules.length
    toastStore.success('Holiday added successfully! Any overlapping shifts have been removed.')
  }

  showHolidayModal.value = false
  resetHolidayForm()
}

function editHoliday(holiday: any) {
  editingHoliday.value = true
  deleteId.value = holiday.id
  holidayForm.value = {
    employeeId: holiday.employeeId,
    startDate: holiday.startDate,
    endDate: holiday.endDate,
    type: holiday.type,
    reason: holiday.reason,
  }
  showHolidayModal.value = true
}

function resetHolidayForm() {
  editingHoliday.value = false
  deleteId.value = ''
  holidayForm.value = {
    employeeId: '',
    startDate: '',
    endDate: '',
    type: 'Annual Leave',
    reason: '',
  }
}


function calculateDays(startDate: string, endDate: string): number {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return diffDays
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getShiftBadgeVariant(shiftType: string) {
  const variants: Record<string, string> = {
    Morning: 'info',
    Afternoon: 'warning',
    Night: 'secondary',
  }
  return variants[shiftType] || 'default'
}

</script>
