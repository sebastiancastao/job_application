import { supabaseAdmin } from '@/lib/supabase'

type JobApplication = {
  id: number
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
  consent: boolean
  submitted_at: string
}

export default async function Home() {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-zinc-100 p-8">
        <p className="text-red-500">Error loading applications: {error.message}</p>
      </main>
    )
  }

  const applications: JobApplication[] = data ?? []

  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-zinc-800">
        Job Applications{' '}
        <span className="ml-2 text-lg font-normal text-zinc-500">
          ({applications.length})
        </span>
      </h1>

      {applications.length === 0 ? (
        <p className="text-zinc-500">No applications yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-800">
                    {app.first_name} {app.last_name}
                  </h2>
                  <p className="text-sm text-zinc-500">{app.position}</p>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {app.employment_type}
                </span>
              </div>

              {/* Contact */}
              <div className="space-y-1 text-sm text-zinc-600">
                <p>{app.email}</p>
                <p>{app.phone}</p>
                <p>ZIP: {app.zip_code}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Detail label="Start date" value={app.start_date} />
                <Detail label="Experience" value={app.experience} />
                <Detail label="Driver's license" value={app.drivers_license} />
                <Detail label="Background check" value={app.background_check} />
              </div>

              {/* Bio */}
              {app.bio && (
                <p className="line-clamp-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm italic text-zinc-600">
                  "{app.bio}"
                </p>
              )}

              {/* Footer */}
              <p className="mt-auto text-xs text-zinc-400">
                Submitted {new Date(app.submitted_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
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
