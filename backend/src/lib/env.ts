interface Env {
  PORT: number
  NODE_ENV: 'development' | 'production' | 'test'
  CORS_ORIGIN: string
}

const VALID_NODE_ENVS = ['development', 'production', 'test'] as const

function parseEnv(): Env {
  const port = parseInt(process.env.PORT ?? '3000', 10)
  const nodeEnv = process.env.NODE_ENV ?? 'development'
  const corsOrigin = process.env.CORS_ORIGIN

  if (!corsOrigin) {
    console.error('Invalid env config', { error: 'CORS_ORIGIN is required' })
    process.exit(1)
  }

  if (!VALID_NODE_ENVS.includes(nodeEnv as Env['NODE_ENV'])) {
    console.error('Invalid env config', {
      error: `NODE_ENV must be one of: ${VALID_NODE_ENVS.join(', ')}`,
    })
    process.exit(1)
  }

  if (isNaN(port) || port <= 0) {
    console.error('Invalid env config', { error: 'PORT must be a valid number' })
    process.exit(1)
  }

  return {
    PORT: port,
    NODE_ENV: nodeEnv as Env['NODE_ENV'],
    CORS_ORIGIN: corsOrigin,
  }
}

export const env = parseEnv()
