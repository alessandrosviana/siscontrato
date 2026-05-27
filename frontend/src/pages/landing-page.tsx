import { useNavigate } from 'react-router'
import styles from './landing-page.module.css'

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <span className={styles.headerBrand}>CAU/DF</span>
      </header>
      <main className={styles.main}>
        <span className={styles.eyebrow}>Conselho de Arquitetura e Urbanismo do DF</span>
        <h1 className={styles.title}>Gerador de Contratos para Arquitetos</h1>
        <div className={styles.divider} aria-hidden="true" />
        <p className={styles.description}>
          Ferramenta oficial do CAU/DF para geração de modelos de contratos de prestação de
          serviços de arquitetura. Preencha o formulário e obtenha um documento personalizado em
          PDF.
        </p>
        <button className={styles.button} onClick={() => navigate('/aviso')}>
          Criar contrato
          <span className={styles.buttonArrow} aria-hidden="true">→</span>
        </button>
      </main>
      <footer className={styles.footer}>
        <span>CAU/DF</span>
        <span className={styles.footerDot} aria-hidden="true" />
        <button className={styles.footerLink} onClick={() => navigate('/aviso')}>
          Aviso legal
        </button>
      </footer>
    </div>
  )
}
