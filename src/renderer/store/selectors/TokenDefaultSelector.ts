import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'

export default selector({
  key: 'token.get',
  get: () => {
    return ElectronApi.call('user.token', {})
  },
})
