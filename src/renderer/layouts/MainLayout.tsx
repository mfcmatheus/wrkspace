import React from 'react'
import TeamsBar from 'renderer/components/TeamsBar'

interface Props {
  children: React.ReactNode
}

export default function MainLayout(props: Props) {
  const { children } = props

  return (
    <div className="flex h-full p-1 overflow-hidden">
      <TeamsBar />
      <div className="flex flex-1 h-full overflow-hidden">{children}</div>
    </div>
  )
}
