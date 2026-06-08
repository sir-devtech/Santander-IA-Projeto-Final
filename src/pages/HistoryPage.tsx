import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'

import { HistoryCard } from '@/components/features/History/HistoryCard'
import { PageHero } from '@/components/shared/PageHero'
import type { SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function HistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    getAllSimulations().reverse(),
  )

  const handleDelete = useCallback(
    (id: string) => {
      const confirmed = window.confirm(
        'Deseja excluir esta simulação do histórico?',
      )

      if (!confirmed) {
        return
      }

      deleteSimulation(id)
      setSimulations(getAllSimulations().reverse())
    },
    [deleteSimulation, getAllSimulations],
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Revise suas metas salvas e acesse os insights gerados."
      />

      {simulations.length === 0 ? (
        <div className="bg-card rounded-2xl p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <p className="text-muted-foreground mb-4 text-sm">
            Você ainda não possui simulações salvas.
          </p>
          <Link to="/" className="text-primary font-semibold hover:opacity-80">
            Criar primeira simulação
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {simulations.map((simulation) => (
            <li key={simulation.id}>
              <HistoryCard simulation={simulation} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
