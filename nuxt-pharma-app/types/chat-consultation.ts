export interface ConsultationMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  timestamp?: string
}

export interface UserInfo {
  name: string
  avatarUrl: string
}
