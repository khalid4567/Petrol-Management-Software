import { defineStore } from "pinia"
import { ref } from "vue"

export interface FuelSale {
  id: string
  pumpNumber: string
  fuelType: string
  litres: number
  pricePerLitre: number
  totalAmount: number
  timestamp: string
}

export interface RetailSale {
  id: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  timestamp: string
}

export interface Sale {
  id: string
  customerName: string
  customerId?: string
  vehicleNumber: string
  date: string
  items: SaleItem[]
  finalTotal: number
  timestamp: string
}

export interface SaleItem {
  id: string
  pumpNumber: string
  fuelType: string
  quantity: number
  price: number
  total: number
}

export const useSalesStore = defineStore("sales", () => {
  const fuelPrices = ref({
    "Petrol 95": 1.45,
    "Petrol 98": 1.65,
    Diesel: 1.35,
    "Diesel Premium": 1.55,
  })

  const fuelSales = ref<FuelSale[]>([])
  const retailSales = ref<RetailSale[]>([])

  const sales = ref<Sale[]>([
    {
      id: "S001",
      customerName: "Subhash Shamore",
      vehicleNumber: "MH18 BH2116",
      date: "2024-01-08",
      items: [
        {
          id: "1",
          pumpNumber: "P001",
          fuelType: "Petrol 95",
          quantity: 40,
          price: 1.45,
          total: 58.0,
        },
        {
          id: "2",
          pumpNumber: "P002",
          fuelType: "Diesel",
          quantity: 50,
          price: 1.35,
          total: 67.5,
        },
      ],
      finalTotal: 125.5,
      timestamp: "2024-01-08T10:30:00",
    },
    {
      id: "S002",
      customerName: "Rajesh Kumar",
      vehicleNumber: "MH12 AB1234",
      date: "2024-01-08",
      items: [
        {
          id: "1",
          pumpNumber: "P003",
          fuelType: "Petrol 98",
          quantity: 35,
          price: 1.65,
          total: 57.75,
        },
      ],
      finalTotal: 57.75,
      timestamp: "2024-01-08T11:15:00",
    },
    {
      id: "S003",
      customerName: "Priya Patel",
      vehicleNumber: "MH14 CD5678",
      date: "2024-01-07",
      items: [
        {
          id: "1",
          pumpNumber: "P001",
          fuelType: "Diesel",
          quantity: 60,
          price: 1.35,
          total: 81.0,
        },
      ],
      finalTotal: 81.0,
      timestamp: "2024-01-07T14:20:00",
    },
  ])

  const customers = ref([
    { id: "C001", name: "Subhash Shamore" },
    { id: "C002", name: "Rajesh Kumar" },
    { id: "C003", name: "Priya Patel" },
    { id: "C004", name: "Amit Singh" },
    { id: "C005", name: "Sneha Desai" },
  ])

  function addFuelSale(sale: Omit<FuelSale, "id" | "timestamp">) {
    fuelSales.value.push({
      ...sale,
      id: `FS${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  }

  function addRetailSale(sale: Omit<RetailSale, "id" | "timestamp">) {
    retailSales.value.push({
      ...sale,
      id: `RS${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  }

  function addSale(sale: Omit<Sale, "id" | "timestamp">) {
    const newSale: Sale = {
      ...sale,
      id: `S${String(sales.value.length + 1).padStart(3, "0")}`,
      timestamp: new Date().toISOString(),
    }
    sales.value.unshift(newSale)
    return newSale
  }

  function updateSale(id: string, updatedSale: Omit<Sale, "id" | "timestamp">) {
    const index = sales.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      sales.value[index] = {
        ...sales.value[index],
        ...updatedSale,
      }
    }
  }

  function deleteSale(id: string) {
    const index = sales.value.findIndex((s) => s.id === id)
    if (index !== -1) {
      sales.value.splice(index, 1)
    }
  }

  function getSaleById(id: string) {
    return sales.value.find((s) => s.id === id)
  }

  function getSalesByCustomerId(customerId: string) {
    return sales.value.filter(s => s.customerId === customerId)
  }

  function getSalesByCustomerName(name: string) {
    return sales.value.filter(s => s.customerName && s.customerName.toLowerCase() === name.toLowerCase())
  }

  return {
    fuelPrices,
    fuelSales,
    retailSales,
    sales,
    customers,
    addFuelSale,
    addRetailSale,
    addSale,
    updateSale,
    deleteSale,
    getSaleById,
    getSalesByCustomerId,
    getSalesByCustomerName,
  }
})
