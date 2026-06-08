import type { ChatMessage, SimulationRecord } from '@/data/simulation'
import {
  calcMonthlySavings,
  calcMonthlySavingsNeeded,
} from '@/utils/simulation'

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes.>"
  },
  "diagnosis": {
    "content": "<Diagnóstico focado no comprometimento do orçamento: quanto % da renda está comprometida com gastos e dívidas, e o que isso representa para a saúde financeira.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática e concreta para reduzir gastos ou reorganizar o orçamento>"]
  },
  "extraIncome": {
    "items": ["<Ideia prática para gerar renda extra compatível com a realidade brasileira>"]
  },
  "investment": {
    "items": ["<Sugestão de investimento acessível para o perfil apresentado, com foco em atingir a meta>"]
  },
  "motivation": {
    "content": "<Mensagem final motivacional e personalizada, citando a meta pelo nome.>"
  }
}`

export function buildAIPrompt(simulation: SimulationRecord) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded = calcMonthlySavingsNeeded(simulation)
  const balanceAfterGoal = monthlySavings - monthlySavingsNeeded

  return `Você é um educador financeiro digital especializado em finanças pessoais para profissionais CLT que também empreendem em tech de forma autônoma (produtos próprios, clientes reais, web, mobile e offline).

Seu tom é objetivo, respeitoso e prático — como orientação para quem já entrega software de verdade. Sem moralismo, sem jargão bancário, sem prometer rentabilidade e sem recomendar produtos financeiros específicos.

Analise os dados abaixo e gere um diagnóstico financeiro personalizado com linguagem clara e encorajadora. O diagnóstico será exibido diretamente ao usuário no app — fale sempre em segunda pessoa ("você tem...", "sua meta...").

Dados da simulação:
- Renda mensal bruta: ${income}
- Custos fixos essenciais: ${expenses}
- Dívidas e parcelas mensais: ${debts}
- Valor disponível por mês: ${monthlySavings.toFixed(2)} reais
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo desejado: ${goalDeadline} meses
- Economia mensal necessária para atingir a meta no prazo: ${monthlySavingsNeeded.toFixed(2)} reais
- Saldo após reserva para a meta: ${balanceAfterGoal.toFixed(2)} reais

Retorne APENAS um JSON válido, sem texto adicional, sem blocos de código, neste formato exato:

${RESPONSE_SCHEMA}

Regras:
- Todos os textos em português do Brasil
- Máximo de 4 itens por lista
- Seja específico ao citar valores calculados
- Não repita informações entre seções
- Nunca use markdown dentro dos valores do JSON
- Respostas em listas curtas quando couber, com um único próximo passo prático por seção
- Para o campo "feasibility.status", use os seguintes critérios:
  - "viable": saldo após reserva para a meta é maior ou igual a 0
  - "needs_adjustment": saldo negativo de até 20% do valor da economia mensal necessária
  - "unfeasible": saldo negativo superior a 20% do valor da economia mensal necessária`
}

export function buildChatPrompt(
  simulation: SimulationRecord,
  messages: ChatMessage[],
  userQuestion: string,
) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded = calcMonthlySavingsNeeded(simulation)
  const balanceAfterGoal = monthlySavings - monthlySavingsNeeded

  const historyText =
    messages.length > 0
      ? messages
          .map(
            (message) =>
              `${message.role === 'user' ? 'Usuário' : 'Educador'}: ${message.content}`,
          )
          .join('\n')
      : 'Nenhuma mensagem anterior.'

  return `Você é um educador financeiro digital para profissionais CLT que também empreendem em tech. Responda perguntas sobre a simulação financeira abaixo.

Tom: objetivo, respeitoso e prático. Sem moralismo, sem jargão bancário, sem prometer rentabilidade e sem recomendar produtos financeiros específicos. Fale em segunda pessoa.

Dados da simulação:
- Renda mensal bruta: ${income}
- Custos fixos: ${expenses}
- Dívidas/parcelas: ${debts}
- Valor disponível por mês: ${monthlySavings.toFixed(2)} reais
- Meta: ${goalName}
- Custo da meta: ${goalAmount}
- Prazo: ${goalDeadline} meses
- Economia mensal necessária: ${monthlySavingsNeeded.toFixed(2)} reais
- Saldo após reserva: ${balanceAfterGoal.toFixed(2)} reais

Histórico da conversa:
${historyText}

Nova pergunta do usuário: ${userQuestion}

Responda em português do Brasil, de forma clara e direta. Máximo 3 parágrafos curtos. Não use markdown.`
}
