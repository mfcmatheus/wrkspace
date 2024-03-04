import React, { createContext, useContext, useEffect, useState } from 'react'
import Setting from 'renderer/@types/Setting'
import { ipcRenderer, useIpc } from 'renderer/hooks/useIpc'

export interface props {
  children: React.ReactNode
}

export const SettingContext = createContext<Setting>({} as Setting)

export const useSetting = () => {
  const context = useContext<Setting>(SettingContext)

  if (!context) {
    throw new Error('useSetting must be used within a Setting provider')
  }

  return context
}

export function SettingProvider(props: props) {
  const { children } = props

  const [settings, setSettings] = useState<Setting>({} as Setting)

  useEffect(() => ipcRenderer.sendMessage('settings.get'), [])

  useIpc('settings.get', setSettings)
  useIpc('settings.reload', setSettings)

  return (
    <SettingContext.Provider value={settings}>
      {children}
    </SettingContext.Provider>
  )
}

export default { SettingProvider, SettingContext, useSetting }
