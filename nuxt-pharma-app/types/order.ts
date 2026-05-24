export interface OrderItem {
  name: string
  price?: string
}

export interface Order {
  orderNumber: string
  date: string
  items: OrderItem[]
  total: string
  status: 'paid' | 'pending' | 'processing'
  statusText: string
}
