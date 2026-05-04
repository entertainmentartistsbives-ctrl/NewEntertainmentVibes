'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FaPaperPlane, FaTimes, FaUndo } from 'react-icons/fa'
import { useChat } from '@/lib/usechat'
import styles from './ChatWindow.module.css'

interface ChatWindowProps {
  onClose: () => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onClose }) => {
  const { messages, isBusy, sendMessage, resetChat } = useChat()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isBusy) return

    const text = input
    setInput('')
    await sendMessage(text)
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h3>AI Business Consultant</h3>
          <div className={styles.status}>Online & Ready</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={resetChat} className={styles.closeBtn} title="Reset Chat">
            <FaUndo size={12} />
          </button>
          <button onClick={onClose} className={styles.closeBtn} title="Close">
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      <div className={styles.messages}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.role === 'user' ? styles.userMessage : styles.assistantMessage
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isBusy && (
          <div className={styles.typing}>
            Consultant is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your business problem..."
          disabled={isBusy}
        />
        <button type="submit" className={styles.sendBtn} disabled={isBusy || !input.trim()}>
          <FaPaperPlane size={16} />
        </button>
      </form>
    </div>
  )
}

export default ChatWindow
