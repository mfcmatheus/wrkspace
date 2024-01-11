import * as Yup from 'yup'

const folderSchema = Yup.object({
  id: Yup.string().required(),
  name: Yup.string().required('Folder name is required'),
  path: Yup.string().required('Folder path is required'),
})

export default Yup.object({
  folders: Yup.array().of(folderSchema).nullable(),
  defaultPath: Yup.string().required(),
})
