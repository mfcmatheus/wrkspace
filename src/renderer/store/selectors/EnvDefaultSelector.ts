import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'

export default selector({
  key: 'env.get',
  get: () => {
    return ElectronApi.call('env.get', {})
  },
})
