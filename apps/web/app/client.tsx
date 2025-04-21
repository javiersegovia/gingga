import { StartClient } from '@tanstack/react-start'

import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
/// <reference types="vinxi/types/client" />
import { scan } from 'react-scan' // must be imported before React and React DOM
import { createRouter } from './router'

scan({
  enabled: false,
})

const router = createRouter()

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
)
