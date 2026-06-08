import type { Connect } from 'vite'
import type { Plugin } from 'vite'

const MODEL_NAME = 'gemini-flash-latest'

function createGeminiMiddleware(apiKey: string): Connect.NextHandleFunction {
  return (req, res, next) => {
    if (!req.url?.startsWith('/api/gemini') || req.method !== 'POST') {
      next()
      return
    }

    if (!apiKey) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(
        JSON.stringify({
          error: 'GEMINI_API_KEY não configurada no servidor.',
        }),
      )
      return
    }

    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      void (async () => {
        try {
          const body = Buffer.concat(chunks).toString()
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`

          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          })

          const data = await response.text()
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
        } catch {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Erro ao conectar com Gemini.' }))
        }
      })()
    })
  }
}

export function geminiProxyPlugin(apiKey: string): Plugin {
  const middleware = createGeminiMiddleware(apiKey)

  return {
    name: 'gemini-proxy',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
