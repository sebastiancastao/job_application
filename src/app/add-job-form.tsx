'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { createJobOfferAction } from './actions'
import { initialCreateJobOfferFormState } from './types'

const employmentTypes = ['Full-Time', 'Part-Time', 'Seasonal', 'Contract']

export function AddJobForm() {
  const [state, formAction, isPending] = useActionState(
    createJobOfferAction,
    initialCreateJobOfferFormState
  )
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (state.status !== 'success') {
      return
    }

    formRef.current?.reset()
    router.refresh()
  }, [router, state.status, state.updatedAt])

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <div className="mb-6 space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-400">
          New Offer
        </p>
        <h2 className="text-2xl font-semibold text-zinc-900">
          Publish a new job offer
        </h2>
        <p className="text-sm leading-6 text-zinc-500">
          Add a posting that appears in the open-jobs list on this page.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="grid gap-4">
        <div className="grid gap-4">
          <FormField label="Job title" name="title" required />
          <FormField label="Location" name="location" required />
          <SelectField
            label="Employment type"
            name="employment_type"
            options={employmentTypes}
            required
          />
          <FormField label="Compensation" name="compensation" />
        </div>

        <label className="grid gap-2 text-sm font-medium text-zinc-700">
          Summary
          <textarea
            name="summary"
            rows={6}
            required
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
            placeholder="Describe the role, responsibilities, or requirements."
          />
        </label>

        {state.message ? (
          <p
            className={
              state.status === 'error'
                ? 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                : 'rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'
            }
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isPending ? 'Publishing offer...' : 'Publish job offer'}
        </button>
      </form>
    </section>
  )
}

function FormField({
  label,
  name,
  required,
  type = 'text',
}: {
  label: string
  name: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
  required,
}: {
  label: string
  name: string
  options: string[]
  required?: boolean
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-700">
      {label}
      <select
        name={name}
        required={required}
        defaultValue=""
        className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:bg-white"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
