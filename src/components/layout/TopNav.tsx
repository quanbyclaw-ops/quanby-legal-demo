// Quanby Case Management Platform – Top Navigation Bar

'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  Menu,
  ChevronDown,
  ChevronRight,
  User,
  LogOut,
  Settings,
  HelpCircle,
  Shield,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DEMO_USERS, type MockUser } from '@/lib/auth-client'
import type { SessionUser } from '@/types'
import { NotificationPanel } from '@/components/notifications/NotificationPanel'

// ─── Mock notifications ───────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Case deadline approaching',
    description: 'QLP-2025-CIV-042 due in 3 days',
    time: '5m ago',
    read: false,
    severity: 'warning',
  },
  {
    id: '2',
    title: 'Contract analysis complete',
    description: 'Service Agreement v2 ready for review',
    time: '1h ago',
    read: false,
    severity: 'info',
  },
  {
    id: '3',
    title: 'New client intake submitted',
    description: 'Pedro Garcia – Civil case inquiry',
    time: '2h ago',
    read: true,
    severity: 'info',
  },
]

// ─── Breadcrumb segment labels ─────────────────────────────────────────────────

const SEGMENT_LABELS: Record<string, string> = {
  dashboard:    'Dashboard',
  cases:        'Cases',
  intake:       'Client Intake',
  contracts:    'Contract Agent',
  documents:    'Documents',
  notarization: 'Notarization',
  analytics:    'Analytics',
  portal:       'Client Portal',
  settings:     'Settings',
  help:         'Help',
  new:          'New',
}

function useBreadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg) => ({
    label: SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
    href: '/' + segments.slice(0, segments.indexOf(seg) + 1).join('/'),
  }))
}

// ─── TopNav component ─────────────────────────────────────────────────────────

interface TopNavProps {
  onMenuClick?: () => void
  currentUser?: MockUser
  className?: string
}

export function TopNav({ onMenuClick, currentUser, className }: TopNavProps) {
  const { theme, setTheme } = useTheme()
  const breadcrumbs = useBreadcrumbs()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [searchResults, setSearchResults] = React.useState<{cases: any[], contracts: any[], documents: any[]}|null>(null)
  const [searching, setSearching] = React.useState(false)
  const searchTimerRef = React.useRef<NodeJS.Timeout|null>(null)
  const [mounted, setMounted] = React.useState(false)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length

  React.useEffect(() => { setMounted(true) }, [])

  React.useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults(null); return }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
    searchTimerRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const [casesRes, contractsRes, docsRes] = await Promise.allSettled([
          fetch(`/api/cases?search=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
          fetch(`/api/contracts?search=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
          fetch(`/api/documents?search=${encodeURIComponent(searchQuery)}`).then(r => r.json()),
        ])
        setSearchResults({
          cases: (casesRes.status === 'fulfilled' ? (casesRes.value.data || casesRes.value || []) : []).slice(0, 5),
          contracts: (contractsRes.status === 'fulfilled' ? (contractsRes.value.data || contractsRes.value || []) : []).slice(0, 5),
          documents: (docsRes.status === 'fulfilled' ? (docsRes.value.data || docsRes.value || []) : []).slice(0, 5),
        })
      } catch { setSearchResults(null) }
      setSearching(false)
    }, 300)
    return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current) }
  }, [searchQuery])

  // Use passed user or fall back to first demo user
  const user = currentUser ?? DEMO_USERS[0]

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 dark:backdrop-blur-sm',
        className
      )}
    >
      {/* ── Mobile menu trigger ──────────────────────────────────────────────── */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* ── Mobile logo (hidden on desktop since sidebar shows it) ─────────── */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-900 dark:text-white">Quanby Legal</span>
      </div>

      {/* ── Breadcrumbs (desktop) ────────────────────────────────────────────── */}
      {!searchOpen && (
        <nav
          aria-label="Breadcrumb"
          className="hidden flex-1 items-center gap-1 lg:flex"
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              )}
              <span
                className={cn(
                  'text-sm',
                  idx === breadcrumbs.length - 1
                    ? 'font-semibold text-slate-900 dark:text-white'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* ── Expandable search (desktop) ─────────────────────────────────────── */}
      {searchOpen ? (
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setSearchResults(null) } }}
              placeholder="Search cases, clients, documents…"
              className="h-9 w-full rounded-md border border-input bg-slate-50 pl-9 pr-4 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 dark:bg-slate-800"
              aria-label="Global search"
            />
            {searchQuery.trim() && searchResults && (
              <div className="absolute left-0 top-full mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900 max-h-80 overflow-y-auto z-50">
                {searching && <p className="px-4 py-3 text-xs text-slate-500">Searching...</p>}
                {!searching && searchResults.cases.length === 0 && searchResults.contracts.length === 0 && searchResults.documents.length === 0 && (
                  <p className="px-4 py-3 text-xs text-slate-500">No results found</p>
                )}
                {searchResults.cases.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cases</p>
                    {searchResults.cases.map((c: any) => (
                      <a key={c.id} href={`/cases/${c.id}`} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults(null) }}>
                        <span className="text-blue-600">⚖️</span>
                        <span className="truncate text-slate-900 dark:text-white">{c.caseNumber || c.title}</span>
                      </a>
                    ))}
                  </div>
                )}
                {searchResults.contracts.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Contracts</p>
                    {searchResults.contracts.map((c: any) => (
                      <a key={c.id} href={`/contracts/${c.id}`} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults(null) }}>
                        <span className="text-blue-600">📄</span>
                        <span className="truncate text-slate-900 dark:text-white">{c.title}</span>
                      </a>
                    ))}
                  </div>
                )}
                {searchResults.documents.length > 0 && (
                  <div>
                    <p className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Documents</p>
                    {searchResults.documents.map((d: any) => (
                      <a key={d.id} href={`/documents`} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults(null) }}>
                        <span className="text-blue-600">📁</span>
                        <span className="truncate text-slate-900 dark:text-white">{d.title || d.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setSearchOpen(false)}
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="hidden lg:flex lg:flex-1" />
      )}

      {/* ── Right actions ────────────────────────────────────────────────────── */}
      <div className="ml-auto flex items-center gap-1">
        {/* Mobile search toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          onClick={() => setSearchOpen((v) => !v)}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>

        {/* Desktop search toggle */}
        {!searchOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 lg:flex"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}

        {/* Theme toggle */}
        {mounted && <ThemeToggle theme={theme} setTheme={setTheme} />}

        {/* Notifications */}
        <NotificationPanel />

        {/* User menu */}
        <UserDropdown user={user} />
      </div>
    </header>
  )
}

// ─── Theme toggle ─────────────────────────────────────────────────────────────

function ThemeToggle({ theme, setTheme }: { theme?: string; setTheme: (t: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Toggle theme">
          {theme === 'dark' ? (
            <Moon className="h-4 w-4" />
          ) : theme === 'system' ? (
            <Monitor className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
          {theme === 'light' && <Check className="ml-auto h-3.5 w-3.5 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
          {theme === 'dark' && <Check className="ml-auto h-3.5 w-3.5 text-blue-600" />}
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Notifications dropdown ───────────────────────────────────────────────────

function NotificationsDropdown({ unreadCount }: { unreadCount: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="animate-badge-pulse absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold leading-none text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
              {unreadCount} new
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MOCK_NOTIFICATIONS.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className={cn(
              'flex flex-col items-start gap-0.5 py-2.5',
              !n.read && 'bg-blue-50/60 dark:bg-blue-900/10'
            )}
          >
            <div className="flex w-full items-start gap-2">
              {!n.read && (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
              )}
              <span
                className={cn(
                  'flex-1 text-sm leading-tight',
                  !n.read ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium'
                )}
              >
                {n.title}
              </span>
              <span className="shrink-0 text-[10px] text-slate-400">{n.time}</span>
            </div>
            <p
              className={cn(
                'text-xs leading-snug text-slate-500 dark:text-slate-400',
                !n.read && 'pl-3.5'
              )}
            >
              {n.description}
            </p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── User dropdown ────────────────────────────────────────────────────────────

function UserDropdown({ user }: { user: MockUser }) {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()

  const displayName =
    user.role === 'ADMIN' || user.role === 'LAWYER'
      ? `Atty. ${user.lastName}`
      : `${user.firstName} ${user.lastName}`

  const fullName =
    user.role === 'ADMIN' || user.role === 'LAWYER'
      ? `Atty. ${user.firstName} ${user.lastName}`
      : `${user.firstName} ${user.lastName}`

  async function switchUser(userId: string) {
    await fetch('/api/auth/set-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    window.location.reload()
  }

  async function signOut() {
    await fetch('/api/auth/set-user', { method: 'DELETE' }).catch(() => {})
    window.location.href = '/sign-in'
  }

  const ROLE_COLORS: Record<string, string> = {
    ADMIN:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    LAWYER:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PARALEGAL: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    CLIENT:    'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 items-center gap-2 rounded-lg px-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="User account menu"
        >
          {/* Avatar circle */}
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-[11px] font-bold text-white shadow-inner">
            {initials}
          </div>
          <span className="hidden max-w-[120px] truncate font-medium text-slate-700 dark:text-slate-200 md:block">
            {displayName}
          </span>
          <ChevronDown className="hidden h-3 w-3 shrink-0 text-slate-400 md:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        {/* User info header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-xs font-bold text-white">
                {initials}
              </div>
              <div className="flex min-w-0 flex-col">
                <p className="truncate text-sm font-semibold text-foreground">{fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', ROLE_COLORS[user.role])}>
                {user.role}
              </span>
              {user.barNumber && (
                <span className="text-[10px] text-blue-600 dark:text-blue-400">
                  IBP #{user.barNumber}
                </span>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          Help &amp; Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Switch User sub-menu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <User className="mr-2 h-4 w-4" />
            Switch Demo User
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Demo Accounts
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {DEMO_USERS.map((demoUser) => {
              const isActive = demoUser.id === user.id
              const dInitials = `${demoUser.firstName[0]}${demoUser.lastName[0]}`.toUpperCase()
              return (
                <DropdownMenuItem
                  key={demoUser.id}
                  onClick={() => switchUser(demoUser.id)}
                  className={cn('flex items-center gap-2.5', isActive && 'bg-blue-50 dark:bg-blue-900/20')}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-[10px] font-bold text-white">
                    {dInitials}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-xs font-medium">{demoUser.name}</span>
                    <span className="text-[10px] text-muted-foreground">{demoUser.role}</span>
                  </div>
                  {isActive && (
                    <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-blue-600" />
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={signOut}
          className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:text-red-400 dark:focus:bg-red-900/20"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
