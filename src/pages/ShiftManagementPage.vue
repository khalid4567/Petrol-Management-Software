<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Enhanced header with navigation to schedule page -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Shift Operations</h1>
        <p class="text-sm text-gray-600 mt-1">Start, monitor, and close shifts with meter readings</p>
      </div>
      <Button @click="$router.push('/shift-schedule')" variant="secondary" size="md">
        <Calendar class="w-4 h-4" />
        View Schedule
      </Button>
    </div>

    <!-- Active Shift Alert -->
    <div v-if="shiftsStore.activeShift" class="bg-green-50 border border-green-200 rounded-lg p-4">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <AlertCircle class="w-5 h-5 text-green-600" />
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-green-800">Active Shift in Progress</h3>
          <p class="mt-1 text-sm text-green-700">
            {{ shiftsStore.activeShift.employeeName }} - {{ shiftsStore.activeShift.shiftType }} Shift
            <br />
            Started: {{ formatDateTime(shiftsStore.activeShift.startDate, shiftsStore.activeShift.startTime) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Start Shift Form -->
    <Card v-if="!shiftsStore.activeShift" title="Start New Shift">
      <form @submit.prevent="startShift" class="space-y-4 sm:space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Employee selection -->
          <Select
            v-model="shiftForm.employeeId"
            label="Select Employee"
            :options="activeEmployeeOptions"
            required
          />
          
          <!-- Shift type selection -->
          <Select
            v-model="shiftForm.shiftType"
            label="Shift Type"
            :options="shiftTypeOptions"
            required
          />

          <!-- Date and time inputs -->
          <Input
            v-model="shiftForm.startDate"
            type="date"
            label="Date"
            required
          />

          <Input
            v-model="shiftForm.startTime"
            type="time"
            label="Start Time"
            required
          />

          <!-- Opening cash amount -->
          <Input
            v-model="shiftForm.openingCash"
            type="number"
            label="Opening Cash Amount ($)"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>

        <!-- Pump meter readings at shift start -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Opening Meter Readings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card
              v-for="pump in pumpsStore.pumps"
              :key="pump.id"
              class="p-4 bg-gray-50"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="font-medium text-gray-900">{{ pump.number }}</h4>
                  <Badge :variant="getPumpStatusVariant(pump.status)" size="sm">
                    {{ pump.status }}
                  </Badge>
                </div>
                <p class="text-sm text-gray-600">{{ pump.fuelType }}</p>
                <Input
                  v-model="pumpReadings[pump.id]"
                  type="number"
                  label="Start Reading (L)"
                  placeholder="0.00"
                  step="0.01"
                  :disabled="pump.status === 'Maintenance' || pump.status === 'Fault'"
                  required
                />
              </div>
            </Card>
          </div>
        </div>
        
        <Button type="submit" variant="primary" size="lg" :full-width="true">
          <Clock class="w-5 h-5" />
          Start Shift
        </Button>
      </form>
    </Card>
    
    <!-- Active Shift Details and Close Form -->
    <div v-else class="space-y-6">
      <!-- Active shift information card -->
      <Card>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-lg font-semibold text-gray-900">Active Shift Details</h3>
            <p class="text-sm text-gray-600">
              <strong>Employee:</strong> {{ shiftsStore.activeShift.employeeName }} ({{ shiftsStore.activeShift.employeeRole }})
            </p>
            <p class="text-sm text-gray-600">
              <strong>Shift:</strong> {{ shiftsStore.activeShift.shiftType }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Started:</strong> {{ formatDateTime(shiftsStore.activeShift.startDate, shiftsStore.activeShift.startTime) }}
            </p>
          </div>
          <Badge variant="success" size="lg">Active</Badge>
        </div>
      </Card>

      <!-- Opening meter readings display -->
      <Card title="Opening Meter Readings">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="reading in shiftsStore.activeShift.pumpReadings"
            :key="reading.pumpId"
            class="p-4 bg-gray-50 rounded-lg"
          >
            <h4 class="font-medium text-gray-900">{{ reading.pumpNumber }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ reading.fuelType }}</p>
            <p class="text-2xl font-bold text-blue-600 mt-2">{{ reading.startReading }} L</p>
          </div>
        </div>
      </Card>
      
      <!-- Shift summary statistics -->
      <Card title="Shift Summary">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">Opening Cash</p>
            <p class="text-2xl font-bold text-gray-900">${{ shiftsStore.activeShift.openingCash.toFixed(2) }}</p>
          </div>
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-gray-600">Sales Today</p>
            <p class="text-2xl font-bold text-green-600">$1,245.50</p>
          </div>
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-gray-600">Transactions</p>
            <p class="text-2xl font-bold text-purple-600">42</p>
          </div>
          <div class="text-center p-4 bg-orange-50 rounded-lg">
            <p class="text-sm text-gray-600">Duration</p>
            <p class="text-2xl font-bold text-orange-600">{{ calculateDuration() }}</p>
          </div>
        </div>
      </Card>
      
      <!-- Close shift form with meter readings -->
      <Card title="Close Shift">
        <form @submit.prevent="endShift" class="space-y-6">
          <!-- Closing meter readings -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Closing Meter Readings</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card
                v-for="reading in shiftsStore.activeShift.pumpReadings"
                :key="reading.pumpId"
                class="p-4 bg-gray-50"
              >
                <div class="space-y-3">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ reading.pumpNumber }}</h4>
                    <p class="text-sm text-gray-600">{{ reading.fuelType }}</p>
                    <p class="text-xs text-gray-500 mt-1">
                      Start: <strong>{{ reading.startReading }} L</strong>
                    </p>
                  </div>
                  <Input
                    v-model="closingReadings[reading.pumpId]"
                    type="number"
                    label="End Reading (L)"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                  <div v-if="closingReadings[reading.pumpId]" class="text-sm">
                    <span class="text-gray-600">Dispensed: </span>
                    <strong class="text-green-600">
                      {{ (parseFloat(closingReadings[reading.pumpId]) - reading.startReading).toFixed(2) }} L
                    </strong>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="closeForm.endDate"
              type="date"
              label="End Date"
              required
            />

            <Input
              v-model="closeForm.endTime"
              type="time"
              label="End Time"
              required
            />

            <Input
              v-model="closeForm.closingCash"
              type="number"
              label="Closing Cash Amount ($)"
              placeholder="0.00"
              step="0.01"
              required
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Shift Notes</label>
            <textarea
              v-model="closeForm.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any notes or incidents during the shift..."
            ></textarea>
          </div>
          
          <!-- Cash reconciliation summary -->
          <div class="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3">
            <h4 class="font-semibold text-gray-900">Cash Reconciliation</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Opening Cash:</span>
                <span class="font-medium">${{ shiftsStore.activeShift.openingCash.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Expected Sales:</span>
                <span class="font-medium">${{ calculateExpectedSales().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm font-medium border-t border-gray-300 pt-2">
                <span class="text-gray-700">Expected Cash:</span>
                <span>${{ expectedCash.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Actual Cash:</span>
                <span class="font-medium">${{ parseFloat(closeForm.closingCash || '0').toFixed(2) }}</span>
              </div>
              <div class="flex justify-between font-semibold text-base border-t border-gray-300 pt-2" :class="variance >= 0 ? 'text-green-600' : 'text-red-600'">
                <span>Variance:</span>
                <span>${{ variance.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <Button type="submit" variant="danger" size="lg" :full-width="true">
            <X class="w-5 h-5" />
            Close Shift
          </Button>
        </form>
      </Card>
    </div>

    <!-- Recent Shifts History -->
    <Card title="Recent Shifts">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="shift in completedShifts" :key="shift.id">
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ shift.employeeName }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ shift.shiftType }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(shift.startDate) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ calculateShiftDuration(shift) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                ${{ ((shift.expectedCash || 0) - shift.openingCash).toFixed(2) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm" :class="(shift.variance || 0) >= 0 ? 'text-green-600' : 'text-red-600'">
                ${{ (shift.variance || 0).toFixed(2) }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm">
                <Badge :variant="shift.status === 'Completed' ? 'success' : 'warning'">
                  {{ shift.status }}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShiftsStore } from '@/stores/shifts'
import { useEmployeesStore } from '@/stores/employees'
import { usePumpsStore } from '@/stores/pumps'
import { useToastStore } from '@/stores/toast'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import { Clock, X, AlertCircle, Calendar } from 'lucide-vue-next'

const router = useRouter()
const shiftsStore = useShiftsStore()
const employeesStore = useEmployeesStore()
const pumpsStore = usePumpsStore()
const toastStore = useToastStore()

const shiftForm = ref({
  employeeId: '',
  shiftType: '',
  startDate: new Date().toISOString().split('T')[0],
  startTime: new Date().toTimeString().slice(0, 5),
  openingCash: '',
})

const closeForm = ref({
  endDate: new Date().toISOString().split('T')[0],
  endTime: new Date().toTimeString().slice(0, 5),
  closingCash: '',
  notes: '',
})

const pumpReadings = ref<Record<string, string>>({})
const closingReadings = ref<Record<string, string>>({})

const activeEmployeeOptions = computed(() => {
  return employeesStore.getActiveEmployees().map(emp => ({
    label: `${emp.name} (${emp.employeeId}) - ${emp.role}`,
    value: emp.id
  }))
})

const shiftTypeOptions = [
  { label: 'Morning (6AM - 2PM)', value: 'Morning' },
  { label: 'Afternoon (2PM - 10PM)', value: 'Afternoon' },
  { label: 'Night (10PM - 6AM)', value: 'Night' }
]

const completedShifts = computed(() => {
  return shiftsStore.shifts.filter(s => s.status === 'Completed').slice(0, 10)
})

const expectedCash = computed(() => {
  if (!shiftsStore.activeShift) return 0
  return shiftsStore.activeShift.openingCash + calculateExpectedSales()
})

const variance = computed(() => {
  if (!closeForm.value.closingCash) return 0
  return parseFloat(closeForm.value.closingCash) - expectedCash.value
})

function calculateExpectedSales(): number {
  if (!shiftsStore.activeShift) return 0
  return shiftsStore.activeShift.pumpReadings.reduce((total, reading) => {
    const closingReading = parseFloat(closingReadings.value[reading.pumpId] || '0')
    const litresDispensed = closingReading - reading.startReading
    return total + (litresDispensed * 1.50) // Assuming avg price of $1.50 per litre
  }, 0)
}

function startShift() {
  const employee = employeesStore.getEmployeeById(shiftForm.value.employeeId)
  if (!employee) {
    toastStore.error('Please select a valid employee')
    return
  }

  const readings = pumpsStore.pumps
    .filter(pump => pump.status !== 'Maintenance' && pump.status !== 'Fault')
    .map(pump => ({
      pumpId: pump.id,
      pumpNumber: pump.number,
      fuelType: pump.fuelType,
      startReading: parseFloat(pumpReadings.value[pump.id] || '0'),
    }))

  shiftsStore.startShift({
    employeeId: employee.id,
    employeeName: employee.name,
    employeeRole: employee.role,
    shiftType: shiftForm.value.shiftType as any,
    startDate: shiftForm.value.startDate,
    startTime: shiftForm.value.startTime,
    openingCash: parseFloat(shiftForm.value.openingCash),
    pumpReadings: readings,
  })

  toastStore.success('Shift started successfully!')
  resetShiftForm()
}

function endShift() {
  if (!shiftsStore.activeShift) return

  const readings = shiftsStore.activeShift.pumpReadings.map(reading => ({
    ...reading,
    endReading: parseFloat(closingReadings.value[reading.pumpId] || '0'),
    totalLitres: parseFloat(closingReadings.value[reading.pumpId] || '0') - reading.startReading,
  }))

  shiftsStore.endShift(shiftsStore.activeShift.id, {
    closingCash: parseFloat(closeForm.value.closingCash),
    endDate: closeForm.value.endDate,
    endTime: closeForm.value.endTime,
    pumpReadings: readings,
    notes: closeForm.value.notes,
  })

  toastStore.success('Shift closed successfully!')
  resetCloseForm()
}

function resetShiftForm() {
  shiftForm.value = {
    employeeId: '',
    shiftType: '',
    startDate: new Date().toISOString().split('T')[0],
    startTime: new Date().toTimeString().slice(0, 5),
    openingCash: '',
  }
  pumpReadings.value = {}
}

function resetCloseForm() {
  closeForm.value = {
    endDate: new Date().toISOString().split('T')[0],
    endTime: new Date().toTimeString().slice(0, 5),
    closingCash: '',
    notes: '',
  }
  closingReadings.value = {}
}

function calculateDuration(): string {
  if (!shiftsStore.activeShift) return '0h 0m'
  
  const start = new Date(`${shiftsStore.activeShift.startDate}T${shiftsStore.activeShift.startTime}`)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

function calculateShiftDuration(shift: any): string {
  if (!shift.endDate || !shift.endTime) return '-'
  
  const start = new Date(`${shift.startDate}T${shift.startTime}`)
  const end = new Date(`${shift.endDate}T${shift.endTime}`)
  const diff = end.getTime() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}h ${minutes}m`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}`).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getPumpStatusVariant(status: string) {
  const variants: Record<string, any> = {
    Idle: 'success',
    Dispensing: 'primary',
    Fault: 'danger',
    Maintenance: 'warning',
  }
  return variants[status] || 'default'
}
</script>
