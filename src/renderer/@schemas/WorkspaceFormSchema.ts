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

export const DockerSchema = Yup.object().shape({
  enableComposer: Yup.boolean().nullable(),
  enableContainers: Yup.boolean().nullable(),
  enableSail: Yup.boolean().nullable(),
})

export const FeaturesSchema = Yup.object().shape({
  enableEditor: Yup.boolean().nullable(),
  enableDocker: Yup.boolean().nullable(),
})

export const InstallationEnvVarSchema = Yup.object().shape({
  id: Yup.string().required(),
  key: Yup.string().required(),
  value: Yup.string().required(),
})

export const InstallationCommandSchema = Yup.object().shape({
  id: Yup.string().required(),
  command: Yup.string().required(),
})

export const InstallationSchema = Yup.object().shape({
  commands: Yup.array().of(InstallationCommandSchema).nullable(),
  variables: Yup.array().of(InstallationEnvVarSchema).nullable(),
})

export default Yup.object({
  name: Yup.string().required(),
  path: Yup.string().required(),
  editor: Yup.string().nullable(),
  docker: DockerSchema,
  terminals: Yup.array().of(TerminalSchema).nullable(),
  browsers: Yup.array().of(BrowserSchema).nullable(),
  features: FeaturesSchema,
  installation: InstallationSchema,
  repo: Yup.string()
    .nullable()
    .test(
      'is-valid-url',
      'Invalid URL format',
      (value: string | null | undefined) => {
        if (!value) return true
        return validURL(value)
      }
    ),
})
