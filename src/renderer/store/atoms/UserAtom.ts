import { atom } from 'recoil'
import User from 'renderer/@types/User'
import UserDefaultSelector from '../selectors/UserDefaultSelector'

export default atom({
  key: 'user',
  default: UserDefaultSelector as User,
})
