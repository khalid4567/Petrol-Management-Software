import { defineStore } from "pinia"
import { ref } from "vue"

export interface Customer {
  id: string
  name: string
  customerId: string
  contactNumber: string
  email?: string
  address?: string
  vehicleNumber?: string
  loyaltyPoints?: number
  createdAt: string
}

export const useCustomersStore = defineStore("customers", () => {
  const customers = ref<Customer[]>([
    {
      id: "1",
      name: "Subhash Bhamare",
      customerId: "VU2GT.JK",
      contactNumber: "+91 9876543210",
      email: "subhash@example.com",
      address: "Mumbai, India",
      vehicleNumber: "MH18 BH2116",
      loyaltyPoints: 120,
      createdAt: "2024-01-01T10:00:00",
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      customerId: "AB3CD.EF",
      contactNumber: "+91 9876543211",
      email: "rajesh@example.com",
      address: "Pune, India",
      vehicleNumber: "MH12 AB1234",
      loyaltyPoints: 80,
      createdAt: "2024-01-02T11:30:00",
    },
    {
      id: "3",
      name: "Priya Patel",
      customerId: "GH4IJ.KL",
      contactNumber: "+91 9876543212",
      createdAt: "2024-01-03T09:15:00",
    },
    {
      id: "4",
      name: "Amit Singh",
      customerId: "MN5OP.QR",
      contactNumber: "+91 9876543213",
      createdAt: "2024-01-04T14:20:00",
    },
    {
      id: "5",
      name: "Sneha Desai",
      customerId: "ST6UV.WX",
      contactNumber: "+91 9876543214",
      createdAt: "2024-01-05T16:45:00",
    },
  ])

  function addCustomer(customer: Omit<Customer, "id" | "createdAt">) {
    const newCustomer: Customer = {
      ...customer,
      id: String(customers.value.length + 1),
      createdAt: new Date().toISOString(),
    }
    customers.value.unshift(newCustomer)
    return newCustomer
  }

  function updateCustomer(id: string, updatedCustomer: Omit<Customer, "id" | "createdAt">) {
    const index = customers.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      customers.value[index] = {
        ...customers.value[index],
        ...updatedCustomer,
      }
      return customers.value[index]
    }
    return null
  }

  function deleteCustomer(id: string) {
    const index = customers.value.findIndex((c) => c.id === id)
    if (index !== -1) {
      customers.value.splice(index, 1)
      return true
    }
    return false
  }

  function getCustomerById(id: string) {
    return customers.value.find((c) => c.id === id)
  }

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
  }
})
