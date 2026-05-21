import { useState } from 'react'
import { useNavigate } from 'react-router'
import { NumericFormat } from 'react-number-format'
import { useFormStore } from '../store/form-store'
import styles from './fees-form-page.module.css'

interface FeesFields {
  prazo_quantidade: string
  prazo_unidade: 'dias' | 'meses' | ''
  valor_total: string
  forma_pagamento: 'a_vista' | 'parcelado' | ''
  parcelas: string
  valor_parcela: string
  indice_reajuste: string
}

export function isFormValid(fields: FeesFields): boolean {
  const qty = parseInt(fields.prazo_quantidade, 10)
  if (isNaN(qty) || qty < 1 || String(qty) !== fields.prazo_quantidade.trim()) return false
  if (!fields.prazo_unidade) return false
  if (!fields.valor_total || fields.valor_total.trim() === 'R$' || fields.valor_total.trim() === 'R$ ') return false
  if (!fields.forma_pagamento) return false
  if (fields.forma_pagamento === 'parcelado') {
    const p = parseInt(fields.parcelas, 10)
    if (isNaN(p) || p < 2 || String(p) !== fields.parcelas.trim()) return false
    if (!fields.valor_parcela || fields.valor_parcela.trim() === 'R$' || fields.valor_parcela.trim() === 'R$ ') return false
  }
  return true
}

export function FeesFormPage() {
  const navigate = useNavigate()
  const { updateStep, steps } = useFormStore()
  const savedFees = steps['fees'] as {
    prazo_total?: string
    valor_total?: string
    forma_pagamento?: string
    parcelas?: string
    valor_parcela?: string
    indice_reajuste?: string
  } | undefined
  const additionalServices = steps['additional-services'] as { selected_services?: string[] } | undefined
  const hasAdditionalServices = (additionalServices?.selected_services?.length ?? 0) > 0
  const [fields, setFields] = useState<FeesFields>(() => {
    if (!savedFees) {
      return {
        prazo_quantidade: '',
        prazo_unidade: '',
        valor_total: '',
        forma_pagamento: '',
        parcelas: '',
        valor_parcela: '',
        indice_reajuste: '',
      }
    }
    const parts = savedFees.prazo_total?.split(' ') ?? []
    return {
      prazo_quantidade: parts[0] ?? '',
      prazo_unidade: (parts[1] as 'dias' | 'meses' | '') ?? '',
      valor_total: savedFees.valor_total ?? '',
      forma_pagamento: (savedFees.forma_pagamento as 'a_vista' | 'parcelado' | '') ?? '',
      parcelas: savedFees.parcelas ?? '',
      valor_parcela: savedFees.valor_parcela ?? '',
      indice_reajuste: savedFees.indice_reajuste ?? '',
    }
  })
  function handleChange(field: keyof FeesFields, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
  }
  function handleFormaPagamentoChange(value: string) {
    if (value === 'a_vista') {
      setFields((prev) => ({ ...prev, forma_pagamento: 'a_vista', parcelas: '', valor_parcela: '' }))
      return
    }
    setFields((prev) => ({ ...prev, forma_pagamento: value as 'parcelado' | '' }))
  }
  function handleSubmit() {
    if (!isFormValid(fields)) return
    const prazo_total = fields.prazo_quantidade + ' ' + fields.prazo_unidade
    const stepData: Record<string, string> = {
      prazo_total,
      valor_total: fields.valor_total,
      forma_pagamento: fields.forma_pagamento,
    }
    if (fields.forma_pagamento === 'parcelado') {
      stepData.parcelas = fields.parcelas
      stepData.valor_parcela = fields.valor_parcela
    }
    if (fields.indice_reajuste) {
      stepData.indice_reajuste = fields.indice_reajuste
    }
    updateStep('fees', stepData)
    navigate('/resultado')
  }
  function handleBack() {
    navigate('/servicos-adicionais')
  }
  const isParcelado = fields.forma_pagamento === 'parcelado'
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Honorários e Prazos</h1>
      <p className={styles.subtitle}>Informe o prazo de execução e os honorários profissionais.</p>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        noValidate
      >
        {hasAdditionalServices && (
          <p role="alert" className={styles.alert}>
            Você selecionou serviços adicionais. Revise os prazos e honorários para garantir que os valores reflitam os serviços incluídos.
          </p>
        )}
        <div className={styles.fieldGroup}>
          <label htmlFor="prazo_quantidade" className={styles.label}>
            Prazo de Execução
          </label>
          <div className={styles.prazoGroup}>
            <input
              id="prazo_quantidade"
              type="text"
              inputMode="numeric"
              className={`${styles.input} ${styles.prazoInput}`}
              value={fields.prazo_quantidade}
              onChange={(e) => handleChange('prazo_quantidade', e.target.value)}
            />
            <label htmlFor="prazo_unidade" className={styles.srOnly}>Unidade do prazo</label>
            <select
              id="prazo_unidade"
              className={styles.input}
              value={fields.prazo_unidade}
              onChange={(e) => handleChange('prazo_unidade', e.target.value as 'dias' | 'meses' | '')}
            >
              <option value="">Selecione...</option>
              <option value="dias">dias</option>
              <option value="meses">meses</option>
            </select>
          </div>
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="valor_total" className={styles.label}>
            Valor Total dos Honorários
          </label>
          <NumericFormat
            id="valor_total"
            prefix="R$ "
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            value={fields.valor_total}
            onValueChange={(values) => handleChange('valor_total', values.formattedValue)}
            className={styles.input}
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="forma_pagamento" className={styles.label}>
            Forma de Pagamento
          </label>
          <select
            id="forma_pagamento"
            className={styles.input}
            value={fields.forma_pagamento}
            onChange={(e) => handleFormaPagamentoChange(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="a_vista">À vista</option>
            <option value="parcelado">Parcelado</option>
          </select>
        </div>
        {isParcelado && (
          <div className={styles.fieldGroup}>
            <label htmlFor="parcelas" className={styles.label}>
              Número de Parcelas
            </label>
            <input
              id="parcelas"
              type="text"
              inputMode="numeric"
              className={styles.input}
              value={fields.parcelas}
              onChange={(e) => handleChange('parcelas', e.target.value)}
            />
          </div>
        )}
        {isParcelado && (
          <div className={styles.fieldGroup}>
            <label htmlFor="valor_parcela" className={styles.label}>
              Valor da Parcela
            </label>
            <NumericFormat
              id="valor_parcela"
              prefix="R$ "
              thousandSeparator="."
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              value={fields.valor_parcela}
              onValueChange={(values) => handleChange('valor_parcela', values.formattedValue)}
              className={styles.input}
            />
          </div>
        )}
        <div className={styles.fieldGroup}>
          <label htmlFor="indice_reajuste" className={styles.label}>
            Índice de Reajuste (opcional)
          </label>
          <select
            id="indice_reajuste"
            className={styles.input}
            value={fields.indice_reajuste}
            onChange={(e) => handleChange('indice_reajuste', e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="IPCA">IPCA</option>
            <option value="IGP-M">IGP-M</option>
            <option value="INCC">INCC</option>
            <option value="Sem reajuste">Sem reajuste</option>
          </select>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            Voltar
          </button>
          <button
            type="submit"
            className={styles.continueButton}
            disabled={!isFormValid(fields)}
          >
            Continuar
          </button>
        </div>
      </form>
    </main>
  )
}
