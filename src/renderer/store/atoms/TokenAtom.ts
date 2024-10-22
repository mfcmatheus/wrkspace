import { atom } from 'recoil'
import { ipcRenderer } from 'renderer/hooks/useIpc'
import TokenDefaultSelector from '../selectors/TokenDefaultSelector'

export default atom({
  key: 'token',
  default: TokenDefaultSelector,
  effects: [
    ({ setSelf }) => {
      const handler = ipcRenderer.on('token.reload', (token: string) => {
        if (!token) return localStorage.removeItem('token')
        localStorage.setItem('token', token)
        setSelf(token)
        return token
      })

      return () => {
        ipcRenderer.removeListener('token.reload', handler)
      }
    },
  ],
})
