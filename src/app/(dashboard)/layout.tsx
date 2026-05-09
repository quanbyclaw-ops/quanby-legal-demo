// Quanby Case Management Platform – Dashboard Shell Layout
// Responsive: sidebar (260px desktop / icon-only tablet / drawer mobile) + TopNav + content

'use client'

import * as React from 'react'
import { Sidebar, MobileSidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { DEMO_USERS, MOCK_USER_COOKIE } from '@/lib/auth-client'
import type { MockUser } from '@/lib/auth-client'

// ─── Client wrapper (handles mobile menu state + user resolution) ──────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [currentUser, setCurrentUser] = React.useState<MockUser>(DEMO_USERS[0])

  // Resolve current user from cookie on mount (client-side)
  React.useEffect(() => {
    const cookies = document.cookie.split(';').reduce(
      (acc, c) => {
        const [k, v] = c.trim().split('=')
        acc[k] = decodeURIComponent(v ?? '')
        return acc
      },
      {} as Record<string, string>
    )
    const userId = cookies[MOCK_USER_COOKIE]
    if (userId) {
      const found = DEMO_USERS.find((u) => u.id === userId)
      if (found) setCurrentUser(found)
    }
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* ── Desktop sidebar (hidden on mobile) ─────────────────────────────── */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* ── Mobile sidebar drawer ───────────────────────────────────────────── */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* ── Main content column ─────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Sticky TopNav */}
        <TopNav
          onMenuClick={() => setMobileOpen(true)}
          currentUser={currentUser}
        />

        {/* Scrollable page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden"
          tabIndex={-1}
        >
          <div className="animate-fade-in p-4 sm:p-6">
            {children}
          </div>
          <div className="py-3 text-center text-xs text-gray-400 dark:text-slate-600 border-t border-gray-100 dark:border-slate-800">
            Powered by <span className="font-semibold text-gray-500 dark:text-slate-500">Quanby AI</span> · v1.0.0 Demo
          </div>
        </main>
      </div>
    </div>
  )
}
