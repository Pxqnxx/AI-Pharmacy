export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp?: string
}

export interface Medicine {
  id: string
  name: string
  description: string
  price: string
  imageUrl: string
  status: 'in-stock' | 'out-of-stock'
  statusText: string
}
