import { useEffect, useState } from 'react'
import { ApolloProvider } from '@apollo/client'

import 'renderer/App.css'
import 'tailwindcss/tailwind.css'

import Routes from 'renderer/routes'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'
import client from 'renderer/graphql/client'
import { UserProvider } from './contexts/UserContext'
import { CloudSyncProvider } from './contexts/CloudSyncContext'
import { ToastProvider } from './contexts/ToastContext'
import { SettingProvider } from './contexts/SettingContext'
import { WorkspaceProvider } from './contexts/WorkspaceContext'
import { FolderProvider } from './contexts/FolderContext'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    ipcRenderer.sendMessage('process')
  }, [])

  useIpc('process', (data) => {
    localStorage.setItem('env', JSON.stringify(data))
  })

  useIpc('user.check', (data) => {
    setToken(null)

    setTimeout(() => {
      localStorage.setItem('token', data)
      setToken(data)
    }, 300)
  })

  useIpc('user.logout', () => {
    setToken(null)
  })

  if (!token) {
    return (
      <SettingProvider>
        <FolderProvider>
          <WorkspaceProvider>
            <Routes />
          </WorkspaceProvider>
        </FolderProvider>
      </SettingProvider>
    )
  }

  return (
    <ApolloProvider client={client()}>
      <UserProvider token={token}>
        <FolderProvider>
          <WorkspaceProvider>
            <ToastProvider>
              <CloudSyncProvider>
                <SettingProvider>
                  <Routes />
                </SettingProvider>
              </CloudSyncProvider>
            </ToastProvider>
          </WorkspaceProvider>
        </FolderProvider>
      </UserProvider>
    </ApolloProvider>
  )
}
