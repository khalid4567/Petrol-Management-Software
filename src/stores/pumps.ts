import { defineStore } from "pinia"
import { ref } from "vue"

export interface Pump {
  id: string
  number: string
  status: "Idle" | "Dispensing" | "Fault" | "Maintenance"
  fuelType: string
  currentTransaction?: {
    litres: number
    amount: number
  }
  totalSalesToday: number
}

export const usePumpsStore = defineStore("pumps", () => {
  const pumps = ref<Pump[]>([
    {
      id: "1",
      number: "P001",
      status: "Idle",
      fuelType: "Petrol 95",
      totalSalesToday: 2450.5,
    },
    {
      id: "2",
      number: "P002",
      status: "Dispensing",
      fuelType: "Diesel",
      currentTransaction: {
        litres: 25.5,
        amount: 1275.0,
      },
      totalSalesToday: 3200.75,
    },
    {
      id: "3",
      number: "P003",
      status: "Idle",
      fuelType: "Petrol 98",
      totalSalesToday: 1890.25,
    },
    {
      id: "4",
      number: "P004",
      status: "Fault",
      fuelType: "Diesel",
      totalSalesToday: 1150.0,
    },
    {
      id: "5",
      number: "P005",
      status: "Idle",
      fuelType: "Petrol 95",
      totalSalesToday: 2680.4,
    },
    {
      id: "6",
      number: "P006",
      status: "Maintenance",
      fuelType: "Diesel",
      totalSalesToday: 0,
    },
  ])

  return { pumps }
})
