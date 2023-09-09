import * as Yup from 'yup'

import validURL from 'renderer/helpers/validUrl'

export const TerminalSchema = Yup.object().shape({
  id: Yup.string().required(),
  command: Yup.string().required(),
})

export const BrowserSchema = Yup.object().shape({
  id: Yup.string().required(),
  application: Yup.string().required(),
  url: Yup.string()
    .required()
    .test('is-valid-url', 'Invalid URL format', (value: string) => {
      if (!value) return false
      return validURL(value)
    }),
})

export default Yup.object({
  name: Yup.string().required(),
  path: Yup.string().required(),
  enableDocker: Yup.boolean().nullable(),
  enableDockerCompose: Yup.boolean().nullable(),
  enableDockerContainers: Yup.boolean().nullable(),
  containers: Yup.array().of(Yup.string()).nullable(),
  terminals: Yup.array().of(TerminalSchema).nullable(),
  browsers: Yup.array().of(BrowserSchema).nullable(),
})
