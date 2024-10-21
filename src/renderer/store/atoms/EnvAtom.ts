import { atom } from 'recoil'
import EnvDefaultSelector from '../selectors/EnvDefaultSelector'

export default atom({
  key: 'env',
  default: EnvDefaultSelector,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('env', JSON.stringify(newValue))
      })
    },
  ],
})
