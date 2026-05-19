import { createBrowserRouter, RouterProvider } from 'react-router'
import { LandingPage } from './pages/landing-page'
import { DisclaimerPage } from './pages/disclaimer-page'
import { PackageSelectionPage } from './pages/package-selection-page'
import { ResultPage } from './pages/result-page'

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
    element: <div>Form under development</div>,
  },
])

export function App() {
  return <RouterProvider router={router} />
}
