import * as Yup from 'yup'

export const TerminalSchema = Yup.object().shape({
  id: Yup.string().required(),
  command: Yup.string().required(),
})

export default Yup.object({
  name: Yup.string().required(),
  path: Yup.string().required(),
  enableDocker: Yup.boolean().nullable(),
  enableDockerCompose: Yup.boolean().nullable(),
  enableDockerContainers: Yup.boolean().nullable(),
  containers: Yup.array().of(Yup.string()).nullable(),
  terminals: Yup.array().of(TerminalSchema).nullable(),
})
