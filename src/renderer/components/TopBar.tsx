import React from 'react'
import GitHubButton from 'react-github-btn'

function TopBar() {
  return (
    <div className="flex justify-center border-b border-[#353535] w-full py-2">
      <div className="flex-1" />
      <h1 style={{ WebkitAppRegion: 'drag' }} className="text-white font-thin">
        Welcome to Wrkspace
      </h1>
      <div className="flex-1" />
    </div>
  )
}

export default TopBar
