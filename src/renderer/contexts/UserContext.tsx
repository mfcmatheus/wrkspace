import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLazyQuery } from '@apollo/client'

import User from 'renderer/@types/User'
import MeQuery from 'renderer/graphql/queries/MeQuery'
import client from 'renderer/graphql/client'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

export interface props {
  children: React.ReactNode
  token?: string | null
}

export interface IUserContext {
  user: User | null
  token?: string | null
  resetUser: () => void
  gettingUser: boolean
  hasCloudSync: boolean
  refetchUser: () => Promise<void>
}

export const UserContext = createContext<IUserContext>({} as IUserContext)

export const useUser = () => {
  const context = useContext<IUserContext>(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}

// const apolloClient = client('/user')

export function UserProvider(props: props) {
  const { token, children } = props
  const [user, setUser] = useState<User | null>(null)
  const [gettingUser, setGettingUser] = useState<boolean>(false)
  const [getUser] = useLazyQuery<User>(MeQuery, {
    // client: apolloClient,
    fetchPolicy: 'no-cache',
  })

  const resetUser = useCallback(() => setUser(null), [])

  const userCallback = useCallback(async () => {
    setGettingUser(true)

    const { data } = await getUser()
    ipcRenderer.sendMessage('user.set', data?.Me as User)
    setUser(data?.Me as User)

    setGettingUser(false)
  }, [getUser])

  const hasCloudSync = useMemo(() => {
    if (!user) return false
    return !!user.plans.personal
  }, [user])

  const providerValue = useMemo(
    () => ({
      user,
      token,
      resetUser,
      gettingUser,
      hasCloudSync,
      refetchUser: userCallback,
    }),
    [user, token, resetUser, gettingUser, hasCloudSync, userCallback]
  )

  useEffect(() => {
    if (!token) return
    userCallback()
  }, [token, userCallback])

  useEffect(() => {
    ipcRenderer.sendMessage('user.get')
  }, [])

  useIpc('user.get', (data: User) => setUser(data))

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  )
}

export default { UserProvider, UserContext, useUser }
