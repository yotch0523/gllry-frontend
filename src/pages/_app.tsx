import type { AppProps } from 'next/app'

import { InteractionType } from "@azure/msal-browser"
import { MsalAuthenticationTemplate, MsalProvider, useMsal } from "@azure/msal-react"

import AuthProvider from '@/providers/auth'
import msalInstance, { loginRequest } from '@/services/msal'

const Header = () => {
  const { accounts } = useMsal()
  const username = accounts[0].username

  return (
    <>
      Hello, {{ username }} san.
    </>
  )
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const authRequest = {
    ...loginRequest
  }
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
        >
          <Header />
          <Component {...pageProps} />
        </MsalAuthenticationTemplate>
      </AuthProvider>
    </MsalProvider>
  )
}

export default MyApp