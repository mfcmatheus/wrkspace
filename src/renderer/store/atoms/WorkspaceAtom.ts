import { atom } from 'recoil'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import Workspace from 'renderer/@types/Workspace'
import WorkspaceDefaultSelector from '../selectors/WorkspaceDefaultSelector'

export default atom({
  key: 'workspaces',
  default: WorkspaceDefaultSelector as Workspace[],
  effects: [
    ({ onSet }) => {
      const eventHandler = ipcRenderer.on(
        'workspaces.reload',
        (data: Workspace[]) => {
          return onSet(() => data.filter((folder) => !folder.deleted_at))
        }
      )

      return () => {
        ipcRenderer.removeListener('workspaces.reload', eventHandler)
      }
    },
  ],
})
