import React, { useEffect, useState } from 'react'
import useDebounce from 'renderer/hooks/useDebounce'
import { useIpc } from 'renderer/hooks/useIpc'

function StatusBar() {
  const [status, setStatus] = useState<string>('')
  const debounce = useDebounce(status, 25000)

  useIpc('workspaces.open.status', (data: string) => {
    setStatus(data)
  })

  useEffect(() => {
    if (!debounce) return

    setStatus('')
  }, [debounce])

  if (!status) return null

  return (
    <div className="flex border-t border-[#353535] w-full p-2">
      <span className="w-full whitespace-nowrap text-ellipsis text-[#d2d2d2] font-thin text-xs">
        {status}
      </span>
    </div>
  )
}

export default StatusBar
