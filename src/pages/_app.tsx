import { InteractionType } from '@azure/msal-browser'
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react'
import type { AppProps } from 'next/app'

import Header from '@/components/Header'
import AuthProvider from '@/providers/auth'
import msalInstance, { loginRequest } from '@/services/msal'
import '@/styles/global.scss'

const MyApp = ({ Component, pageProps }: AppProps) => {
  const authRequest = {
    ...loginRequest,
  }
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
        >
          <Header />
          <div className="p-4">
            <Component {...pageProps} />
          </div>
        </MsalAuthenticationTemplate>
      </AuthProvider>
    </MsalProvider>
  )
}

export default MyApp
