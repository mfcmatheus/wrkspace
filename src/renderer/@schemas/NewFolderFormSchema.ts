import * as Yup from 'yup'

export default Yup.object().shape({
  name: Yup.string().required('Folder name is required'),
  path: Yup.string().required('Folder path is required'),
})
