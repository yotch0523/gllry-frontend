import type { AppProps } from 'next/app'

import { InteractionType } from "@azure/msal-browser"
import { MsalAuthenticationTemplate, MsalProvider, useMsal} from "@azure/msal-react"

import Button from '@/components/button'
import AuthProvider from '@/providers/auth'
import msalInstance, { loginRequest } from '@/services/msal'
import useUser from '@/hooks/useUser'

const Header = () => {
  const user = useUser()
  if (user === null || user === undefined)
  {
    return (
      <div>
        <Button text="ログイン" onClick={async () => msalInstance.loginRedirect(loginRequest)} />
      </div>
    )
  }
  const name = user.givenName

  return (
    <div>
      <span>Hello, { name } san.</span>
      <Button text="ログアウト" onClick={async () => msalInstance.logoutRedirect()} />
    </div>
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