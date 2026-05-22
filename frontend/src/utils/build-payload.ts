import type { ContratoPayload } from '../types/contrato'

export function buildPayload(steps: Record<string, Record<string, unknown>>): ContratoPayload {
  return Object.values(steps).reduce<ContratoPayload>(
    (acc, step) => ({ ...acc, ...step } as ContratoPayload),
    {} as ContratoPayload
  )
}
