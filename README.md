# Planej.ai — Educador Financeiro Inteligente

Projeto final da trilha **Santander 2026 — React Frontend** (DIO).

Aplicação web de planejamento financeiro pessoal com formulário multi-step, diagnóstico via Google Gemini, histórico de simulações e chat com educador financeiro. Tudo roda no browser com persistência em `localStorage`.

## Funcionalidades

- Formulário multi-step com máscara monetária (BRL)
- Tema claro/escuro com preferência salva
- Diagnóstico financeiro personalizado via IA (Gemini)
- Histórico de simulações (listar, excluir, ver detalhes)
- Chat contextual sobre cada simulação
- API key protegida via proxy no servidor Vite

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4
- React Router DOM v7
- Google Gemini API

## Como rodar

```bash
npm install
cp .env.example .env
# Edite .env e adicione sua GEMINI_API_KEY
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (com proxy Gemini) |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint + Prettier |
| `npm run preview` | Preview do build (proxy Gemini ativo) |

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (use `.env.example` como base):

```
GEMINI_API_KEY=sua_chave_aqui
```

- **Não** use o prefixo `VITE_` — a chave fica apenas no servidor
- O proxy `/api/gemini` repassa as chamadas ao Google sem expor a key no bundle
- Obtenha a chave em [Google AI Studio](https://aistudio.google.com/apikey)

## Estrutura principal

```
src/
├── components/features/
│   ├── Simulation/       # Formulário multi-step
│   ├── SimulationResults/# Cards e insights
│   ├── History/          # Histórico (Desafio 1)
│   └── Insights/         # Conteúdo IA + Chat (Desafio 2)
├── data/                 # Steps do form + prompts IA
├── hooks/                # Storage, tema, insight, chat
├── pages/                # Rotas da aplicação
└── services/             # Integração Gemini
```

## Rotas

| Rota | Página |
|------|--------|
| `/` | Formulário de simulação |
| `/resultado/:id` | Resultados + insights + chat |
| `/historico` | Histórico de simulações |

## Referências

- [Repositório oficial DIO — Planej.ai](https://github.com/digitalinnovationone/planejai)
- [Desafio criativo — persona da IA](https://github.com/sir-devtech/DIO-Santander-Prototipo-do-Educador-Financeiro-Inteligente)
- [Protótipo Figma](https://www.figma.com/design/MVZhmZxoVAsgotZo50gj6M/Educador-Financeiro---DIO)

---

Moisés Santos — [sir-devtech](https://github.com/sir-devtech)
