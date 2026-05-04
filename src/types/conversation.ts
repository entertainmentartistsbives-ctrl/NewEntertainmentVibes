export type ServiceIntent = 'marketing' | 'sales' | 'dev' | 'unknown'

export interface ConversationState {
  sessionId: string
  company: string
  industry: string
  teamSize: string
  serviceIntent: ServiceIntent
  intentConfidence: number      // 0–100
  diagnosisStage: number        // 0–5
  confirmedPain: string
  toneModifier: string
  currentPhase: number          // 1–6
  solution: string
  leadName: string
  leadEmail: string
  returningUser: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AIResponse {
  message: string
  stateUpdate: Partial<ConversationState>
}

export interface LeadPayload {
  name: string
  email: string
  company: string
  problem: string
  service: string
  sessionId: string
  transcript: ChatMessage[]
  state: ConversationState
}
