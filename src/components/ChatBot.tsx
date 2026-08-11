'use client'

import Image from 'next/image'
import { useState, useRef, useEffect, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, MessageCircle, X } from 'lucide-react'
import { SUGGESTED_QUESTIONS } from '@/lib/chatbot-system'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type PreviewChipLayout = {
  align: 'left' | 'right'
  width: string
}

const EMPTY_STATE_INTRO =
  "Hi! Ask me about Constantia's services, team, or how to start a project."

const PREVIEW_CHIP_LAYOUTS: PreviewChipLayout[] = [
  { align: 'right', width: '232px' },
  { align: 'left', width: '176px' },
  { align: 'right', width: '276px' },
  { align: 'left', width: '204px' },
  { align: 'right', width: '284px' },
  { align: 'right', width: '232px' },
]

const CHAT_SHELL_VARS = {
  ['--chat-shell-w' as string]: '412px',
  ['--chat-shell-h' as string]: '616px',
  ['--chat-shell-r' as string]: '28px',
  ['--chat-header-h' as string]: '106px',
  ['--chat-footer-h' as string]: '92px',
  ['--chat-panel-pad-x' as string]: '20px',
  ['--chat-composer-h' as string]: '48px',
  ['--chat-composer-r' as string]: '24px',
  ['--chat-accent' as string]: '#b97959',
  ['--chat-accent-border' as string]: 'rgba(185, 121, 89, 0.72)',
  ['--chat-surface' as string]: '#f6efe5',
  ['--chat-surface-strong' as string]: '#fffaf3',
  ['--chat-border' as string]: 'rgba(197, 180, 160, 0.82)',
  ['--chat-title' as string]: '#191411',
  ['--chat-copy' as string]: '#201916',
  ['--chat-muted' as string]: 'rgba(32, 25, 22, 0.52)',
  ['--chat-shadow' as string]: '0 26px 56px rgba(118, 91, 64, 0.22), 0 4px 16px rgba(255, 255, 255, 0.42) inset',
} as CSSProperties

function Bubble({
  role,
  children,
  className = '',
}: {
  role: Message['role']
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`chatbot-row chatbot-row--${role}`}>
      <div className={`chatbot-bubble chatbot-bubble--${role} ${className}`.trim()}>{children}</div>
    </div>
  )
}

export default function ChatBot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, streamingContent])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMessage = { role: 'user' as const, content: messageText }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.ok) throw new Error('Failed')
      if (!response.body) throw new Error('No body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullContent += chunk
        setStreamingContent(fullContent)
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }])
      setStreamingContent('')
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  if (pathname === '/contact') return null

  return (
    <>
      <div
        className="chatbot-panel-wrap"
        style={{
          ...CHAT_SHELL_VARS,
          transition: 'opacity 300ms ease, transform 300ms ease',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 18px, 0) scale(0.982)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-hidden={!isOpen}
      >
        <div className="chatbot-panel">
          <header className="chatbot-header">
            <div className="chatbot-brand-grid">
              <div className="chatbot-logo-shell">
                <Image
                  src="/images/logo/Logo_Circle.png"
                  alt="Constantia"
                  width={28}
                  height={28}
                  className="chatbot-logo"
                />
              </div>

              <div className="chatbot-title-row">
                <h2 className="chatbot-title">Constantia Assistant</h2>
                <span className="chatbot-status-dot" aria-hidden="true" />
              </div>

              <p className="chatbot-subtitle">Ask about our services &amp; team</p>
            </div>
          </header>

          <div className="chatbot-body">
            {messages.length === 0 && !isLoading ? (
              <div className="chatbot-empty-state">
                <Bubble role="assistant" className="chatbot-empty-intro">
                  {EMPTY_STATE_INTRO}
                </Bubble>

                <div className="chatbot-preview-stack">
                  {SUGGESTED_QUESTIONS.map((question, index) => {
                    const layout = PREVIEW_CHIP_LAYOUTS[index] ?? PREVIEW_CHIP_LAYOUTS[PREVIEW_CHIP_LAYOUTS.length - 1]

                    return (
                      <button
                        key={question}
                        type="button"
                        onClick={() => sendMessage(question)}
                        className={`chatbot-preview-chip chatbot-preview-chip--${layout.align}`}
                        style={{ width: layout.width, maxWidth: 'calc(100% - 18px)' }}
                      >
                        {question}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="chatbot-messages">
                {messages.map((msg, index) => (
                  <Bubble key={`${msg.role}-${index}`} role={msg.role}>
                    {msg.content}
                  </Bubble>
                ))}

                {isLoading && streamingContent && (
                  <Bubble role="assistant" className="chatbot-streaming">
                    {streamingContent}
                    <span className="chatbot-streaming-caret" />
                  </Bubble>
                )}

                {isLoading && !streamingContent && (
                  <div className="chatbot-row chatbot-row--assistant">
                    <div className="chatbot-bubble chatbot-bubble--assistant chatbot-loading-bubble">
                      <span className="chatbot-loading-dots" aria-hidden="true">
                        <span className="chatbot-loading-dot chatbot-loading-dot--delay-0" />
                        <span className="chatbot-loading-dot chatbot-loading-dot--delay-1" />
                        <span className="chatbot-loading-dot chatbot-loading-dot--delay-2" />
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="chatbot-footer">
            <div className="chatbot-composer">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Constantia..."
                className="chatbot-input"
                disabled={isLoading}
                aria-label="Chat input"
              />

              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="chatbot-send"
                aria-label="Send message"
              >
                <ArrowRight size={19} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="chatbot-launcher-wrap">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="chatbot-launcher"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? <X size={21} strokeWidth={1.8} /> : <MessageCircle size={21} strokeWidth={1.8} />}
        </button>
      </div>

      <style jsx>{`
        .chatbot-panel-wrap {
          position: fixed;
          right: 24px;
          bottom: 92px;
          z-index: 100;
          width: min(var(--chat-shell-w), calc(100vw - 24px));
        }

        .chatbot-panel {
          width: 100%;
          height: min(var(--chat-shell-h), calc(100vh - 104px));
          display: grid;
          grid-template-rows: var(--chat-header-h) minmax(0, 1fr) var(--chat-footer-h);
          border-radius: var(--chat-shell-r);
          border: 1px solid var(--chat-border);
          background:
            radial-gradient(circle at top center, rgba(255, 255, 255, 0.48), transparent 34%),
            linear-gradient(180deg, #fbf7f0 0%, var(--chat-surface) 100%);
          box-shadow: var(--chat-shadow);
          overflow: hidden;
          backdrop-filter: blur(22px);
        }

        .chatbot-header {
          border-bottom: 1px solid rgba(197, 180, 160, 0.72);
          padding: 22px var(--chat-panel-pad-x) 18px;
        }

        .chatbot-brand-grid {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          grid-template-rows: auto auto;
          column-gap: 12px;
          row-gap: 6px;
          align-items: center;
        }

        .chatbot-logo-shell {
          grid-row: 1 / span 2;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 3px;
        }

        .chatbot-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
        }

        .chatbot-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .chatbot-title {
          font-family: var(--font-display);
          font-size: 1.04rem;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--chat-title);
          font-weight: 400;
          white-space: nowrap;
        }

        .chatbot-status-dot {
          width: 11px;
          height: 11px;
          flex: 0 0 11px;
          border-radius: 999px;
          background: #73d67a;
          box-shadow: 0 0 0 3px rgba(115, 214, 122, 0.15);
        }

        .chatbot-subtitle {
          font-family: var(--font-inter);
          font-size: 0.69rem;
          line-height: 1.2;
          color: var(--chat-accent);
          letter-spacing: -0.01em;
        }

        .chatbot-body {
          min-height: 0;
          overflow-y: auto;
          padding: 22px var(--chat-panel-pad-x) 0;
          scrollbar-width: none;
        }

        .chatbot-body::-webkit-scrollbar {
          display: none;
        }

        .chatbot-empty-state,
        .chatbot-messages {
          display: flex;
          flex-direction: column;
        }

        .chatbot-empty-state {
          gap: 12px;
          padding-top: 16px;
        }

        .chatbot-empty-intro {
          width: min(312px, calc(100% - 56px));
        }

        .chatbot-preview-stack {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .chatbot-preview-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 16px;
          border-radius: 20px;
          border: 1px solid var(--chat-accent-border);
          background: rgba(249, 241, 233, 0.84);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.76) inset;
          color: var(--chat-copy);
          font-family: var(--font-inter);
          font-size: 0.72rem;
          line-height: 1.25;
          letter-spacing: -0.02em;
          text-align: center;
          transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
        }

        .chatbot-preview-chip:hover {
          transform: translateY(-1px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.82) inset,
            0 8px 16px rgba(169, 121, 88, 0.12);
          background: rgba(250, 245, 238, 0.96);
        }

        .chatbot-preview-chip--left {
          margin-right: auto;
        }

        .chatbot-preview-chip--right {
          margin-left: auto;
        }

        .chatbot-messages {
          gap: 12px;
          padding-bottom: 18px;
        }

        .chatbot-row {
          display: flex;
        }

        .chatbot-row--assistant {
          justify-content: flex-start;
        }

        .chatbot-row--user {
          justify-content: flex-end;
        }

        .chatbot-bubble {
          max-width: min(286px, 80%);
          padding: 11px 15px 12px;
          border-radius: 20px;
          font-family: var(--font-inter);
          font-size: 0.72rem;
          line-height: 1.45;
          letter-spacing: -0.02em;
          color: var(--chat-copy);
          word-break: break-word;
        }

        .chatbot-bubble--assistant {
          background: var(--chat-surface-strong);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.9) inset,
            0 10px 18px rgba(140, 116, 93, 0.08);
        }

        .chatbot-bubble--user {
          border: 1px solid var(--chat-accent-border);
          background: rgba(249, 241, 233, 0.84);
          box-shadow: 0 1px 0 rgba(255, 255, 255, 0.76) inset;
        }

        .chatbot-streaming {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .chatbot-streaming-caret {
          width: 1px;
          height: 13px;
          background: rgba(32, 25, 22, 0.62);
          animation: chatbotPulse 1s ease-in-out infinite;
        }

        .chatbot-loading-bubble {
          min-width: 66px;
        }

        .chatbot-loading-dots {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          height: 14px;
        }

        .chatbot-loading-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(32, 25, 22, 0.46);
          animation: chatbotBounce 0.9s infinite ease-in-out;
        }

        .chatbot-loading-dot--delay-0 {
          animation-delay: 0ms;
        }

        .chatbot-loading-dot--delay-1 {
          animation-delay: 120ms;
        }

        .chatbot-loading-dot--delay-2 {
          animation-delay: 240ms;
        }

        .chatbot-footer {
          padding: 16px var(--chat-panel-pad-x) 20px;
        }

        .chatbot-composer {
          display: flex;
          align-items: center;
          gap: 10px;
          height: var(--chat-composer-h);
          padding: 0 8px 0 16px;
          border-radius: var(--chat-composer-r);
          border: 1px solid rgba(197, 180, 160, 0.82);
          background: rgba(255, 251, 245, 0.9);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.92) inset,
            0 8px 18px rgba(149, 119, 89, 0.08);
        }

        .chatbot-input {
          flex: 1;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--chat-copy);
          font-family: var(--font-inter);
          font-size: 0.74rem;
          letter-spacing: -0.02em;
        }

        .chatbot-input::placeholder {
          color: rgba(96, 82, 70, 0.58);
        }

        .chatbot-send {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(96, 82, 70, 0.8);
          transition:
            color 180ms ease,
            background 180ms ease,
            transform 180ms ease,
            opacity 180ms ease;
        }

        .chatbot-send:hover:not(:disabled) {
          transform: translateX(1px);
          color: var(--chat-copy);
          background: rgba(244, 235, 225, 0.9);
        }

        .chatbot-send:disabled {
          opacity: 0.42;
          cursor: not-allowed;
        }

        .chatbot-launcher-wrap {
          position: fixed;
          right: 24px;
          bottom: 24px;
          z-index: 100;
        }

        .chatbot-launcher {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(186, 169, 150, 0.76);
          background:
            radial-gradient(circle at top, rgba(255, 255, 255, 0.88), rgba(248, 240, 231, 0.95)),
            #f8f1e8;
          color: #211a16;
          box-shadow:
            0 12px 28px rgba(121, 94, 69, 0.18),
            0 2px 10px rgba(255, 255, 255, 0.58) inset;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .chatbot-launcher:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow:
            0 16px 32px rgba(121, 94, 69, 0.22),
            0 2px 10px rgba(255, 255, 255, 0.62) inset;
        }

        @keyframes chatbotPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes chatbotBounce {
          0%,
          80%,
          100% {
            transform: translateY(0);
            opacity: 0.42;
          }
          40% {
            transform: translateY(-2px);
            opacity: 0.8;
          }
        }

        @media (max-width: 640px) {
          .chatbot-panel-wrap {
            right: 12px;
            bottom: 84px;
            width: calc(100vw - 24px);
          }

          .chatbot-panel {
            height: min(var(--chat-shell-h), calc(100vh - 96px));
            border-radius: 24px;
          }

          .chatbot-header {
            padding-left: 16px;
            padding-right: 16px;
          }

          .chatbot-body {
            padding-left: 16px;
            padding-right: 16px;
          }

          .chatbot-footer {
            padding-left: 16px;
            padding-right: 16px;
            padding-bottom: 16px;
          }

          .chatbot-bubble,
          .chatbot-preview-chip,
          .chatbot-empty-intro {
            max-width: 100%;
            width: auto !important;
          }

          .chatbot-launcher-wrap {
            right: 12px;
            bottom: 12px;
          }
        }
      `}</style>
    </>
  )
}
