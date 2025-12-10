import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta as any).env.VITE_NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = (import.meta as any).env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not found. Database features may not work.')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          customer_id: string
          name: string
          contact_number: string
          email: string | null
          address: string | null
          vehicle_number: string | null
          loyalty_points: number
          total_purchases: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at' | 'loyalty_points' | 'total_purchases'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      sales: {
        Row: {
          id: string
          sale_number: string
          customer_id: string | null
          customer_name: string
          vehicle_number: string
          sale_date: string
          items: any[]
          subtotal: number
          tax: number
          discount: number
          final_total: number
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sales']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sales']['Insert']>
      }
    }
  }
}
