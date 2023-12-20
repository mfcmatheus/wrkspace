import { gql } from '@apollo/client'

export default gql`
  query Workspace($id: ID!) {
    Workspace(id: $id) {
      id
      name
      editor
      favorite
      folder {
        id
        name
      }
      browsers {
        id
        url
      }
      docker {
        enableSail
        enableComposer
        enableContainers
      }
      features {
        enableEditor
        enableDocker
      }
      terminals {
        id
        command
      }
      created_at
      updated_at
    }
  }
`
