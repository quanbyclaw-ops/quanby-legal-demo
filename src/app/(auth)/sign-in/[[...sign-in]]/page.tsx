// Quanby Case Management Platform – Sign In Page (Demo Auth)
// Centered card on navy gradient; select a demo account to proceed

'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { DEMO_USERS, type MockUser } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

// ─── Role badge colors ─────────────────────────────────────────────────────────

const ROLE_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  ADMIN:     { bg: 'bg-purple-100',  text: 'text-purple-700',  label: 'Administrator' },
  LAWYER:    { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Lawyer' },
  PARALEGAL: { bg: 'bg-teal-100',    text: 'text-teal-700',    label: 'Paralegal' },
  CLIENT:    { bg: 'bg-slate-100',   text: 'text-slate-700',   label: 'Client' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState<string | null>(null)
  const [error, setError]     = React.useState<string | null>(null)

  async function handleSelect(user: MockUser) {
    if (loading) return
    setLoading(user.id)
    setError(null)
    try {
      const res = await fetch('/api/auth/set-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      if (!res.ok) throw new Error('Failed to authenticate')
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Authentication failed. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0F172A] px-4 py-12">
      {/* ── Background decoration ──────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-800/20 blur-[100px]" />
        <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-indigo-700/15 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <img src="/qlegal-logo.png" alt="QLegal" className="h-14 w-14 rounded-2xl object-contain" />
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">Quanby Case Management Platform</h1>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-blue-400">
              Demo Environment
            </p>
          </div>
        </div>

        {/* Card body */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-lg font-bold text-white">Select Demo Account</h2>
            <p className="mt-1 text-sm text-slate-400">
              Choose a role to explore the platform. No credentials required.
            </p>
          </div>

          <div className="p-4 space-y-2">
            {DEMO_USERS.map((user) => {
              const badge  = ROLE_BADGE[user.role] ?? ROLE_BADGE['CLIENT']
              const isLoading = loading === user.id
              const initials  = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

              return (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  disabled={!!loading}
                  className={cn(
                    'group flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                    isLoading
                      ? 'cursor-wait border-blue-500/50 bg-blue-600/10'
                      : 'cursor-pointer border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-600/10 active:scale-[0.99]',
                    loading && !isLoading && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-label={`Sign in as ${user.name}`}
                >
                  {/* Avatar */}
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-900 text-sm font-bold text-white shadow-md">
                    {isLoading ? (
                      <LoadingSpinner />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </span>
                      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold', badge.bg, badge.text)}>
                        {badge.label}
                      </span>
                    </div>
                    <span className="truncate text-xs text-slate-400">{user.email}</span>
                    {user.barNumber && (
                      <span className="text-[10px] text-blue-400">IBP Bar No. {user.barNumber}</span>
                    )}
                  </div>

                  {/* Arrow */}
                  <div
                    className={cn(
                      'ml-auto shrink-0 transition-transform',
                      !loading && 'group-hover:translate-x-0.5'
                    )}
                    aria-hidden="true"
                  >
                    <svg className="h-4 w-4 text-slate-500 group-hover:text-blue-400" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-4 mb-4 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Footer note */}
          <div className="border-t border-white/10 px-6 py-4">
            <p className="text-center text-xs text-white/90 font-medium">
              Demo mode — no real credentials required.
            </p>
            <p className="mt-1 text-center text-xs text-white/70">
              RA 10173-compliant authentication enforced in production.
            </p>
          </div>
        </div>

        {/* Compliance badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['SC e-Rules', 'RA 10173', 'NIST 800-53', 'ISO 27001'].map((s) => (
            <span
              key={s}
              className="rounded-full border border-amber-400/60 bg-amber-400/20 px-2.5 py-1 text-[10px] font-semibold text-amber-300"
            >
              {s}
            </span>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} Quanby Case Management Platform
        </p>
      </div>
    </div>
  )
}

// ─── Inline SVG icons ──────────────────────────────────────────────────────────

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3V21M12 3L6 8M12 3L18 8M6 8L4 17H8L6 8ZM18 8L16 17H20L18 8ZM4 21H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
