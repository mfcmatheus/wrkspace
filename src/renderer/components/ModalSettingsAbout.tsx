import React from 'react'

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
      <span className="text-[#d2d2d2]">Version 1.2.0</span>
    </div>
  )
}

export default ModalSettingsAbout
