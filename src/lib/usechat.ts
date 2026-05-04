'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ConversationState, ChatMessage as TChatMessage } from '@/types/conversation'

function makeInitialState(sessionId: string): ConversationState {
  return {
    sessionId,
    company: '', industry: '', teamSize: '',
    serviceIntent: 'unknown', intentConfidence: 0,
    diagnosisStage: 0, confirmedPain: '',
    toneModifier: '', returningUser: false,
    currentPhase: 1, solution: '',
    leadName: '', leadEmail: '',
  }
}

export function useChat() {
  const [state, setState] = useState<ConversationState>(() => makeInitialState(uuidv4()))
  const [messages, setMessages] = useState<TChatMessage[]>([])
  const [isBusy, setIsBusy] = useState(false)
  const initialized = useRef(false)

  // Merge state updates from API
  const mergeState = useCallback((current: ConversationState, update: Partial<ConversationState>): ConversationState => {
    const next = { ...current }
    Object.keys(update).forEach(k => {
      const key = k as keyof ConversationState
      const val = update[key]
      if (val !== undefined && val !== '') {
        ;(next as Record<string, unknown>)[key] = val
      }
    })
    return next
  }, [])

  // The core API call
  const sendMessage = useCallback(async (text: string, overrideMessages?: TChatMessage[], overrideState?: ConversationState) => {
    if (isBusy && !overrideMessages) return
    
    setIsBusy(true)
    const userMsg: TChatMessage = { role: 'user', content: text }
    const currentMsgs = overrideMessages || messages
    const currentState = overrideState || state
    
    const nextMessages = [...currentMsgs, userMsg]
    setMessages(nextMessages)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, state: currentState }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'API error')

      const aiMsg: TChatMessage = { role: 'assistant', content: data.message }
      setMessages(prev => [...prev, aiMsg])

      const nextState = mergeState(currentState, data.state || {})
      setState(nextState)
      
      return { message: aiMsg, state: nextState }
    } catch (e) {
      console.error('Chat Error:', e)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }])
    } finally {
      setIsBusy(false)
    }
  }, [isBusy, messages, state, mergeState])

  // Initialize with greeting
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const initState = makeInitialState(uuidv4())
    setState(initState)
    sendMessage('Hello, I need business help.', [], initState)
  }, [sendMessage])

  const resetChat = useCallback(() => {
    const newState = makeInitialState(uuidv4())
    setState(newState)
    setMessages([])
    initialized.current = false
    setTimeout(() => {
      initialized.current = true
      sendMessage('Hello, I need business help.', [], newState)
    }, 100)
  }, [sendMessage])

  return {
    messages,
    state,
    isBusy,
    sendMessage,
    resetChat,
  }
}
