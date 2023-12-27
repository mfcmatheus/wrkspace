import { useEffect, useState } from 'react'
import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client'

import Routes from 'renderer/routes'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import client from 'renderer/graphql/client'
import { UserProvider } from './contexts/UserContext'
import { CloudSyncProvider } from './contexts/CloudSyncContext'
import { ToastProvider } from './contexts/ToastContext'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    ipcRenderer.sendMessage('process')
  }, [])

  useIpc('process', (data) => {
    localStorage.setItem('env', JSON.stringify(data))
  })

  useIpc('user.check', (data) => {
    localStorage.setItem('token', data)
    setToken(data)
  })

  useIpc('user.logout', () => {
    setToken(null)
  })

  if (!token) return <Routes />

  return (
    <ApolloProvider client={client()}>
      <UserProvider token={token}>
        <ToastProvider>
          <CloudSyncProvider>
            <Routes />
          </CloudSyncProvider>
        </ToastProvider>
      </UserProvider>
    </ApolloProvider>
  )
}
