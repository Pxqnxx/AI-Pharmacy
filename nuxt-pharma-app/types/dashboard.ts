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

export interface SalesData {
  name: string
  value: number
  color: string
  hoverColor: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  version: string
}

export interface NavItem {
  label: string
  icon: string
  href: string
  isActive: boolean
}

export interface DashboardData {
  user: UserProfile
  navigationItems: NavItem[]
  kpis: KPICard[]
  topMedicines: SalesData[]
}
