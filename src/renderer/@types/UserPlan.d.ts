export default interface UserPlan {
	id: string | number
	type: string
	stripe_id: string
	stripe_status: string
	stripe_price: string
	quantity: number
	trial_ends_at: string
	ends_at: string
	created_at: string
	updated_at: string
}
