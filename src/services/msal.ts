import * as msal from '@azure/msal-browser'
import { Configuration } from '@azure/msal-browser'

const apiScopes: string[] = []
if (process.env.NEXT_PUBLIC_IMAGE_API_READ_SCOPE)
  apiScopes.push(process.env.NEXT_PUBLIC_IMAGE_API_READ_SCOPE)
if (process.env.NEXT_PUBLIC_IMAGE_API_WRITE_SCOPE)
  apiScopes.push(process.env.NEXT_PUBLIC_IMAGE_API_WRITE_SCOPE)

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
    authority:
      process.env.NEXT_PUBLIC_AUTHORITY === undefined
        ? ''
        : process.env.NEXT_PUBLIC_AUTHORITY,
    knownAuthorities:
      process.env.NEXT_PUBLIC_KNOWN_AUTHORITY === undefined
        ? []
        : [process.env.NEXT_PUBLIC_KNOWN_AUTHORITY],
    redirectUri: '/',
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'localStorage',
  },
}
export const loginRequest: msal.RedirectRequest = {
  scopes: ['openid', 'offline_access'],
}

const msalInstance = new msal.PublicClientApplication(msalConfig)
export default msalInstance
