import { createBrowserRouter, RouterProvider } from 'react-router'
import { AdditionalServicesPage } from './pages/additional-services-page'
import { ArchitectFormPage } from './pages/architect-form-page'
import { ClientFormPage } from './pages/client-form-page'
import { CompletionPage } from './pages/completion-page'
import { DisclaimerPage } from './pages/disclaimer-page'
import { FeesFormPage } from './pages/fees-form-page'
import { LandingPage } from './pages/landing-page'
import { OptionalClausesPage } from './pages/optional-clauses-page'
import { PackageSelectionPage } from './pages/package-selection-page'
import { ProjectFormPage } from './pages/project-form-page'
import { ResultPage } from './pages/result-page'
import { ScopeFormPage } from './pages/scope-form-page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/aviso',
    element: <DisclaimerPage />,
  },
  {
    path: '/pacote',
    element: <PackageSelectionPage />,
  },
  {
    path: '/resultado',
    element: <ResultPage />,
  },
  {
    path: '/formulario',
    element: <ArchitectFormPage />,
  },
  {
    path: '/contratante',
    element: <ClientFormPage />,
  },
  {
    path: '/projeto',
    element: <ProjectFormPage />,
  },
  {
    path: '/escopo',
    element: <ScopeFormPage />,
  },
  {
    path: '/servicos-adicionais',
    element: <AdditionalServicesPage />,
  },
  {
    path: '/honorarios',
    element: <FeesFormPage />,
  },
  {
    path: '/clausulas',
    element: <OptionalClausesPage />,
  },
  {
    path: '/concluido',
    element: <CompletionPage />,
  },
])

export function App() {
  return <RouterProvider router={router} />
}
