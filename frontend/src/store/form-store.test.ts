import { describe, it, expect, beforeEach } from 'vitest'
import { useFormStore } from './form-store'

describe('useFormStore', () => {
  beforeEach(() => {
    useFormStore.getState().resetForm()
  })

  it('initializes with currentStep 0 and empty steps', () => {
    const state = useFormStore.getState()
    expect(state.currentStep).toBe(0)
    expect(state.steps).toEqual({})
  })

  it('setCurrentStep updates currentStep', () => {
    useFormStore.getState().setCurrentStep(3)
    expect(useFormStore.getState().currentStep).toBe(3)
  })

  it('updateStep adds data for a given step key', () => {
    useFormStore.getState().updateStep('personal', { name: 'João', age: 30 })
    const state = useFormStore.getState()
    expect(state.steps['personal']).toEqual({ name: 'João', age: 30 })
  })

  it('updateStep merges multiple step keys without overwriting others', () => {
    useFormStore.getState().updateStep('personal', { name: 'João' })
    useFormStore.getState().updateStep('address', { city: 'Brasília' })
    const state = useFormStore.getState()
    expect(state.steps['personal']).toEqual({ name: 'João' })
    expect(state.steps['address']).toEqual({ city: 'Brasília' })
  })

  it('updateStep overwrites existing data for the same key', () => {
    useFormStore.getState().updateStep('personal', { name: 'João' })
    useFormStore.getState().updateStep('personal', { name: 'Maria' })
    expect(useFormStore.getState().steps['personal']).toEqual({ name: 'Maria' })
  })

  it('resetForm restores initial state', () => {
    useFormStore.getState().setCurrentStep(5)
    useFormStore.getState().updateStep('personal', { name: 'João' })
    useFormStore.getState().resetForm()
    const state = useFormStore.getState()
    expect(state.currentStep).toBe(0)
    expect(state.steps).toEqual({})
  })
})
