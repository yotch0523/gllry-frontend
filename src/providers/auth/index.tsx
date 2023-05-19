import React, { useState } from 'react'

import { User } from '@/types/user'

const AuthContext = React.createContext(
  {} as {
    user: User | null | undefined
    updateUser: (user: User) => void
  },
)
const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null | undefined>(null)
  const updateUser = (user: User) => {
    setUser(user)
  }
  return (
    <AuthContext.Provider value={{ user, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
