import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './lib/env'
import { healthRouter } from './routes/health'
import { clausulasRouter } from './routes/clausulas'
import { contratosRouter } from './routes/contratos'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.route('/', healthRouter)
app.route('/api', clausulasRouter)
app.route('/api', contratosRouter)

Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
})

console.log('Server started', { port: env.PORT, env: env.NODE_ENV })
