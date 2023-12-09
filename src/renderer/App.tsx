import { useEffect, useMemo, useState } from 'react'
import 'tailwindcss/tailwind.css'
import { ApolloProvider } from '@apollo/client'

import Routes from 'renderer/routes'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import client from 'renderer/graphql/client'
import { UserProvider } from './contexts/UserContext'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    ipcRenderer.sendMessage('process')
  }, [])

  useIpc('process', (data) => {
    localStorage.setItem('env', JSON.stringify(data))
  })

  useIpc('user.check', (data) => {
    setToken(data)
    localStorage.setItem('user.token', data)
  })

  if (!token) return <Routes />

  return (
    <ApolloProvider client={client()}>
      <UserProvider token={token}>
        <Routes />
      </UserProvider>
    </ApolloProvider>
  )
}
