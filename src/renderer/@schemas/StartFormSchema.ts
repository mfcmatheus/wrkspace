import * as Yup from 'yup'

export default Yup.object({
  defaultPath: Yup.string().required('Default path is required'),
})
