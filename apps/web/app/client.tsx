/// <reference types="vinxi/types/client" />
import { scan } from 'react-scan' // must be imported before React and React DOM

import { StrictMode } from 'react'
import { StartClient } from '@tanstack/react-start'
import { hydrateRoot } from 'react-dom/client'
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
