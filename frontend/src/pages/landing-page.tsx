import { useNavigate } from 'react-router'
import styles from './landing-page.module.css'

export function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <h1 className={styles.title}>Gerador de Contratos para Arquitetos</h1>
        <p className={styles.description}>
          Ferramenta oficial do CAU/DF para geração de modelos de contratos de prestação de
          serviços de arquitetura. Preencha o formulário e obtenha um documento personalizado em
          PDF.
        </p>
        <button className={styles.button} onClick={() => navigate('/aviso')}>
          Criar contrato
        </button>
      </main>
      <footer className={styles.footer}>
        <span>CAU/DF</span>
        <span className={styles.separator}>|</span>
        <span>Aviso legal</span>
      </footer>
    </div>
  )
}
