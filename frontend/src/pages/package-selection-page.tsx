import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFormStore } from '../store/form-store'
import { FormShell } from '../components/form-shell'
import styles from './package-selection-page.module.css'

interface Pacote {
  id: string
  label: string
  tipo_servico: string
  tipologias: string[]
  escopo_padrao: string
  numero_revisoes_sugerido: number
  entregaveis: string[]
}

export function PackageSelectionPage() {
  const navigate = useNavigate()
  const updateStep = useFormStore((state) => state.updateStep)
  const [packages, setPackages] = useState<Pacote[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [selectedTypology, setSelectedTypology] = useState<string | null>(null)
  useEffect(() => {
    fetch('/api/contratos/pacotes')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar pacotes')
        return res.json()
      })
      .then((data: Pacote[]) => {
        setPackages(data)
        setLoading(false)
      })
      .catch((error: unknown) => {
        console.error('Failed to load packages', { error: error instanceof Error ? error.message : 'Unknown error' })
        setError('Não foi possível carregar os pacotes. Tente novamente.')
        setLoading(false)
      })
  }, [])
  function handleSelectPackage(id: string) {
    setSelectedPackageId((prev) => (prev === id ? null : id))
    setSelectedTypology(null)
  }
  function handleSelectTypology(typology: string) {
    setSelectedTypology(typology)
  }
  function handleContinue() {
    const pkg = packages.find((p) => p.id === selectedPackageId)
    if (!pkg) return
    updateStep('package', {
      pacote_servico: pkg.id,
      tipo_servico: pkg.tipo_servico,
      tipo_projeto: selectedTypology,
      escopo_servicos: pkg.escopo_padrao,
      numero_revisoes: String(pkg.numero_revisoes_sugerido),
    })
    navigate('/formulario')
  }
  const selectedPackage = packages.find((p) => p.id === selectedPackageId) ?? null
  if (loading) {
    return (
      <FormShell step={1} title="Seleção de Pacote">
        <p className={styles.loadingText}>Carregando pacotes…</p>
      </FormShell>
    )
  }
  if (error) {
    return (
      <FormShell step={1} title="Seleção de Pacote">
        <p className={styles.errorText}>{error}</p>
      </FormShell>
    )
  }
  return (
    <FormShell
      step={1}
      title="Seleção de Pacote"
      subtitle="Escolha o pacote de serviço para o seu contrato."
    >
      <p className={styles.sectionLabel}>Pacotes disponíveis</p>
      <div className={styles.packagesGrid}>
        {packages.map((pkg) => (
          <button
            key={pkg.id}
            className={styles.packageCard}
            aria-pressed={selectedPackageId === pkg.id}
            onClick={() => handleSelectPackage(pkg.id)}
          >
            <span className={styles.packageName}>{pkg.label}</span>
            <span className={styles.packageType}>{pkg.tipo_servico}</span>
          </button>
        ))}
      </div>
      {selectedPackage && (
        <div className={styles.typologiesSection}>
          <p className={styles.sectionLabel}>Tipologia do projeto</p>
          <div className={styles.typologiesGrid}>
            {selectedPackage.tipologias.map((typology) => (
              <button
                key={typology}
                className={styles.typologyButton}
                aria-label={`Tipologia ${typology}`}
                aria-pressed={selectedTypology === typology}
                onClick={() => handleSelectTypology(typology)}
              >
                {typology}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        className={styles.continueButton}
        disabled={!selectedPackageId || !selectedTypology}
        onClick={handleContinue}
      >
        Continuar
      </button>
    </FormShell>
  )
}
