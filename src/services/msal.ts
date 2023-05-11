import * as msal from '@azure/msal-browser'
import { Configuration } from '@azure/msal-browser'

const msalConfig: Configuration = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
        authority: process.env.NEXT_PUBLIC_AUTHORITY === undefined ? '' : process.env.NEXT_PUBLIC_AUTHORITY,
        knownAuthorities: process.env.NEXT_PUBLIC_KNOWN_AUTHORITY === undefined ? [] : [process.env.NEXT_PUBLIC_KNOWN_AUTHORITY],
        redirectUri: '/',
        postLogoutRedirectUri: '/',
    }
}
export const loginRequest = {
    scopes: ["openid"]
}
export const apiRequest = {
    scopes: ['']
}
const msalInstance = new msal.PublicClientApplication(msalConfig)
export default msalInstance