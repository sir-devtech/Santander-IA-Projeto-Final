import { Loader2, SendHorizonal } from 'lucide-react'
import { type FormEvent, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Divider } from '@/components/shared/Divider'
import { useChat } from '@/hooks/useChat'

interface ChatProps {
  simulationId: string
}

export function Chat({ simulationId }: ChatProps) {
  const { messages, isLoading, error, sendMessage } = useChat(simulationId)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, error])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!input.trim() || isLoading) {
      return
    }

    void sendMessage(input)
    setInput('')
  }

  return (
    <section className="mt-6">
      <Divider spacing={0} className="mb-6" />
      <h3 className="text-foreground mb-4 text-sm font-semibold">
        💬 Conversar com o Educador Financeiro
      </h3>

      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm">
            Faça uma pergunta sobre esta simulação.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={[
              'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground ml-auto'
                : 'bg-input text-foreground',
            ].join(' ')}
          >
            {message.content}
          </div>
        ))}

        {isLoading && (
          <div className="bg-input text-muted-foreground flex items-center gap-2 rounded-2xl px-4 py-3 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Educador está respondendo...
          </div>
        )}

        {error && <p className="text-sm text-red-500">⚠️ {error}</p>}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ex: Como posso economizar mais por mês?"
          disabled={isLoading}
          className="bg-input text-foreground placeholder:text-muted-foreground flex-1 rounded-2xl px-4 py-3 text-sm outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          icon={SendHorizonal}
          disabled={!input.trim() || isLoading}
          aria-label="Enviar pergunta"
        />
      </form>
    </section>
  )
}
