import React from 'react'

function TopBar() {
  return (
    <div
      style={{ WebkitAppRegion: 'drag' }}
      className="flex justify-center border-b border-border w-full py-2"
    >
      <div className="flex-1" />
      <h1 className="text-sm text-white font-thin">Wrkspace Desktop</h1>
      <div className="flex-1" />
    </div>
  )
}

export default TopBar
