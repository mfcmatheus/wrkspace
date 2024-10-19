import { selectorFamily } from 'recoil'
import Workspace from 'renderer/@types/Workspace'
import ElectronApi from 'services/ElectronApi'
import WorkspaceAtom from '../atoms/WorkspaceAtom'
import SettingCurrentFolderSelector from './SettingCurrentFolderSelector'

export default selectorFamily({
  key: 'workspace.item',
  get:
    (id: string) =>
    ({ get }) => {
      return get(WorkspaceAtom).find((w) => w.id === id)
    },
  set:
    (id: string | undefined) =>
    ({ set, get }, newValue: Workspace) => {
      const currentFolder = get(SettingCurrentFolderSelector)
      const isEditing = !!id

      if (isEditing) {
        set(WorkspaceAtom, (old) => {
          const values = [...old]
          const index = old.findIndex((w) => w.id === newValue.id)
          values[index] = newValue
          return values
        })
        ElectronApi.call('workspaces.update', newValue)

        return
      }

      set(WorkspaceAtom, (old) => {
        const values = [...old]
        values.push({ ...newValue, folder: currentFolder ?? undefined })
        return values
      })
      ElectronApi.call('workspaces.create', {
        ...newValue,
        folder: currentFolder ?? undefined,
      })
    },
})
