import { gql } from '@apollo/client'

export default gql`
  query Me {
    Me {
      id
      name
      email
      token
      plans {
        personal {
          ends_at
          created_at
        }
      }
    }
  }
`
