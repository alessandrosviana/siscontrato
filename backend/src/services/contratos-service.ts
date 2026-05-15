import {
  findClausulaBySlug,
  listClausulas,
} from './clausulas-service'
import {
  templateAssinaturas,
  templateDisclaimer,
  templateFooter,
  templateHeader,
  templateServicosAdicionais,
} from '../templates/contrato'
import pacotesData from '../data/pacotes.json'

export interface ContratoPayload {
  cliente_nome: string
  cliente_documento: string
  cliente_endereco: string
  arquiteto_nome: string
  arquiteto_endereco: string
  registro_cau: string
  tipo_servico: string
  tipo_projeto: string
  endereco_projeto: string
  area_projeto: string
  escopo_servicos: string
  prazo_total: string
  valor_total: string
  forma_pagamento: string
  numero_revisoes: string
  finalidade_uso: string
  prazo_documentos: string
  lista_documentos: string
  prazo_orcamento_aditivo: string
  prazo_aviso_rescisao: string
  cidade_foro: string
  servicos_adicionais?: string
  clausulas_opcionais?: string[]
  variaveis_opcionais?: Record<string, string>
}

export interface Pacote {
  id: string
  label: string
  escopo_padrao: string
  numero_revisoes_sugerido: number
  entregaveis: string[]
}

export type VariableMap = Record<string, string>

export function buildVariableMap(payload: ContratoPayload): VariableMap {
  const vars: VariableMap = {
    nome_contratante: payload.cliente_nome,
    cpf_cnpj_contratante: payload.cliente_documento,
    endereco_contratante: payload.cliente_endereco,
    nome_arquiteto: payload.arquiteto_nome,
    endereco_escritorio: payload.arquiteto_endereco,
    registro_cau: payload.registro_cau,
    tipo_servico: payload.tipo_servico,
    descricao_objeto: payload.tipo_projeto,
    endereco_obra: payload.endereco_projeto,
    area_projeto: payload.area_projeto,
    etapas_servico: payload.escopo_servicos,
    prazo_entrega: payload.prazo_total,
    valor_honorarios: payload.valor_total,
    forma_pagamento: payload.forma_pagamento,
    numero_revisoes: payload.numero_revisoes,
    finalidade_uso: payload.finalidade_uso,
    prazo_documentos: payload.prazo_documentos,
    lista_documentos: payload.lista_documentos,
    prazo_orcamento_aditivo: payload.prazo_orcamento_aditivo,
    prazo_aviso_rescisao: payload.prazo_aviso_rescisao,
    cidade_foro: payload.cidade_foro,
    estado_foro: 'Distrito Federal',
  }
  if (payload.variaveis_opcionais) {
    Object.assign(vars, payload.variaveis_opcionais)
  }
  return vars
}

function substituteVariables(text: string, vars: VariableMap): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

function renderClause(slug: string, vars: VariableMap): string {
  const clausula = findClausulaBySlug(slug)
  if (!clausula) {
    throw new Error(`Cláusula não encontrada: ${slug}`)
  }
  const texto = substituteVariables(clausula.texto, vars)
  return `<section>
  <h2>${clausula.titulo}</h2>
  <p>${texto}</p>
</section>`
}

export function generateHtml(payload: ContratoPayload): string {
  const vars = buildVariableMap(payload)
  const optionalOrder = payload.clausulas_opcionais && payload.clausulas_opcionais.length > 0
    ? resolveOptionalClausesOrdered(payload.clausulas_opcionais, vars)
    : ''
  const servicosAdicionaisSection = payload.servicos_adicionais
    ? templateServicosAdicionais(payload.servicos_adicionais)
    : ''
  return [
    templateHeader(vars),
    templateDisclaimer(),
    renderClause('identificacao-das-partes', vars),
    renderClause('objeto-do-contrato', vars),
    renderClause('escopo-dos-servicos', vars),
    servicosAdicionaisSection,
    renderClause('prazos', vars),
    renderClause('honorarios-e-pagamento', vars),
    optionalOrder,
    renderClause('direitos-autorais', vars),
    renderClause('responsabilidades-das-partes', vars),
    renderClause('alteracoes-de-escopo', vars),
    renderClause('rescisao-contratual', vars),
    renderClause('foro', vars),
    templateAssinaturas(vars),
    templateFooter(),
  ].join('\n')
}

function resolveOptionalClausesOrdered(slugs: string[], vars: VariableMap): string {
  const slugSet = new Set(slugs)
  for (const slug of slugs) {
    if (!findClausulaBySlug(slug)) {
      throw new Error(`Cláusula não encontrada: ${slug}`)
    }
  }
  const allOptional = listClausulas({ obrigatoria: false })
  const ordered = allOptional.filter((c) => slugSet.has(c.slug))
  const rendered = ordered.map((c) => renderClause(c.slug, vars)).join('\n')
  const missingVars = rendered.match(/\{\{(\w+)\}\}/g)
  if (missingVars) {
    throw new Error(`Variáveis faltantes para cláusulas opcionais: ${missingVars.join(', ')}`)
  }
  return rendered
}

export function getPackages(): Pacote[] {
  return pacotesData as Pacote[]
}
