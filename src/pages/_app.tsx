import type { AppProps } from 'next/app'

import { InteractionType } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
      <Component {...pageProps} />
    </MsalAuthenticationTemplate>
  )
}

export default MyApp