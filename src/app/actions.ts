'use server'

import { revalidatePath } from 'next/cache'

import { createJobOffer, updateJobOffer, deleteJobOffer } from '@/lib/job-offers'

import type { CreateJobOfferFormState } from './types'

const requiredFields = [
  'title',
  'category',
  'description',
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
    category: readValue(formData, 'category'),
    description: readValue(formData, 'description'),
    location: readValue(formData, 'location'),
    employmentType: readValue(formData, 'employment_type'),
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

export async function updateJobOfferAction(
  id: string,
  _previousState: CreateJobOfferFormState,
  formData: FormData
): Promise<CreateJobOfferFormState> {
  const payload = {
    title: readValue(formData, 'title'),
    category: readValue(formData, 'category'),
    description: readValue(formData, 'description'),
    location: readValue(formData, 'location'),
    employmentType: readValue(formData, 'employment_type'),
    summary: readValue(formData, 'summary'),
  }

  const hasMissingFields = requiredFields.some((field) => !payload[field])
  if (hasMissingFields) {
    return {
      status: 'error',
      message: 'Complete all required fields before saving.',
      updatedAt: Date.now(),
    }
  }

  try {
    await updateJobOffer(id, payload)
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof Error
          ? `Could not update the job offer: ${error.message}`
          : 'Could not update the job offer.',
      updatedAt: Date.now(),
    }
  }

  revalidatePath('/')
  return { status: 'success', message: 'Job offer updated.', updatedAt: Date.now() }
}

export async function deleteJobOfferAction(id: string): Promise<void> {
  await deleteJobOffer(id)
  revalidatePath('/')
}
