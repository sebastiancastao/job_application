'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { updateJobOfferAction, deleteJobOfferAction } from './actions'
import { initialCreateJobOfferFormState } from './types'
import type { JobOffer } from './types'

const employmentTypes = ['Full-Time', 'Part-Time', 'Seasonal', 'Contract']

export function JobOfferCard({ offer }: { offer: JobOffer }) {
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Delete "${offer.title}"? This cannot be undone.`)) return
    setDeleting(true)
    await deleteJobOfferAction(offer.id)
    router.refresh()
  }

  return (
    <>
      <article className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">{offer.title}</h3>
            {offer.category && (
              <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                {offer.category}
              </span>
            )}
            <p className="mt-1 text-sm text-zinc-500">{offer.location}</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {offer.employmentType}
          </span>
        </div>

        <p className="text-sm leading-6 text-zinc-600">{offer.summary}</p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <p className="text-xs text-zinc-400">
            Posted{' '}
            {new Date(offer.postedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-200"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <EditModal offer={offer} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

function EditModal({ offer, onClose }: { offer: JobOffer; onClose: () => void }) {
  const boundAction = updateJobOfferAction.bind(null, offer.id)
  const [state, formAction, isPending] = useActionState(boundAction, initialCreateJobOfferFormState)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (state.status !== 'success') return
    router.refresh()
    onClose()
  }, [state.status, state.updatedAt, router, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Edit job offer</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            ✕
          </button>
        </div>

        <form ref={formRef} action={formAction} className="grid gap-4 max-h-[70vh] overflow-y-auto pr-1">
          <Field label="Job title" name="title" defaultValue={offer.title} required />
          <Field label="Category" name="category" defaultValue={offer.category} placeholder="e.g. Moving, Driving, Warehouse" required />
          <Field label="Location" name="location" defaultValue={offer.location} required />

          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Employment type
            <select
              name="employment_type"
              defaultValue={offer.employmentType}
              required
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            >
              {employmentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Description
            <textarea
              name="description"
              rows={6}
              required
              defaultValue={offer.description}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Summary <span className="font-normal text-zinc-400">(short teaser)</span>
            <textarea
              name="summary"
              rows={3}
              required
              defaultValue={offer.summary}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </label>

          {state.message ? (
            <p className={state.status === 'error'
              ? 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
              : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
            }>
              {state.message}
            </p>
          ) : null}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label, name, defaultValue, required, placeholder,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <input
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
      />
    </label>
  )
}
