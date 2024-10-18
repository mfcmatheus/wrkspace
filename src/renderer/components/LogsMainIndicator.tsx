import React from 'react'
import { useRecoilValue } from 'recoil'
import Lucide from 'renderer/base-components/lucide'
import ProcessAtom from 'renderer/store/atoms/ProcessAtom'

interface Props {
  showLogs: boolean
  setShowLogs: (showLogs: boolean) => void
}

export default function LogsMainIndicator(props: Props) {
  const { showLogs, setShowLogs } = props
  const processes = useRecoilValue(ProcessAtom)

  if (!processes.length) {
    return <></>
  }

  return (
    <button
      type="button"
      className="cursor-default z-[2] absolute right-3 bottom-3 p-2 rounded-full bg-border text-white shadow-md"
      onClick={() => setShowLogs(!showLogs)}
    >
      <span className="right-0 top-0 block items-center justify-center shrink-0 rounded-full absolute h-[15px] w-[15px] bg-highlight-primary text-white text-[10px] shadow">
        {processes.length}
      </span>
      <Lucide icon="Terminal" size={24} strokeWidth={1} />
    </button>
  )
}
