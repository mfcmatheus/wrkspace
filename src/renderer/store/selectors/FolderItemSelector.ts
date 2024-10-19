import { selectorFamily } from 'recoil'
import ElectronApi from 'services/ElectronApi'
import Folder from 'renderer/@types/Folder'
import FolderAtom from '../atoms/FolderAtom'

export default selectorFamily({
  key: 'folder.item',
  get:
    (id: string) =>
    ({ get }) => {
      return get(FolderAtom).find((w) => w.id === id)
    },
  set:
    (id: string | undefined) =>
    ({ set }, newValue: Folder) => {
      const isEditing = !!id

      if (isEditing) {
        set(FolderAtom, (old) => {
          const values = [...old]
          const index = old.findIndex((f) => f.id === newValue.id)
          values[index] = newValue
          return values
        })
        ElectronApi.call('folders.update', newValue)

        return
      }

      set(FolderAtom, (old) => {
        const values = [...old]
        values.push(newValue)
        return values
      })
      ElectronApi.call('folders.create', newValue)
    },
})
