'use client'

// Quanby Legal Platform – Contract Chat Component
// Interactive AI chat interface for contract analysis

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ContractChatProps {
  contractId: string
  contractTitle?: string
  initialMessages?: ChatMessage[]
  onSendMessage?: (message: string) => Promise<string>
  className?: string
}

const SUGGESTED_QUESTIONS = [
  'What are the main risks?',
  'Is this SC compliant?',
  'Summarize key obligations',
  'Compare to standard template',
  'What clauses need revision?',
  'Explain the termination clause',
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 max-w-[80%]">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-950 text-white text-xs font-bold">
        AI
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-gray-100 border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
        </div>
      </div>
    </div>
  )
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit', hour12: true })
}

// Mock AI response generator
function generateMockResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('risk') || lower.includes('main')) {
    return `Based on my analysis of this contract, I've identified **3 primary risk areas**:\n\n1. **Data Privacy (RA 10173)** — The contract lacks explicit data processing provisions required under the Data Privacy Act. This is a HIGH severity issue that could expose both parties to NPC sanctions.\n\n2. **Dispute Resolution** — No arbitration or mediation clause is present. Under Philippine ADR Act (RA 9285), including an ADR clause is strongly recommended to avoid costly litigation.\n\n3. **Force Majeure** — The force majeure clause is overly narrow and may not cover government-declared emergencies or pandemics as experienced under COVID-19 issuances.\n\nI recommend addressing the Data Privacy clause first as it carries regulatory penalties.`
  }
  if (lower.includes('sc') || lower.includes('compliant') || lower.includes('supreme court')) {
    return `Regarding **Supreme Court compliance**, this contract currently has **Needs Review** status.\n\nKey SC compliance concerns:\n- **Electronic signatures**: Must comply with SC A.M. No. 21-07-01-SC (Rules on Electronic Evidence)\n- **Notarization**: If requiring notarization, must follow SC-mandated procedures under 2004 Rules on Notarial Practice\n- **Forum selection**: The designated RTC jurisdiction aligns with SC administrative orders on commercial courts\n\nOverall assessment: The contract is **substantially compliant** but requires minor adjustments to the signature and notarization provisions to achieve full SC compliance.`
  }
  if (lower.includes('obligation') || lower.includes('summarize')) {
    return `**Key Obligations Summary:**\n\n**Party A (Service Provider):**\n• Deliver contracted services within agreed timelines\n• Maintain confidentiality of disclosed information\n• Provide monthly progress reports\n• Comply with all applicable Philippine laws\n\n**Party B (Client):**\n• Pay contract consideration as scheduled\n• Provide necessary access and cooperation\n• Review and approve deliverables within 5 business days\n• Notify counterparty of material changes\n\n**Mutual Obligations:**\n• Comply with RA 10173 Data Privacy Act\n• Maintain records for BIR audit purposes\n• Observe good faith and fair dealing per Civil Code Art. 19`
  }
  if (lower.includes('template') || lower.includes('compare') || lower.includes('standard')) {
    return `**Comparison with Standard Philippine Template:**\n\n✅ **Present in this contract:**\n- Consideration clause\n- Governing law (Philippine Law)\n- Basic termination provisions\n\n❌ **Missing vs. standard template:**\n- Data Processing Agreement (DPA-compliant)\n- Comprehensive force majeure clause\n- Intellectual property ownership clause\n- Anti-graft and corruption clause (recommended for government-adjacent contracts)\n- Comprehensive dispute resolution (ADR) clause\n- Warranty and representation provisions\n\nI recommend using the Quanby standard Service Agreement template as a baseline, which includes all Philippine law-compliant provisions.`
  }
  if (lower.includes('terminat')) {
    return `**Termination Clause Analysis:**\n\nThe current termination clause provides for termination:\n- By either party with **30 days written notice**\n- Immediately for material breach (with 15-day cure period)\n\n**Concerns:**\n1. The cure period of 15 days may be insufficient for complex performance failures — consider extending to 30 days\n2. No provision for termination consequences (data return, confidential material destruction)\n3. Missing: obligations surviving termination (confidentiality, IP rights, indemnification)\n\n**Recommendation:** Add a "Survival" clause explicitly listing obligations that continue post-termination, and include a data return/destruction protocol to comply with RA 10173 Section 21.`
  }
  return `Thank you for your question about this contract. Based on my analysis of the **${message.length > 50 ? message.substring(0, 50) + '...' : message}** aspect, I can provide the following observations:\n\nThis contract is governed by Philippine law under the Civil Code (RA 386) and appears to be a standard commercial agreement. The specific section you're asking about should be reviewed in light of:\n- Civil Code Art. 1305-1422 (Contracts)\n- Any applicable special laws (RA 10173, RA 8792)\n- Supreme Court circulars and administrative orders\n\nWould you like me to elaborate on any specific provision or generate a suggested revised clause?`
}

export function ContractChat({ contractId, contractTitle, initialMessages = [], onSendMessage, className }: ContractChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages.length > 0 ? initialMessages : [
    {
      id: '0',
      role: 'assistant',
      content: `Hello! I'm the **Contract Agent**, your AI-powered legal assistant for this contract${contractTitle ? ` — *${contractTitle}*` : ''}.\n\nI've completed a full analysis and I'm ready to answer your questions. I can explain specific clauses, assess compliance with Philippine law, identify risks, and suggest improvements.\n\nWhat would you like to know?`,
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      let response: string
      if (onSendMessage) {
        response = await onSendMessage(trimmed)
      } else {
        // Mock: simulate 1.5s delay
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000))
        response = generateMockResponse(trimmed)
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } finally {
      setIsTyping(false)
    }
  }, [isTyping, onSendMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // Simple markdown-like renderer
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Bold
        const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
        if (line.startsWith('•') || line.startsWith('-')) {
          return <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: formatted.slice(1).trim() }} />
        }
        if (line.match(/^\d+\./)) {
          return <li key={i} className="ml-4 list-decimal" dangerouslySetInnerHTML={{ __html: formatted }} />
        }
        if (!line.trim()) return <br key={i} />
        return <p key={i} dangerouslySetInnerHTML={{ __html: formatted }} />
      })
  }

  return (
    <div className={cn('flex flex-col h-full min-h-[500px] max-h-[700px]', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 bg-white rounded-t-xl">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-950 text-white text-sm font-bold flex-shrink-0">
          AI
        </div>
        <div>
          <p className="text-sm font-semibold text-navy-950">Contract Agent</p>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Active — Philippine Law Aware
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={cn(
              'flex items-end gap-3',
              msg.role === 'user' ? 'flex-row-reverse max-w-[80%] ml-auto' : 'max-w-[85%]'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-navy-950 text-white text-xs font-bold">
                AI
              </div>
            )}
            <div className={cn(
              'rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'rounded-br-sm bg-blue-600 text-white'
                : 'rounded-bl-sm bg-white border border-gray-200 text-gray-800'
            )}>
              <ul className="space-y-0.5">
                {renderContent(msg.content)}
              </ul>
              <p className={cn('text-[10px] mt-1.5', msg.role === 'user' ? 'text-blue-200 text-right' : 'text-gray-400')}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      <div className="border-t border-gray-200 bg-white px-4 pt-3 pb-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {SUGGESTED_QUESTIONS.slice(0, 4).map(q => (
            <button
              key={q}
              type="button"
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white rounded-b-xl px-4 py-3">
        <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about clauses, risks, compliance..."
            rows={1}
            disabled={isTyping}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            type="button"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  )
}
