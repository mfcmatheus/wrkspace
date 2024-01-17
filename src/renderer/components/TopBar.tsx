import React from 'react'

function TopBar() {
  return (
    <div
      style={{ WebkitAppRegion: 'drag' }}
      className="flex justify-center border-b border-[#353535] w-full py-2"
    >
      <div className="flex-1" />
      <h1 className="text-white font-thin">Welcome to Wrkspace</h1>
      <div className="flex-1" />
    </div>
  )
}

export default TopBar
