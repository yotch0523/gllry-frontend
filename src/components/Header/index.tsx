import Button from '@/components/Button'
import useUser from '@/hooks/useUser'
import msalInstance, { loginRequest } from '@/services/msal'

const Header = () => {
  const user = useUser()
  const isAuthorized = !(user === null || user === undefined)
  const name = isAuthorized ? user.givenName : ''

  return (
    <header className="bg-neutral-950 px-4 py-2 text-white">
      {isAuthorized && <span>Hello, {name} san.</span>}
      <Button
        text={isAuthorized ? 'ログアウト' : 'ログイン'}
        className="rounded bg-transparent px-1 py-2 text-white hover:bg-neutral-900 hover:underline"
        onClick={
          isAuthorized
            ? async () => msalInstance.logoutRedirect()
            : async () => msalInstance.loginRedirect(loginRequest)
        }
      />
    </header>
  )
}

export default Header
