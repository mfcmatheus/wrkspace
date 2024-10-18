import { atom } from 'recoil'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import Workspace from 'renderer/@types/Workspace'
import WorkspaceDefaultSelector from '../selectors/WorkspaceDefaultSelector'

export default atom({
  key: 'workspaces',
  default: WorkspaceDefaultSelector as Workspace[],
  effects: [
    ({ setSelf }) => {
      const eventHandler = ipcRenderer.on(
        'workspaces.reload',
        (data: Workspace[]) => {
          return setSelf(() => data.filter((folder) => !folder.deleted_at))
        }
      )

      return () => {
        ipcRenderer.removeListener('workspaces.reload', eventHandler)
      }
    },
  ],
})
