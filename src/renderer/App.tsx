import { useState } from 'react'
import { ApolloProvider } from '@apollo/client'

import 'renderer/App.css'
import 'tailwindcss/tailwind.css'

import { RecoilRoot } from 'recoil'
import Routes from 'renderer/routes'
import client from 'renderer/graphql/client'
import { UserProvider } from './contexts/UserContext'
import { CloudSyncProvider } from './contexts/CloudSyncContext'
import { ToastProvider } from './contexts/ToastContext'
import { WorkspaceProvider } from './contexts/WorkspaceContext'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  /* useIpc('user.check', (data) => {
    setToken(null)

    setTimeout(() => {
      localStorage.setItem('token', data)
      setToken(data)
    }, 300)
  })

  useIpc('user.logout', () => {
    setToken(null)
  }) */

  if (!token) {
    return (
      <RecoilRoot>
        <WorkspaceProvider>
          <ToastProvider>
            <Routes />
          </ToastProvider>
        </WorkspaceProvider>
      </RecoilRoot>
    )
  }

  return (
    <ApolloProvider client={client()}>
      <RecoilRoot>
        <UserProvider token={token}>
          <WorkspaceProvider>
            <ToastProvider>
              <CloudSyncProvider>
                <Routes />
              </CloudSyncProvider>
            </ToastProvider>
          </WorkspaceProvider>
        </UserProvider>
      </RecoilRoot>
    </ApolloProvider>
  )
}
