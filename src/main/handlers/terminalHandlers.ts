import { IpcMainEvent } from 'electron'
import Process from 'renderer/@types/Process'
import { runningProcesses } from '../util'

export const onTerminalData = (
  event: IpcMainEvent,
  data: { pid: string | number; data: string }
) => {
  const ptyProcess = runningProcesses.find(
    (target: Process) => target.pid === data.pid
  )

  ptyProcess?.write(data.data)
}
