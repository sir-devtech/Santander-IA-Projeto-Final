import { CalendarClock, Goal, PiggyBank, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import type { SimulationRecord } from '@/data/simulation'
import { formatCurrencyDisplay } from '@/utils/currency'
import { calcMonthlySavingsNeeded } from '@/utils/simulation'

interface HistoryCardProps {
  simulation: SimulationRecord
  onDelete: (id: string) => void
}

export function HistoryCard({ simulation, onDelete }: HistoryCardProps) {
  const monthlyNeeded = calcMonthlySavingsNeeded(simulation)

  return (
    <article className="bg-card flex flex-col gap-4 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
            <Goal size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-foreground text-lg font-semibold">
              {simulation.goalName}
            </h2>
            {simulation.insight && (
              <span className="text-muted-foreground text-xs">
                Insight gerado
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          aria-label="Excluir simulação"
          className="text-muted-foreground cursor-pointer transition-colors hover:text-red-500"
          onClick={() => onDelete(simulation.id)}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="bg-input rounded-xl p-3">
          <p className="text-primary mb-1 text-xs font-semibold tracking-widest uppercase">
            Custo da meta
          </p>
          <p className="text-foreground text-lg font-semibold">
            {formatCurrencyDisplay(simulation.goalAmount)}
          </p>
        </div>
        <div className="bg-input rounded-xl p-3">
          <div className="text-primary mb-1 flex items-center gap-1 text-xs font-semibold tracking-widest uppercase">
            <CalendarClock size={12} />
            Prazo
          </div>
          <p className="text-foreground text-lg font-semibold">
            {simulation.goalDeadline} meses
          </p>
        </div>
        <div className="bg-primary/10 rounded-xl p-3">
          <div className="text-primary mb-1 flex items-center gap-1 text-xs font-semibold tracking-widest uppercase">
            <PiggyBank size={12} />
            Economia mensal
          </div>
          <p className="text-foreground text-lg font-semibold">
            R${' '}
            {monthlyNeeded.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <Link to={`/resultado/${simulation.id}`}>
        <Button variant="primary" className="w-full">
          Ver detalhes
        </Button>
      </Link>
    </article>
  )
}
