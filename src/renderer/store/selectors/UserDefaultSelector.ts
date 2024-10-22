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
  variables: ({ get }) => {
    const token = get(TokenAtom)
    if (!token) {
      return null
    }
    return {
      tokenDependency: token,
    }
  },
  // Update the mapResponse function
  mapResponse: (data) => (data && data.Me ? data.Me : null),
  default: null, // Set a default value
})
