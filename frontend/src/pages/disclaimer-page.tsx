import { useState } from 'react'
import { useNavigate } from 'react-router'
import { FormShell } from '../components/form-shell'
import styles from './disclaimer-page.module.css'

const DISCLAIMER_POINTS = [
  'Os modelos têm caráter orientativo',
  'A ferramenta não substitui análise jurídica individualizada',
  'O uso do documento não gera responsabilidade do CAU/DF sobre o contrato final',
  'O profissional permanece responsável pela adequação do documento ao caso concreto',
]

export function DisclaimerPage() {
  const navigate = useNavigate()
  const [accepted, setAccepted] = useState<boolean>(false)
  function handleContinue() {
    navigate('/pacote')
  }
  return (
    <FormShell title="Aviso Institucional" subtitle="Leia com atenção antes de prosseguir.">
      <div className={styles.form}>
        <ul className={styles.list}>
          {DISCLAIMER_POINTS.map((point) => (
            <li key={point} className={styles.listItem}>
              {point}
            </li>
          ))}
        </ul>
        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="accept-terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
          />
          <label htmlFor="accept-terms">Li e concordo com os termos acima</label>
        </div>
        <button
          className={styles.button}
          disabled={!accepted}
          onClick={handleContinue}
        >
          Continuar
        </button>
      </div>
    </FormShell>
  )
}
