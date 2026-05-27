import { type ReactNode } from 'react'
import styles from './form-shell.module.css'

const STEP_LABELS = [
  'Pacote',
  'Arquiteto',
  'Contratante',
  'Projeto',
  'Escopo',
  'Serviços',
  'Honorários',
  'Cláusulas',
]

interface FormShellProps {
  step?: number
  totalSteps?: number
  title: string
  subtitle?: string
  variant?: 'narrow' | 'wide'
  children: ReactNode
}

export function FormShell({
  step,
  totalSteps = 8,
  title,
  subtitle,
  variant = 'narrow',
  children,
}: FormShellProps) {
  const contentClass =
    variant === 'wide'
      ? `${styles.content} ${styles.contentWide}`
      : `${styles.content} ${styles.contentNarrow}`

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>CAU/DF</span>
        <span className={styles.appName}>Gerador de Contratos</span>
      </header>

      {step !== undefined && (
        <div className={styles.progress} aria-label="Progresso do formulário" role="navigation">
          <div className={styles.rail}>
            {Array.from({ length: totalSteps }, (_, i) => {
              const n = i + 1
              const isDone = n < step
              const isCurrent = n === step
              const nodeClass = isDone
                ? styles.nodeDone
                : isCurrent
                  ? styles.nodeCurrent
                  : styles.nodePending
              return (
                <div key={n} style={{ display: 'contents' }}>
                  {i > 0 && (
                    <div
                      className={`${styles.connector} ${isDone || isCurrent ? styles.connectorDone : styles.connectorPending}`}
                    />
                  )}
                  <div
                    className={`${styles.node} ${nodeClass}`}
                    aria-label={`Etapa ${n}: ${STEP_LABELS[i]}`}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {n}
                  </div>
                </div>
              )
            })}
          </div>
          <span className={styles.stepLabel}>
            Etapa{' '}
            <span className={styles.stepLabelCurrent}>
              {step} de {totalSteps}
            </span>
            {step <= totalSteps && ` · ${STEP_LABELS[step - 1]}`}
          </span>
        </div>
      )}

      <main className={contentClass}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
