export type JobApplication = {
  id: number
  job_offer_id: string | null
  first_name: string
  last_name: string
  phone: string
  email: string
  zip_code: string
  position: string
  start_date: string
  employment_type: string
  experience: string
  drivers_license: string
  background_check: string
  bio: string
  cv_url: string | null
  consent: boolean
  submitted_at: string
}

export type JobOffer = {
  id: string
  title: string
  location: string
  employmentType: string
  compensation: string
  summary: string
  postedAt: string
}

export type NewJobOfferInput = Omit<JobOffer, 'id' | 'postedAt'>

export type CreateJobOfferFormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  updatedAt: number
}

export const initialCreateJobOfferFormState: CreateJobOfferFormState = {
  status: 'idle',
  message: '',
  updatedAt: 0,
}
