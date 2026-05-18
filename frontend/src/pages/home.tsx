import { useFormStore } from '../store/form-store'
import { DownloadPdfButton } from '../components/download-pdf-button'
import type { ContratoPayload } from '../types/contrato'

function buildPayload(steps: Record<string, Record<string, unknown>>): ContratoPayload {
  return Object.values(steps).reduce<ContratoPayload>(
    (acc, step) => ({ ...acc, ...step } as ContratoPayload),
    {} as ContratoPayload
  )
}

export function HomePage() {
  const steps = useFormStore((state) => state.steps)
  const payload = buildPayload(steps)
  return (
    <main>
      <h1>SisContrato CAU/DF</h1>
      <p>Plataforma de geração de contratos para arquitetos.</p>
      <section aria-label="Download do contrato">
        <DownloadPdfButton payload={payload} />
      </section>
    </main>
  )
}
