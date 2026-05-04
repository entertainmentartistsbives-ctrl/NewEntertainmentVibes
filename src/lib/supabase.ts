import { createClient } from '@supabase/supabase-js'
import { ChatMessage, ConversationState } from '@/types/conversation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function upsertSession({
  session_id,
  state,
  messages,
}: {
  session_id: string
  state: ConversationState
  messages: ChatMessage[]
}) {
  try {
    const { error } = await supabase
      .from('chat_sessions')
      .upsert({
        id: session_id,
        state: state,
        messages: messages,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (error) {
      console.error('Supabase Upsert Error:', error)
      return { error }
    }
    return { success: true }
  } catch (err) {
    console.error('Supabase Client Error:', err)
    return { error: err }
  }
}
