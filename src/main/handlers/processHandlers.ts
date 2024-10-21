import { IpcMainEvent } from 'electron'
import isRunning from 'is-running'
import treeKill from 'tree-kill'
import Store from 'electron-store'
import Process from 'renderer/@types/Process'
import Workspace from 'renderer/@types/Workspace'
import { terminal, runningProcesses } from '../util'

const store = new Store()

export const onProcessOpen = (event: IpcMainEvent, workspace: Workspace) => {
  terminal('', workspace, workspace.path, 'Terminal', false)
}

export const onProcessClose = (event: IpcMainEvent, process: Process) => {
  try {
    treeKill(process?.pid as number)

    const ptyProcess = runningProcesses.find(
      (target: Process) => target.pid === process.pid
    )
    ptyProcess?.write('exit\n')

    const interval = setInterval(() => {
      if (isRunning(process?.pid as number)) return

      setTimeout(() => {
        const processes = (store.get('processes') ?? []) as Process[]
        const filteredProcesses = processes.filter(
          (target: Process) => target?.pid !== process?.pid
        )

        store.set('processes', filteredProcesses)
        event.reply('processes.update', filteredProcesses)
      }, 250)

      clearInterval(interval)
    }, 250)
  } catch {
    //
  }
}
