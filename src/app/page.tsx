// Quanby Case Management Platform – Root Landing Page
// Shows hero if not logged in, redirects to /dashboard if session cookie exists

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MOCK_USER_COOKIE, DEMO_USERS } from '@/lib/auth'
import { ComplianceBadgeRow } from '@/components/layout/ComplianceBadge'

export default async function RootPage() {
  // Server-side cookie check
  const cookieStore = await cookies()
  const userId = cookieStore.get(MOCK_USER_COOKIE)?.value
  if (userId && DEMO_USERS.find((u) => u.id === userId)) {
    redirect('/dashboard')
  }

  // Landing hero (not logged in)
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#0F172A]">
      {/* ── Gradient orbs ─────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-blue-800/20 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-indigo-900/20 blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-3">
          <img src="/qlegal-logo.png" alt="QLegal" className="h-9 w-9 rounded-lg object-contain" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">Quanby Legal</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
              Case Management
            </span>
          </div>
        </div>
        <Link
          href="/sign-in"
          className="rounded-lg border border-blue-500/40 bg-blue-600/10 px-4 py-2 text-sm font-semibold text-blue-300 transition-all hover:border-blue-400 hover:bg-blue-600/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          Sign In
        </Link>
      </header>

      {/* ── Hero content ──────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:px-10">
        {/* SC compliance pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-inner">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" aria-hidden="true" />
          Supreme Court e-Rules Compliant Platform
        </div>

        {/* Headline */}
        <h1 className="mb-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
          Philippine Government-Grade{' '}
          <span className="text-gradient-brand">Legal Case Management</span>
        </h1>

        {/* Subheadline */}
        <p className="mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg text-balance">
          Enterprise-class case management, contract AI, e-notarization, and client intake —
          fully compliant with RA 10173, NIST SP 800-53, and Philippine court electronic filing
          standards.
        </p>

        {/* CTA */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/40 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] active:scale-95"
        >
          Enter Demo
          <svg
            className="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Compliance badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {[
            { label: 'RA 10173', sub: 'Data Privacy Act' },
            { label: 'NIST 800-53', sub: 'Security Controls' },
            { label: 'SC e-Rules', sub: 'Court Compliance' },
            { label: 'ISO 27001', sub: 'Info Security' },
            { label: 'OWASP Top 10', sub: 'App Security' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex flex-col items-center rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-center backdrop-blur-sm"
            >
              <span className="text-xs font-bold text-amber-400">{badge.label}</span>
              <span className="mt-0.5 text-[10px] text-slate-400">{badge.sub}</span>
            </div>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
          {[
            {
              icon: '⚖️',
              title: 'Case Management',
              desc: 'Full lifecycle tracking for all Philippine court levels',
            },
            {
              icon: '🤖',
              title: 'Contract AI Agent',
              desc: 'Automated contract review and risk analysis',
            },
            {
              icon: '🔏',
              title: 'e-Notarization',
              desc: 'SC-compliant electronic document notarization',
            },
            {
              icon: '🛡️',
              title: 'Data Privacy',
              desc: 'RA 10173 and NPC-compliant data handling',
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-blue-500/30 hover:bg-white/8"
            >
              <div className="mb-3 text-2xl">{feat.icon}</div>
              <h3 className="mb-1 text-sm font-bold text-white">{feat.title}</h3>
              <p className="text-xs leading-relaxed text-slate-400">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 flex items-center justify-center border-t border-white/5 px-6 py-5 text-xs text-slate-500">
        © {new Date().getFullYear()} Quanby Case Management Platform · Demo Environment ·
        All rights reserved
      </footer>
    </main>
  )
}

// ─── Internal icon ─────────────────────────────────────────────────────────────

function ScalesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
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
