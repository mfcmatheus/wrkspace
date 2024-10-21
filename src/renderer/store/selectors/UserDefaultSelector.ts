import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'

export default selector({
  key: 'user.get',
  get: () => {
    return ElectronApi.call('user.get', {})
  },
})
