import { selector } from 'recoil'
import ElectronApi from 'services/ElectronApi'

export default selector({
  key: 'applications.get',
  get: () => {
    const applications = ElectronApi.call('applications.get', {})
    return applications.map((application: any) =>
      application.replace('.app', '')
    )
  },
})
