import { gql } from '@apollo/client'

export default gql`
  mutation Folder($folder: FolderInput) {
    Folder(data: $folder) {
      id
      updated_at
    }
  }
`
