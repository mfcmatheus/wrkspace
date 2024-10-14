import { atom } from 'recoil'
import Folder from 'renderer/@types/Folder'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import FolderSelector from '../selectors/FolderSelector'

export default atom({
  key: 'folders',
  default: FolderSelector as Folder[],
  effects: [
    ({ onSet }) => {
      const eventHandler = ipcRenderer.on(
        'folders.reload',
        (data: Folder[]) => {
          return onSet(() => data.filter((folder) => !folder.deleted_at))
        }
      )

      return () => {
        ipcRenderer.removeListener('folders.reload', eventHandler)
      }
    },
  ],
})
