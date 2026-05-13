import clausulasData from "../data/clausulas.json"

export interface Clausula {
  id: string
  slug: string
  titulo: string
  categoria: string
  texto: string
  obrigatoria: boolean
  versao: string
}

export interface ClausulaFilters {
  obrigatoria?: boolean
  categoria?: string
}

const clausulas = clausulasData as Clausula[]

export function listClausulas(filters: ClausulaFilters): Clausula[] {
  return clausulas.filter((clausula) => {
    if (filters.obrigatoria !== undefined && clausula.obrigatoria !== filters.obrigatoria) {
      return false
    }
    if (filters.categoria !== undefined && clausula.categoria !== filters.categoria) {
      return false
    }
    return true
  })
}

export function findClausulaBySlug(slug: string): Clausula | undefined {
  return clausulas.find((clausula) => clausula.slug === slug)
}
