import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useToastStore } from './toast'
import { useCustomersSupabaseStore } from './customersSupabase'

export interface SaleItem {
  id: string
  pump_number: string
  fuel_type: string
  quantity: number
  price: number
  total: number
}

export interface Sale {
  id: string
  sale_number: string
  customer_id: string | null
  customer_name: string
  vehicle_number: string
  sale_date: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  final_total: number
  payment_method: string
  created_at: string
  updated_at: string
}

export const useSalesSupabaseStore = defineStore('salesSupabase', () => {
  const sales = ref<Sale[]>([])
  const loading = ref(false)
  const toastStore = useToastStore()
  const customersStore = useCustomersSupabaseStore()

  async function fetchSales() {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      sales.value = data || []
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to fetch sales')
      console.error('Error fetching sales:', error)
    } finally {
      loading.value = false
    }
  }

  async function addSale(sale: Omit<Sale, 'id' | 'sale_number' | 'created_at' | 'updated_at'>) {
    loading.value = true
    try {
      const saleNumber = await generateSaleNumber()

      const { data, error } = await supabase
        .from('sales')
        .insert({
          sale_number: saleNumber,
          customer_id: sale.customer_id,
          customer_name: sale.customer_name,
          vehicle_number: sale.vehicle_number,
          sale_date: sale.sale_date,
          items: sale.items,
          subtotal: sale.subtotal,
          tax: sale.tax,
          discount: sale.discount,
          final_total: sale.final_total,
          payment_method: sale.payment_method
        })
        .select()
        .single()

      if (error) throw error

      if (sale.customer_id) {
        const customer = customersStore.getCustomerById(sale.customer_id)
        if (customer) {
          await customersStore.updateCustomer(sale.customer_id, {
            total_purchases: customer.total_purchases + sale.final_total,
            loyalty_points: customer.loyalty_points + Math.floor(sale.final_total)
          })
        }
      }

      sales.value.unshift(data)
      toastStore.success('Sale added successfully')
      return data
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to add sale')
      console.error('Error adding sale:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateSale(id: string, updates: Partial<Sale>) {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('sales')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = sales.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sales.value[index] = data
      }

      toastStore.success('Sale updated successfully')
      return data
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to update sale')
      console.error('Error updating sale:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  async function deleteSale(id: string) {
    loading.value = true
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)

      if (error) throw error

      sales.value = sales.value.filter(s => s.id !== id)
      toastStore.success('Sale deleted successfully')
      return true
    } catch (error: any) {
      toastStore.error(error.message || 'Failed to delete sale')
      console.error('Error deleting sale:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function getSalesByCustomerId(customerId: string) {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      console.error('Error fetching customer sales:', error)
      return []
    }
  }

  async function generateSaleNumber(): Promise<string> {
    const { count } = await supabase
      .from('sales')
      .select('*', { count: 'exact', head: true })

    const nextNumber = (count || 0) + 1
    return `S${String(nextNumber).padStart(5, '0')}`
  }

  function getSaleById(id: string) {
    return sales.value.find(s => s.id === id)
  }

  return {
    sales,
    loading,
    fetchSales,
    addSale,
    updateSale,
    deleteSale,
    getSalesByCustomerId,
    getSaleById,
    generateSaleNumber
  }
})
