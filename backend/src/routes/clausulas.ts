import { Hono } from 'hono'
import { listClausulas, findClausulaBySlug } from '../services/clausulas-service'

export const clausulasRouter = new Hono()

clausulasRouter.get('/clausulas', (c) => {
  const obrigatoriaParam = c.req.query('obrigatoria')
  const categoriaParam = c.req.query('categoria')
  const filters: { obrigatoria?: boolean; categoria?: string } = {}
  if (obrigatoriaParam === 'true') {
    filters.obrigatoria = true
  } else if (obrigatoriaParam === 'false') {
    filters.obrigatoria = false
  }
  if (categoriaParam !== undefined) {
    filters.categoria = categoriaParam
  }
  return c.json(listClausulas(filters), 200)
})

clausulasRouter.get('/clausulas/:slug', (c) => {
  const slug = c.req.param('slug')
  const clausula = findClausulaBySlug(slug)
  if (!clausula) {
    return c.json({ error: 'Cláusula não encontrada' }, 404)
  }
  return c.json(clausula, 200)
})
