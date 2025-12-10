import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToastStore } from './toast'

export interface Customer {
  id: string
  customer_id: string
  name: string
  contact_number: string
  email?: string | null
  address?: string | null
  vehicle_number?: string | null
  loyalty_points: number
  total_purchases: number
  created_at: string
  updated_at: string
}

export const useCustomersSupabaseStore = defineStore('customersSupabase', () => {
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const toastStore = useToastStore()

  async function fetchCustomers() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      customers.value = data || []
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to fetch customers')
      console.error('Error fetching customers:', error)
    } finally {
      loading.value = false
    }
  }

  async function addCustomer(customer: Omit<Customer, 'id' | 'created_at' | 'updated_at' | 'loyalty_points' | 'total_purchases'>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          ...customer,
          loyalty_points: 0,
          total_purchases: 0
        })
        .select()
        .single()

      if (error) throw error

      customers.value.unshift(data)
      toastStore.success('Customer added successfully')
      return data
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to add customer')
      console.error('Error adding customer:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCustomer(id: string, updates: Partial<Customer>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = data
      }

      toastStore.success('Customer updated successfully')
      return data
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to update customer')
      console.error('Error updating customer:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteCustomer(id: string) {
    loading.value = true
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id)

      if (error) throw error

      customers.value = customers.value.filter(c => c.id !== id)
      toastStore.success('Customer deleted successfully')
      return true
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to delete customer')
      console.error('Error deleting customer:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  function getCustomerById(id: string) {
    return customers.value.find(c => c.id === id)
  }

  async function generateCustomerId(): Promise<string> {
    const { count } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })

    const nextNumber = (count || 0) + 1
    return `CUS${String(nextNumber).padStart(4, '0')}`
  }

  return {
    customers,
    loading,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    generateCustomerId
  }
})
