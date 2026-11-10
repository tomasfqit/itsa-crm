import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppLayoutFooterProvider, ControlActionsProvider, EncryptProvider } from '@itsa-develop/itsa-fe-components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App'

const queryClient = new QueryClient()
const aesKeyHex = import.meta.env.VITE_KEY_ENCRYPTER_AES

if (!aesKeyHex) {
  throw new Error(
    'Falta VITE_KEY_ENCRYPTER_AES en .env. Agrégala y reinicia el servidor de Vite.',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppLayoutFooterProvider>
      <QueryClientProvider client={queryClient}>
        <EncryptProvider aesKeyHex={aesKeyHex}>
          <ControlActionsProvider fnApiValidatePermissionAction={() => Promise.resolve(true)}>
            <App />
          </ControlActionsProvider>
        </EncryptProvider>
        {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      </QueryClientProvider>
    </AppLayoutFooterProvider>
  </StrictMode>,
)
