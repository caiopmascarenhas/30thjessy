import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { applyDocumentStyles } from './app.helpers'

applyDocumentStyles()

const root = document.getElementById('root')

if (!root) {
  throw new Error('Elemento root não encontrado.')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
