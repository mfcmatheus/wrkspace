import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'

export default selector({
  key: 'folders.get',
  get: () => {
    return ElectronApi.call('folders.get', {})
  },
})
