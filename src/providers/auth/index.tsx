import React, { useState } from 'react'

const AuthContext = React.createContext(
  {} as {
    user: any,
    updateUser: (user: any) => void
  }
)
const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null)
  const updateUser = (user: any) => {
    setUser(user)
  }
  return (
    <AuthContext.Provider
      value={{user, updateUser}}>
        { children }
    </AuthContext.Provider>
  )
}

export default AuthProvider