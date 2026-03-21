import { supabaseAdmin } from '@/lib/supabase'

import type { JobOffer, NewJobOfferInput } from '@/app/types'

type JobOfferRow = {
  id: string
  title: string
  category: string | null
  description: string | null
  location: string
  employment_type: string
  summary: string
  created_at: string
}

function isMissingTableError(error: { code?: string; message?: string }) {
  if (error.code === '42P01' || error.code === 'PGRST205') {
    return true
  }

  return (
    error.message?.includes('job_offers') === true &&
    (error.message.includes('does not exist') ||
      error.message.includes('schema cache'))
  )
}

function toJobOffer(row: JobOfferRow): JobOffer {
  return {
    id: row.id,
    title: row.title,
    category: row.category ?? '',
    description: row.description ?? '',
    location: row.location,
    employmentType: row.employment_type,
    summary: row.summary,
    postedAt: row.created_at,
  }
}

export async function getJobOffers() {
  const { data, error } = await supabaseAdmin
    .from('job_offers')
    .select(
      'id, title, category, description, location, employment_type, summary, created_at'
    )
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    if (isMissingTableError(error)) {
      return []
    }

    throw new Error(error.message)
  }

  return (data ?? []).map(toJobOffer)
}

export async function createJobOffer(input: NewJobOfferInput) {
  const { data, error } = await supabaseAdmin
    .from('job_offers')
    .insert({
      title: input.title,
      category: input.category || null,
      description: input.description || null,
      location: input.location,
      employment_type: input.employmentType,
      summary: input.summary,
    })
    .select(
      'id, title, category, description, location, employment_type, summary, created_at'
    )
    .single()

  if (error) {
    if (isMissingTableError(error)) {
      throw new Error(
        'The job_offers table does not exist yet. Apply the SQL migration in supabase/migrations first.'
      )
    }

    throw new Error(error.message)
  }

  return toJobOffer(data)
}

export async function updateJobOffer(id: string, input: NewJobOfferInput) {
  const { data, error } = await supabaseAdmin
    .from('job_offers')
    .update({
      title: input.title,
      category: input.category || null,
      description: input.description || null,
      location: input.location,
      employment_type: input.employmentType,
      summary: input.summary,
    })
    .eq('id', id)
    .select(
      'id, title, category, description, location, employment_type, summary, created_at'
    )
    .single()

  if (error) throw new Error(error.message)
  return toJobOffer(data)
}

export async function deleteJobOffer(id: string) {
  const { error } = await supabaseAdmin
    .from('job_offers')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
