import { create } from 'zustand'

interface StepData {
  [fieldName: string]: unknown
}

interface FormState {
  currentStep: number
  steps: Record<string, StepData>
  setCurrentStep: (step: number) => void
  updateStep: (key: string, data: StepData) => void
  resetForm: () => void
}

const initialState = {
  currentStep: 0,
  steps: {},
}

export const useFormStore = create<FormState>((set) => ({
  ...initialState,
  setCurrentStep: (step) => set({ currentStep: step }),
  updateStep: (key, data) => set((state) => ({ steps: { ...state.steps, [key]: data } })),
  resetForm: () => set(initialState),
}))
