export interface LowStockAlert {
  id: string
  name: string
  description: string
  icon: string
  stockLevel: number
  unit: string
  status: 'critical' | 'warning'
  statusText: string
  imageUrl?: string
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  sku: string
  stockLevel: number
  status: 'in-stock' | 'low-stock' | 'out-of-stock'
  statusText: string
  imageUrl?: string
}
