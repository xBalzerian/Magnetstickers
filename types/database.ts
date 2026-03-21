export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          level: number
          image_url: string | null
          description: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      products: {
        Row: {
          id: string
          category_id: string
          name: string
          slug: string
          description: string | null
          printful_product_id: number | null
          printful_variant_id: number | null
          price_cents: number
          cost_cents: number
          images: string[]
          tags: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      designs: {
        Row: {
          id: string
          category_id: string
          product_id: string | null
          prompt_used: string
          image_url: string | null
          kie_task_id: string | null
          batch_id: string | null
          status: 'pending' | 'generating' | 'generated' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['designs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['designs']['Insert']>
      }
      batches: {
        Row: {
          id: string
          name: string
          category_id: string
          prompts: Json
          total: number
          generated: number
          failed: number
          status: 'pending' | 'running' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['batches']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['batches']['Insert']>
      }
      orders: {
        Row: {
          id: string
          paypal_order_id: string | null
          customer_email: string
          customer_name: string
          shipping_address: Json
          items: Json
          subtotal_cents: number
          shipping_cents: number
          total_cents: number
          currency: string
          status: 'pending' | 'paid' | 'fulfilling' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          printful_order_id: number | null
          tracking_number: string | null
          tracking_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          product_image: string | null
          quantity: number
          price_cents: number
          printful_variant_id: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
    }
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Design = Database['public']['Tables']['designs']['Row']
export type Batch = Database['public']['Tables']['batches']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
