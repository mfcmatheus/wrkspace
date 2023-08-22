import * as Yup from 'yup'

export const TerminalSchema = Yup.object().shape({
  id: Yup.string().required(),
  command: Yup.string().required(),
})

export default Yup.object({
  name: Yup.string().required(),
  path: Yup.string().required(),
  enableDocker: Yup.boolean().required(),
  enableDockerCompose: Yup.boolean(),
  enableDockerContainers: Yup.boolean(),
  terminals: Yup.array().of(TerminalSchema).nullable(),
})
