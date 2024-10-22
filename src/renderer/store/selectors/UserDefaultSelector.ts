// import { graphql } from 'graphql'
import { graphQLSelector } from 'recoil-relay'
import { graphql } from 'react-relay'
import RelayEnvironment from 'renderer/graphql/RelayEnvironment'
import TokenAtom from '../atoms/TokenAtom'

export default graphQLSelector({
  key: 'user.get',
  environment: RelayEnvironment,
  query: graphql`
    query UserDefaultSelectorQuery {
      Me {
        name
      }
    }
  `.default,
  variables: () => ({}),
  mapResponse: (data) => data?.Me?.name,
})
