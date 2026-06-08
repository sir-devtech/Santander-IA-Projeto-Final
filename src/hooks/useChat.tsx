import { useCallback, useState } from 'react'

import { buildChatPrompt } from '@/data/aiPrompt'
import type { ChatMessage, SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getChatReply } from '@/services/aiService'

export const useChat = (simulationId: string) => {
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const simulation = getFormData(simulationId)
    return simulation?.chat ?? []
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const persistChat = useCallback(
    (simulation: SimulationRecord, chat: ChatMessage[]) => {
      updateSimulation(simulationId, {
        ...simulation,
        chat,
      } as SimulationRecord)
    },
    [simulationId, updateSimulation],
  )

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim()

      if (!trimmed || isLoading) {
        return
      }

      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      }

      const nextMessages = [...messages, userMessage]
      setMessages(nextMessages)
      persistChat(simulation, nextMessages)
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildChatPrompt(simulation, messages, trimmed)
        const reply = await getChatReply(prompt)

        const assistantMessage: ChatMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: reply,
        }

        const updatedMessages = [...nextMessages, assistantMessage]
        setMessages(updatedMessages)
        persistChat(simulation, updatedMessages)
      } catch {
        setError('Erro ao enviar mensagem. Tente novamente.')
      } finally {
        setIsLoading(false)
      }
    },
    [getFormData, isLoading, messages, persistChat, simulationId],
  )

  return { messages, isLoading, error, sendMessage }
}
