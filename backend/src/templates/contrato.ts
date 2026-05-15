export type VariableMap = Record<string, string>

export function templateHeader(vars: VariableMap, date?: string): string {
  const dataContrato = date ?? new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  const arquitetoNome = vars['nome_arquiteto'] ?? ''
  return `<section id="header">
  <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS DE ARQUITETURA</h1>
  <p>Modelo Orientativo CAU/DF</p>
  <p>Elaborado por: ${arquitetoNome}</p>
  <p>Data: ${dataContrato}</p>
</section>`
}

export function templateDisclaimer(): string {
  return `<section id="disclaimer">
  <h2>Aviso Importante</h2>
  <p>Este documento é um modelo orientativo do Conselho de Arquitetura e Urbanismo do Distrito Federal (CAU/DF) e não substitui assessoria jurídica especializada.</p>
  <p>Recomenda-se a revisão por profissional jurídico habilitado antes da assinatura, a fim de adequar as cláusulas às particularidades de cada contratação.</p>
</section>`
}

export function templateServicosAdicionais(servicosAdicionais: string): string {
  return `<section id="servicos-adicionais">
  <h2>Serviços Adicionais</h2>
  <p>${servicosAdicionais}</p>
</section>`
}

export function templateAssinaturas(vars: VariableMap): string {
  const nomeContratante = vars['nome_contratante'] ?? ''
  const nomeArquiteto = vars['nome_arquiteto'] ?? ''
  return `<section id="assinaturas">
  <h2>Assinaturas</h2>
  <p>Brasília, DF, _______ de __________________ de _______.</p>
  <div class="assinatura-contratante">
    <p>_____________________________________________</p>
    <p><strong>CONTRATANTE</strong></p>
    <p>${nomeContratante}</p>
  </div>
  <div class="assinatura-contratado">
    <p>_____________________________________________</p>
    <p><strong>CONTRATADO(A)</strong></p>
    <p>${nomeArquiteto}</p>
  </div>
</section>`
}

export function templateFooter(): string {
  return `<section id="footer">
  <p>© CAU/DF — Este é um modelo orientativo. Recomenda-se assessoria jurídica para contratos específicos.</p>
</section>`
}
