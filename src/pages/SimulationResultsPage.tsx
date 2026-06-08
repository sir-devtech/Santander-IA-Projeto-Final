import {
  CalendarClock,
  CreditCard,
  Goal,
  Landmark,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { AIInsightsCard } from '@/components/features/SimulationResults/AIInsightCardProps'
import { Card } from '@/components/features/SimulationResults/Card'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { formatCurrencyDisplay } from '@/utils/currency'
import { calcMonthlySavings } from '@/utils/simulation'

export function SimulationResultsPage() {
  const { id } = useParams<{ id: string }>()
  const { getFormData } = useSimulationStorage()

  const data = id ? getFormData(id) : null

  if (!data) {
    return (
      <main className="mx-auto max-w-xl px-4 py-10 text-center sm:py-14">
        <p className="text-muted-foreground mb-4">Simulação não encontrada.</p>
        <Link to="/" className="text-primary font-semibold hover:opacity-80">
          Fazer nova simulação
        </Link>
      </main>
    )
  }

  const monthlySavings = calcMonthlySavings(data)

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Resultado da sua simulação"
        subtitle="Com base no seu perfil financeiro e objetivos."
      />
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card
          icon={Goal}
          label="Custo da Meta"
          value={formatCurrencyDisplay(data.goalAmount)}
          subtitle={data.goalName}
        />
        <Card
          icon={CalendarClock}
          label="Prazo"
          value={`${data.goalDeadline} meses`}
          subtitle="Prazo para atingir a meta"
        />
        <Card
          variant="primary"
          icon={PiggyBank}
          label="Economia mensal"
          value={`R$ ${monthlySavings.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Valor disponível após gastos fixos"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {id && <AIInsightsCard simulationId={id} />}
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <Card
            icon={Wallet}
            label="Renda mensal"
            value={formatCurrencyDisplay(data.income)}
            subtitle="Renda total bruta por mês"
          />
          <Card
            icon={CreditCard}
            label="Custos Fixos de Vida"
            value={formatCurrencyDisplay(data.expenses)}
            subtitle="Gastos essenciais por mês"
          />
          <Card
            icon={Landmark}
            label="Dívidas / Parcelas"
            value={formatCurrencyDisplay(data.debts)}
            subtitle="Valor comprometido em parcelas/depósito"
          />
        </div>
      </div>
    </main>
  )
}
