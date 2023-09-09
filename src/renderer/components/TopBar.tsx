import React from 'react'
import GitHubButton from 'react-github-btn'

function TopBar() {
  return (
    <div className="flex justify-center border-b border-[#353535] w-full pt-2">
      <div className="flex-1">
        <div className="pl-[5.25rem]">
          <GitHubButton
            href="https://github.com/mfcmatheus/wrkspace"
            data-color-scheme="no-preference: dark; light: dark; dark: dark;"
            data-show-count="true"
            data-size="large"
            aria-label="Star mfcmatheus/wrkspace on GitHub"
          >
            Star
          </GitHubButton>
        </div>
      </div>
      <h1 style={{ WebkitAppRegion: 'drag' }} className="text-white font-thin">
        Welcome to Wrkspace
      </h1>
      <div className="flex-1" />
    </div>
  )
}

export default TopBar
