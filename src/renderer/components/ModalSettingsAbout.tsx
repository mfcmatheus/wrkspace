import React from 'react'
import GitHubButton from 'react-github-btn'

import Logo from 'renderer/base-components/Logo'

function ModalSettingsAbout() {
  return (
    <div className="flex flex-col items-center justify-center p-3 flex-grow">
      <div className="flex w-[10rem] h-[10rem]">
        <Logo />
      </div>
      <span className="text-[2rem] uppercase tracking-[.4rem] text-white">
        Wrkspace
      </span>
      <span className="text-[#d2d2d2]">Version 0.8.0</span>
      <div className="flex mt-2">
        <GitHubButton
          href="https://github.com/mfcmatheus/wrkspace"
          data-color-scheme="no-preference: dark; light: dark; dark: dark;"
          data-show-count="true"
          aria-label="Star mfcmatheus/wrkspace on GitHub"
        >
          Star
        </GitHubButton>
      </div>
    </div>
  )
}

export default ModalSettingsAbout
