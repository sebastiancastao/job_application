'use server'

import { revalidatePath } from 'next/cache'

import { createJobOffer } from '@/lib/job-offers'

import type { CreateJobOfferFormState } from './types'

const requiredFields = [
  'title',
  'location',
  'employmentType',
  'summary',
] as const

function readValue(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? ''
}

export async function createJobOfferAction(
  _previousState: CreateJobOfferFormState,
  formData: FormData
): Promise<CreateJobOfferFormState> {
  const payload = {
    title: readValue(formData, 'title'),
    location: readValue(formData, 'location'),
    employmentType: readValue(formData, 'employment_type'),
    compensation: readValue(formData, 'compensation'),
    summary: readValue(formData, 'summary'),
  }

  const hasMissingFields = requiredFields.some((field) => !payload[field])

  if (hasMissingFields) {
    return {
      status: 'error',
      message: 'Complete all required fields before submitting.',
      updatedAt: Date.now(),
    }
  }

  try {
    await createJobOffer(payload)
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? `Could not save the job offer: ${error.message}`
          : 'Could not save the job offer.',
      updatedAt: Date.now(),
    }
  }

  revalidatePath('/')

  return {
    status: 'success',
    message: 'Job offer published successfully.',
    updatedAt: Date.now(),
  }
}
