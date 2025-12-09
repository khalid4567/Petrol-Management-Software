import { defineStore } from "pinia"
import { ref } from "vue"

export interface FuelTank {
  id: string
  name: string
  fuelType: string
  capacity: number
  currentLevel: number
  unit: string
}

export interface Product {
  id: string
  name: string
  category: string // category id
  stock: number
  price: number
  reorderLevel: number
}

export interface Category {
  id: string
  name: string
}

export const useInventoryStore = defineStore("inventory", () => {
  const fuelTanks = ref<FuelTank[]>([
    {
      id: "1",
      name: "Tank 1",
      fuelType: "Petrol 95",
      capacity: 50000,
      currentLevel: 35000,
      unit: "L",
    },
    {
      id: "2",
      name: "Tank 2",
      fuelType: "Diesel",
      capacity: 50000,
      currentLevel: 12000,
      unit: "L",
    },
    {
      id: "3",
      name: "Tank 3",
      fuelType: "Petrol 98",
      capacity: 30000,
      currentLevel: 22000,
      unit: "L",
    },
    {
      id: "4",
      name: "Tank 4",
      fuelType: "Diesel Premium",
      capacity: 30000,
      currentLevel: 18000,
      unit: "L",
    },
  ])

  const categories = ref<Category[]>([
    { id: 'c1', name: 'Oil' },
    { id: 'c2', name: 'Fluids' },
    { id: 'c3', name: 'Accessories' },
    { id: 'c4', name: 'Electronics' },
    { id: 'c5', name: 'Food' },
    { id: 'c6', name: 'Beverages' },
  ])

  const products = ref<Product[]>([
    { id: "1", name: "Engine Oil 5W-30", category: "c1", stock: 45, price: 15.99, reorderLevel: 20 },
    { id: "2", name: "Engine Oil 10W-40", category: "c1", stock: 32, price: 14.99, reorderLevel: 20 },
    { id: "3", name: "Windscreen Wash", category: "c2", stock: 68, price: 5.99, reorderLevel: 30 },
    { id: "4", name: "Coolant", category: "c2", stock: 15, price: 12.99, reorderLevel: 25 },
    { id: "5", name: "Air Freshener", category: "c3", stock: 120, price: 3.99, reorderLevel: 50 },
    { id: "6", name: "Phone Charger", category: "c4", stock: 8, price: 19.99, reorderLevel: 15 },
    { id: "7", name: "Snacks - Chips", category: "c5", stock: 150, price: 2.49, reorderLevel: 100 },
    { id: "8", name: "Drinks - Water", category: "c6", stock: 200, price: 1.99, reorderLevel: 150 },
  ])

  function addProduct(newProduct: Omit<Product, "id">) {
    const id = String(Date.now())
    products.value.unshift({ id, ...newProduct })
    return id
  }

  function updateProduct(id: string, updated: Partial<Omit<Product, "id">>) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value[idx] = { ...products.value[idx], ...updated }
    }
  }

  function deleteProduct(id: string) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value.splice(idx, 1)
  }

  function getProductById(id: string) {
    return products.value.find(p => p.id === id)
  }

  // Categories CRUD
  function addCategory(name: string) {
    const id = `c${Date.now()}`
    categories.value.unshift({ id, name })
    return id
  }

  function updateCategory(id: string, name: string) {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) categories.value[idx].name = name
  }

  function deleteCategory(id: string) {
    const idx = categories.value.findIndex(c => c.id === id)
    if (idx !== -1) categories.value.splice(idx, 1)
    // also remove reference from products (set to empty string)
    products.value.forEach(p => {
      if (p.category === id) p.category = ''
    })
  }

  function getCategoryById(id: string) {
    return categories.value.find(c => c.id === id)
  }

  function adjustStock(id: string, delta: number) {
    const p = products.value.find(x => x.id === id)
    if (!p) return
    p.stock = Math.max(0, p.stock + delta)
  }

  return {
    fuelTanks,
    categories,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    adjustStock,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
  }
})
