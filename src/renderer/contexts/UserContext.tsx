import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLazyQuery } from '@apollo/client'

import User from 'renderer/@types/User'
import MeQuery from 'renderer/graphql/queries/MeQuery'
import client from 'renderer/graphql/client'
import { ipcRenderer } from 'renderer/hooks/useIpc'

export const UserContext = createContext({})

export interface props {
  children: React.ReactNode
  token?: string | null
}

export function UserProvider(props: props) {
  const { token, children } = props
  const [user, setUser] = useState<User | null>(null)
  const [getUser] = useLazyQuery<User>(MeQuery, {
    client: client('/user'),
  })

  const userCallback = useCallback(async () => {
    const { data } = await getUser()
    ipcRenderer.sendMessage('user.set', data?.Me as User)
    setUser(data?.Me as User)
  }, [getUser])

  const providerValue = useMemo(
    () => ({
      user,
      token,
    }),
    [user, token]
  )

  useEffect(() => {
    if (!token) return
    userCallback()
  }, [token, userCallback])

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  )
}

export default { UserProvider, UserContext }
