import React from 'react'

import ButtonMain from 'renderer/base-components/ButtonMain'
import SpanMain from 'renderer/base-components/SpanMain'
import SubtitleMain from 'renderer/base-components/SubtitleMain'
import TitleMain from 'renderer/base-components/TitleMain'

interface ModalStartWelcomeProps {
  onNext: () => void
}

export default function ModalStartWelcome(props: ModalStartWelcomeProps) {
  const { onNext } = props

  return (
    <div className="flex flex-col items-center">
      <SpanMain>Welcome to</SpanMain>
      <TitleMain className="text-white !text-[4rem]">wrkspace</TitleMain>
      <SubtitleMain className="mt-4">
        Boot projects with ease. Speed up your work.
      </SubtitleMain>
      <div className="flex gap-x-2 mt-6">
        <ButtonMain secondary bordered sm onClick={onNext}>
          Get started
        </ButtonMain>
      </div>
    </div>
  )
}
