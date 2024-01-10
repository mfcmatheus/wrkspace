import UserPlan from "./UserPlan"

export default interface User {
  id: string
  name: string
  email: string
  token: string
  plans: {
    personal: UserPlan
  }
}
