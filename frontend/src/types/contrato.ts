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
  arquiteto_cpf?: string
  arquiteto_cnpj?: string
  arquiteto_email?: string
  arquiteto_telefone?: string
  servicos_adicionais?: string
  clausulas_opcionais?: string[]
  variaveis_opcionais?: Record<string, string>

  cliente_tipo?: string
  cliente_email?: string
  cliente_telefone?: string
  razao_social?: string
  nome_representante_legal?: string
}
