import { AddJobForm } from './add-job-form'
import type { JobApplication, JobOffer } from './types'

import { getJobOffers } from '@/lib/job-offers'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [{ data, error }, offers] = await Promise.all([
    supabaseAdmin
      .from('job_applications')
      .select('*')
      .order('submitted_at', { ascending: false }),
    getJobOffers(),
  ])

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-100 p-8">
        <p className="text-red-500">Error loading applications: {error.message}</p>
      </main>
    )
  }

  const applications: JobApplication[] = data ?? []
  const jobOffers: JobOffer[] = offers
  const jobOffersById = new Map(jobOffers.map((offer) => [offer.id, offer]))

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[26rem_minmax(0,1fr)]">
        <AddJobForm />

        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-bold text-zinc-900">
              Hiring Dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Publish job offers and review incoming applications from the same screen.
            </p>
          </div>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
                  Open Jobs
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
                  Job Offers{' '}
                  <span className="ml-2 text-base font-normal text-zinc-500">
                    ({jobOffers.length})
                  </span>
                </h2>
              </div>
            </div>

            {jobOffers.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-200">
                <p className="text-zinc-500">No job offers published yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {jobOffers.map((offer) => (
                  <article
                    key={offer.id}
                    className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-zinc-900">
                          {offer.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">{offer.location}</p>
                      </div>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        {offer.employmentType}
                      </span>
                    </div>

                    {offer.compensation ? (
                      <p className="text-sm font-medium text-zinc-700">
                        Compensation: {offer.compensation}
                      </p>
                    ) : null}

                    <p className="text-sm leading-6 text-zinc-600">{offer.summary}</p>

                    <p className="mt-auto text-xs text-zinc-400">
                      Posted{' '}
                      {new Date(offer.postedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
                Applicants
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-900">
                Job Applications{' '}
                <span className="ml-2 text-base font-normal text-zinc-500">
                  ({applications.length})
                </span>
              </h2>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-zinc-200">
                <p className="text-zinc-500">No applications yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {applications.map((app) => {
                  const appliedJob =
                    app.job_offer_id ? jobOffersById.get(app.job_offer_id) : undefined
                  const appliedJobTitle = appliedJob?.title ?? app.position

                  return (
                    <div
                      key={app.id}
                      className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
                    >
                      {/* Job offer banner */}
                      <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 ring-1 ring-amber-200">
                        <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                        <span className="text-xs font-semibold text-amber-800">{appliedJobTitle}</span>
                        {appliedJob?.location ? (
                          <span className="ml-auto text-xs text-amber-600">{appliedJob.location}</span>
                        ) : null}
                      </div>

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-zinc-800">
                            {app.first_name} {app.last_name}
                          </h2>
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {app.employment_type}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm text-zinc-600">
                        <p>{app.email}</p>
                        <p>{app.phone}</p>
                        <p>ZIP: {app.zip_code}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <Detail label="Start date" value={app.start_date} />
                        <Detail label="Experience" value={app.experience} />
                        <Detail label="Driver's license" value={app.drivers_license} />
                        <Detail label="Background check" value={app.background_check} />
                      </div>

                      {app.bio ? (
                        <p className="line-clamp-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm italic text-zinc-600">
                          &ldquo;{app.bio}&rdquo;
                        </p>
                      ) : null}

                      {/* CV actions */}
                      {app.cv_url ? (
                        <div className="flex gap-2">
                          <a
                            href={app.cv_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            View CV
                          </a>
                          <a
                            href={app.cv_url}
                            download
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download CV
                          </a>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400 italic">No CV uploaded</p>
                      )}

                      <p className="mt-auto text-xs text-zinc-400">
                        Submitted{' '}
                        {new Date(app.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-zinc-50 px-2 py-1">
      <p className="text-zinc-400">{label}</p>
      <p className="font-medium text-zinc-700">{value}</p>
    </div>
  )
}
