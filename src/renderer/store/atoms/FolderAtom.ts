import { atom } from 'recoil'
import Folder from 'renderer/@types/Folder'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import FolderDefaultSelector from '../selectors/FolderDefaultSelector'

export default atom({
  key: 'folders',
  default: FolderDefaultSelector as Folder[],
  effects: [
    ({ setSelf }) => {
      const eventHandler = ipcRenderer.on(
        'folders.reload',
        (data: Folder[]) => {
          return setSelf(() => data.filter((folder) => !folder.deleted_at))
        }
      )

      return () => {
        ipcRenderer.removeListener('folders.reload', eventHandler)
      }
    },
  ],
})
