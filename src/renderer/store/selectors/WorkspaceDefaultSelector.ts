import { selector } from 'recoil'
import Workspace from 'renderer/@types/Workspace'
import ElectronApi from 'services/ElectronApi'

export default selector({
  key: 'workspaces.get',
  get: () => {
    return ElectronApi.call('workspaces.get', {}).filter(
      (w: Workspace) => !w.deleted_at
    )
  },
})
