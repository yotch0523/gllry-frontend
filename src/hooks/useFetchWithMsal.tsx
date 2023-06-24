import {
  AuthError,
  InteractionRequiredAuthError,
  InteractionType,
  RedirectRequest,
  SilentRequest,
} from '@azure/msal-browser'
import { useMsal, useMsalAuthentication } from '@azure/msal-react'
import { useCallback, useState } from 'react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type ApiConfig = {
  b2cScopes: string[]
}
const config: ApiConfig = {
  b2cScopes: process.env.NEXT_PUBLIC_IMAGE_API_WRITE_SCOPE
    ? [process.env.NEXT_PUBLIC_IMAGE_API_WRITE_SCOPE]
    : [],
}

const useFetchWithMsal = <T,>(msalRequest: RedirectRequest) => {
  const { accounts, instance } = useMsal()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [data, setData] = useState<T | null>(null)

  const account = accounts.length > 0 ? accounts[0] : undefined
  const tokenRequest: SilentRequest = {
    scopes: config.b2cScopes,
    account,
  }
  const { result, error: msalError } = useMsalAuthentication(
    InteractionType.Redirect,
    {
      ...msalRequest,
      account: account ? account : undefined,
      redirectUri: process.env.NEXT_PUBLIC_AUTHORITY,
    },
  )

  const execute = async (
    method: HttpMethod,
    endpoint: string,
    data: FormData,
  ) => {
    instance
      .acquireTokenSilent(tokenRequest)
      .then(async (accessTokenResponse) => {
        if (
          !accessTokenResponse.accessToken ||
          accessTokenResponse.accessToken === ''
        )
          throw new InteractionRequiredAuthError()
        const headers = new Headers()
        const bearer = `Bearer ${accessTokenResponse.accessToken}`
        headers.append('Authorization', bearer)
        headers.append('user-id', account?.idTokenClaims?.sub ?? '')
        const options = {
          method: method,
          headers: headers,
          body: data,
        }
        setIsLoading(true)
        const response = await fetch(endpoint, options)
        const result = await response.json()
        setData(result.data)

        setIsLoading(false)
        return result
      })
      .catch((error) => {
        if (error instanceof InteractionRequiredAuthError) {
          return instance
            .acquireTokenRedirect(tokenRequest)
            .then((response) => {
              return response
            })
            .catch((error) => {
              console.log(error)
            })
        } else {
          console.log(error)
        }
        setError(error)
      })
  }

  return {
    isLoading,
    error,
    data,
    execute: useCallback(execute, [instance, result, msalError, account]), // to avoid infinite calls when inside a `useEffect`
  }
}

export default useFetchWithMsal
