/**
 * Type definitions for PharmaAI Application
 */

export interface KPICard {
  id: string
  label: string
  value: string | number
  unit?: string
  icon: string
  trend?: {
    percentage: number
    direction: 'up' | 'down'
  }
  status?: string
  statusIcon?: string
}

export interface BarChartData {
  name: string
  value: number
  color: string
  hoverColor: string
}

export interface NavItem {
  label: string
  icon: string
  href: string
  isActive?: boolean
}

export interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  content: string
  timestamp: string
  avatar?: string
}

export interface Order {
  id: string
  productName: string
  quantity: number
  price: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  date: string
  customer?: string
}

export interface Medicine {
  id: string
  name: string
  stock: number
  minStock: number
  price: number
  category: string
  expiryDate?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  version?: string
}

export interface DashboardData {
  kpis: KPICard[]
  topMedicines: BarChartData[]
  user: UserProfile
  navigationItems: NavItem[]
}
