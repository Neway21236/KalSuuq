'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  text: string
  sender: 'ai' | 'user'
  timestamp: Date
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Kalsuq's AI assistant. How can I help you discover our collection or answer questions about your order?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Production-ready API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages.slice(-5) })
      })
      
      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'ai',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        aria-label="Open AI Chat Support"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 right-4 md:bottom-10 md:right-10 z-40 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group",
          isOpen && "scale-0"
        )}
      >
        <MessageCircle size={28} className="text-white dark:text-ink" />
        <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20 group-hover:hidden" />
        
        {/* Tooltip */}
        <span className="hidden md:block absolute right-full mr-6 bg-accent text-white dark:text-ink text-[10px] font-bold py-3 px-6 uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl translate-x-2 group-hover:translate-x-0">
          Chat with Kalsuq AI
        </span>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 z-[100] w-full md:bottom-10 md:right-10 md:w-[420px] h-[100vh] md:h-[600px] bg-surface border border-border-primary flex flex-col shadow-2xl transition-colors duration-300 overflow-hidden rounded-none md:rounded-[2rem]"
          >
            {/* Header */}
            <div className="p-6 border-b border-border-primary flex items-center justify-between bg-surface">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white dark:text-ink shadow-md">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary tracking-tight">Kalsuq AI</h3>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <p className="text-[10px] text-accent uppercase font-bold tracking-[0.2em]">Always Online</p>
                  </div>
                </div>
              </div>
              <button aria-label="Close chat" onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-accent transition-colors p-2">
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-card/30 no-scrollbar"
            >
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] p-4 shadow-sm text-sm leading-relaxed",
                    msg.sender === 'user' 
                      ? "bg-accent text-white dark:text-ink rounded-none md:rounded-[1.5rem] rounded-tr-none" 
                      : "bg-surface border border-border-primary text-text-primary rounded-none md:rounded-[1.5rem] rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface border border-border-primary p-4 rounded-[1.5rem] rounded-tl-none flex space-x-1">
                    <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-6 border-t border-border-primary bg-surface shadow-inner"
            >
              <div className="flex space-x-3">
                <input 
                  type="text" 
                  value={input}
                  aria-label="Chat message input"
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-surface-card border border-border-primary text-text-primary text-sm px-5 py-4 focus:border-accent focus:outline-none placeholder:text-text-muted transition-all"
                />
                <button 
                  type="submit"
                  aria-label="Send message"
                  disabled={isLoading || !input.trim()}
                  className="bg-accent text-white dark:text-ink p-4 hover:bg-accent-hover transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-[9px] text-text-secondary mt-4 uppercase tracking-[0.3em] text-center font-bold opacity-60">
                Powered by Kalsuq AI · Instant Assistance
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
