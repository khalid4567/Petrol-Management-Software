import { defineStore } from "pinia"
import { ref } from "vue"

export interface PumpReading {
  pumpId: string
  pumpNumber: string
  fuelType: string
  startReading: number
  endReading?: number
  totalLitres?: number
}

export interface Shift {
  id: string
  employeeId: string
  employeeName: string
  employeeRole: string
  shiftType: "Morning" | "Afternoon" | "Night"
  startDate: string
  startTime: string
  endDate?: string
  endTime?: string
  openingCash: number
  closingCash?: number
  expectedCash?: number
  variance?: number
  pumpReadings: PumpReading[]
  notes?: string
  status: "Scheduled" | "Active" | "Completed" | "Cancelled"
  createdAt: string
}

export interface Holiday {
  id: string
  employeeId: string
  employeeName: string
  startDate: string
  endDate: string
  reason: string
  type: "Annual Leave" | "Sick Leave" | "Emergency Leave" | "Unpaid Leave"
  approvedBy?: string
  createdAt: string
}

export interface ShiftSchedule {
  id: string
  employeeId: string
  employeeName: string
  shiftType: "Morning" | "Afternoon" | "Night"
  date: string
  isRecurring: boolean
  recurringPattern?: "Daily" | "Weekly" | "Monthly"
  recurringEndDate?: string
  createdAt: string
}

export const useShiftsStore = defineStore("shifts", () => {
  const shifts = ref<Shift[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      employeeRole: "Manager",
      shiftType: "Morning",
      startDate: "2024-12-02",
      startTime: "06:00",
      endDate: "2024-12-02",
      endTime: "14:00",
      openingCash: 5000,
      closingCash: 12450.5,
      expectedCash: 12350.5,
      variance: 100,
      pumpReadings: [
        {
          pumpId: "1",
          pumpNumber: "P001",
          fuelType: "Petrol 95",
          startReading: 10500,
          endReading: 11200,
          totalLitres: 700,
        },
        {
          pumpId: "2",
          pumpNumber: "P002",
          fuelType: "Diesel",
          startReading: 8500,
          endReading: 9100,
          totalLitres: 600,
        },
      ],
      notes: "Shift ran smoothly",
      status: "Completed",
      createdAt: "2024-12-02T06:00:00",
    },
  ])

  const holidays = ref<Holiday[]>([
    {
      id: "1",
      employeeId: "5",
      employeeName: "David Brown",
      startDate: "2024-12-05",
      endDate: "2024-12-10",
      reason: "Family vacation",
      type: "Annual Leave",
      approvedBy: "John Doe",
      createdAt: "2024-11-25T10:00:00",
    },
  ])

  const schedules = ref<ShiftSchedule[]>([
    {
      id: "1",
      employeeId: "1",
      employeeName: "John Doe",
      shiftType: "Morning",
      date: "2024-12-03",
      isRecurring: true,
      recurringPattern: "Weekly",
      recurringEndDate: "2024-12-31",
      createdAt: "2024-11-20T10:00:00",
    },
    {
      id: "2",
      employeeId: "2",
      employeeName: "Jane Smith",
      shiftType: "Afternoon",
      date: "2024-12-03",
      isRecurring: true,
      recurringPattern: "Weekly",
      recurringEndDate: "2024-12-31",
      createdAt: "2024-11-20T10:00:00",
    },
    {
      id: "3",
      employeeId: "4",
      employeeName: "Sarah Williams",
      shiftType: "Night",
      date: "2024-12-03",
      isRecurring: true,
      recurringPattern: "Weekly",
      recurringEndDate: "2024-12-31",
      createdAt: "2024-11-20T10:00:00",
    },
  ])

  const activeShift = ref<Shift | null>(null)

  function startShift(shift: Omit<Shift, "id" | "status" | "createdAt">) {
    const newShift: Shift = {
      ...shift,
      id: String(shifts.value.length + 1),
      status: "Active",
      createdAt: new Date().toISOString(),
    }
    shifts.value.unshift(newShift)
    activeShift.value = newShift
    return newShift
  }

  function endShift(
    shiftId: string,
    closingData: {
      closingCash: number
      endDate: string
      endTime: string
      pumpReadings: PumpReading[]
      notes?: string
    },
  ) {
    const shift = shifts.value.find((s) => s.id === shiftId)
    if (shift) {
      shift.closingCash = closingData.closingCash
      shift.endDate = closingData.endDate
      shift.endTime = closingData.endTime
      shift.pumpReadings = closingData.pumpReadings
      shift.notes = closingData.notes
      shift.expectedCash = shift.openingCash + calculateShiftSales(closingData.pumpReadings)
      shift.variance = closingData.closingCash - (shift.expectedCash || 0)
      shift.status = "Completed"
      activeShift.value = null
      return shift
    }
    return null
  }

  function calculateShiftSales(readings: PumpReading[]): number {
    // Simplified calculation - in real system, multiply by fuel prices
    return readings.reduce((total, reading) => {
      return total + (reading.totalLitres || 0) * 50 // Assuming avg price of 50 per litre
    }, 0)
  }

  function addSchedule(schedule: Omit<ShiftSchedule, "id" | "createdAt">) {
    const newSchedule: ShiftSchedule = {
      ...schedule,
      id: String(schedules.value.length + 1),
      createdAt: new Date().toISOString(),
    }
    schedules.value.unshift(newSchedule)
    return newSchedule
  }

  function updateSchedule(id: string, updatedSchedule: Partial<ShiftSchedule>) {
    const index = schedules.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      schedules.value[index] = {
        ...schedules.value[index],
        ...updatedSchedule,
      }
      return schedules.value[index]
    }
    return null
  }

  function deleteSchedule(id: string) {
    const index = schedules.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      schedules.value.splice(index, 1)
      return true
    }
    return false
  }

  function addHoliday(holiday: Omit<Holiday, "id" | "status" | "createdAt">) {
    const newHoliday: Holiday = {
      ...holiday,
      id: String(holidays.value.length + 1),
      status: "Approved",
      createdAt: new Date().toISOString(),
    }

    // Find and cancel all shifts that overlap with the holiday period
    const startDate = new Date(holiday.startDate)
    const endDate = new Date(holiday.endDate)

    schedules.value.forEach((schedule) => {
      if (schedule.employeeId === holiday.employeeId) {
        const scheduleDate = new Date(schedule.date)
        if (scheduleDate >= startDate && scheduleDate <= endDate) {
          // Cancel the shift by deleting it
          deleteSchedule(schedule.id)
        }
      }
    })

    holidays.value.unshift(newHoliday)
    return newHoliday
  }

  function updateHoliday(id: string, updatedHoliday: Partial<Holiday>) {
    const index = holidays.value.findIndex((h) => h.id === id)
    if (index !== -1) {
      const oldHoliday = holidays.value[index]
      const isDateChanged =
        (updatedHoliday.startDate && updatedHoliday.startDate !== oldHoliday.startDate) ||
        (updatedHoliday.endDate && updatedHoliday.endDate !== oldHoliday.endDate)

      if (isDateChanged) {
        const startDate = new Date(updatedHoliday.startDate || oldHoliday.startDate)
        const endDate = new Date(updatedHoliday.endDate || oldHoliday.endDate)

        schedules.value.forEach((schedule) => {
          if (schedule.employeeId === oldHoliday.employeeId) {
            const scheduleDate = new Date(schedule.date)
            if (scheduleDate >= startDate && scheduleDate <= endDate) {
              deleteSchedule(schedule.id)
            }
          }
        })
      }

      holidays.value[index] = {
        ...holidays.value[index],
        ...updatedHoliday,
      }
      return holidays.value[index]
    }
    return null
  }

  function deleteHoliday(id: string) {
    const index = holidays.value.findIndex((h) => h.id === id)
    if (index !== -1) {
      holidays.value.splice(index, 1)
      return true
    }
    return false
  }

  function getShiftsByEmployee(employeeId: string) {
    return shifts.value.filter((s) => s.employeeId === employeeId)
  }

  function getSchedulesByDate(date: string) {
    return schedules.value.filter((s) => s.date === date)
  }

  function getHolidaysByEmployee(employeeId: string) {
    return holidays.value.filter((h) => h.employeeId === employeeId)
  }

  function isEmployeeOnHoliday(employeeId: string, date: string): boolean {
    return holidays.value.some(
      (h) =>
        h.employeeId === employeeId && new Date(date) >= new Date(h.startDate) && new Date(date) <= new Date(h.endDate),
    )
  }

  return {
    shifts,
    holidays,
    schedules,
    activeShift,
    startShift,
    endShift,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    getShiftsByEmployee,
    getSchedulesByDate,
    getHolidaysByEmployee,
    isEmployeeOnHoliday,
  }
})
