'use client'

// Quanby Case Management Platform – Settings Page
// User profile, notification preferences, theme, demo account switcher, system info

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import {
  User,
  Bell,
  Palette,
  Users,
  Info,
  Save,
  Check,
  Shield,
  Database,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  Scale,
  BadgeCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEMO_USERS, MOCK_USER_COOKIE, type MockUser } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { toast } from 'sonner'

// ─── Types ─────────────────────────────────────────────────────────────────────

type SettingsTab = 'profile' | 'notifications' | 'theme' | 'accounts' | 'system'

interface NotificationPref {
  key: string
  label: string
  description: string
  enabled: boolean
}

// ─── Default Notification Prefs ───────────────────────────────────────────────

const DEFAULT_NOTIF_PREFS: NotificationPref[] = [
  {
    key: 'CASE_ASSIGNED',
    label: 'Case Assignments',
    description: 'Notify when a case is assigned to you',
    enabled: true,
  },
  {
    key: 'CASE_STATUS_CHANGED',
    label: 'Case Status Changes',
    description: 'Notify when a case status is updated',
    enabled: true,
  },
  {
    key: 'DEADLINE_REMINDER',
    label: 'Deadline Reminders',
    description: 'Remind you of approaching reglementary deadlines',
    enabled: true,
  },
  {
    key: 'HEARING_SCHEDULED',
    label: 'Hearing Scheduled',
    description: 'Notify when a court hearing is scheduled',
    enabled: true,
  },
  {
    key: 'DOCUMENT_FILED',
    label: 'Document Filed',
    description: 'Notify when a document is filed in your case',
    enabled: false,
  },
  {
    key: 'CONTRACT_ANALYZED',
    label: 'Contract Analysis Complete',
    description: 'Notify when a contract analysis is ready',
    enabled: true,
  },
  {
    key: 'CONTRACT_EXPIRING',
    label: 'Contract Expiring',
    description: 'Alert 30 days before a contract expires',
    enabled: true,
  },
  {
    key: 'TASK_DUE',
    label: 'Task Due Reminders',
    description: 'Remind you of tasks due within 24 hours',
    enabled: false,
  },
  {
    key: 'SYSTEM_ALERT',
    label: 'System Alerts',
    description: 'Platform maintenance and security notices',
    enabled: true,
  },
]

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  ADMIN:    { label: 'Admin',    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  LAWYER:   { label: 'Lawyer',   className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  PARALEGAL:{ label: 'Paralegal',className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
  CLIENT:   { label: 'Client',   className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [currentUser, setCurrentUser] = useState<MockUser>(DEMO_USERS[0])
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState<NotificationPref[]>(DEFAULT_NOTIF_PREFS)
  const { theme, setTheme } = useTheme()

  // Resolve user from cookie
  useEffect(() => {
    const cookieMap = document.cookie.split(';').reduce(
      (acc, c) => {
        const [k, v] = c.trim().split('=')
        acc[k] = decodeURIComponent(v ?? '')
        return acc
      },
      {} as Record<string, string>
    )
    const userId = cookieMap[MOCK_USER_COOKIE]
    if (userId) {
      const found = DEMO_USERS.find((u) => u.id === userId)
      if (found) setCurrentUser(found)
    }
  }, [])

  // Profile form state
  const [firstName, setFirstName] = useState(currentUser.firstName)
  const [lastName, setLastName]   = useState(currentUser.lastName)
  const [email, setEmail]         = useState(currentUser.email)
  const [barNumber, setBarNumber] = useState(currentUser.barNumber ?? '')

  useEffect(() => {
    setFirstName(currentUser.firstName)
    setLastName(currentUser.lastName)
    setEmail(currentUser.email)
    setBarNumber(currentUser.barNumber ?? '')
  }, [currentUser])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSaveProfile() {
    setSavingProfile(true)
    setTimeout(() => {
      setSavingProfile(false)
      setProfileSaved(true)
      toast.success('Profile updated successfully')
      setTimeout(() => setProfileSaved(false), 2000)
    }, 900)
  }

  function handleSwitchAccount(user: MockUser) {
    document.cookie = `${MOCK_USER_COOKIE}=${encodeURIComponent(user.id)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`
    setCurrentUser(user)
    toast.success(`Switched to ${user.name}`)
    // Small delay then reload so server components re-hydrate
    setTimeout(() => window.location.reload(), 500)
  }

  function toggleNotif(key: string) {
    setNotifPrefs((prev) =>
      prev.map((p) => (p.key === key ? { ...p, enabled: !p.enabled } : p))
    )
    toast.success('Notification preference updated')
  }

  // ── Sidebar tabs ──────────────────────────────────────────────────────────

  const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
    { key: 'profile',       label: 'Profile',             icon: User },
    { key: 'notifications', label: 'Notifications',        icon: Bell },
    { key: 'theme',         label: 'Appearance',           icon: Palette },
    { key: 'accounts',      label: 'Demo Accounts',        icon: Users },
    { key: 'system',        label: 'System Information',   icon: Info },
  ]

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your account, preferences, and platform configuration.
        </p>
      </div>

      <div className="flex gap-6">
        {/* ── Left sidebar ──────────────────────────────────────────────────── */}
        <nav className="hidden w-52 shrink-0 sm:block">
          <ul className="space-y-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    activeTab === key
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {activeTab === key && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Main content ──────────────────────────────────────────────────── */}
        <div className="min-w-0 flex-1 space-y-4">

          {/* ─ Profile ─────────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  User Profile
                </h2>
              </div>

              {/* Avatar + role */}
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-2xl font-bold text-white">
                  {currentUser.firstName[0]}{currentUser.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{currentUser.name}</p>
                  <span
                    className={cn(
                      'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium',
                      ROLE_BADGE[currentUser.role]?.className ?? 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {ROLE_BADGE[currentUser.role]?.label ?? currentUser.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@quanbylegal.com"
                  />
                </div>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'LAWYER') && (
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      IBP / Bar Admission Number
                    </label>
                    <Input
                      value={barNumber}
                      onChange={(e) => setBarNumber(e.target.value)}
                      placeholder="e.g. 2015-01234"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Required for e-Notarization and document signing.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="gap-2"
                >
                  {profileSaved ? (
                    <>
                      <Check className="h-4 w-4" /> Saved
                    </>
                  ) : savingProfile ? (
                    'Saving…'
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                <strong>Demo Mode:</strong> Profile changes are not persisted across page reloads. In production, changes are saved to the database.
              </div>
            </Card>
          )}

          {/* ─ Notifications ───────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-3">
                {notifPrefs.map((pref) => (
                  <div
                    key={pref.key}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {pref.label}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {pref.description}
                      </p>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => toggleNotif(pref.key)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
                        pref.enabled
                          ? 'bg-blue-600'
                          : 'bg-slate-200 dark:bg-slate-700'
                      )}
                      role="switch"
                      aria-checked={pref.enabled}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                          pref.enabled ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Email delivery requires SMTP configuration in production. In-app notifications are always enabled.
              </p>
            </Card>
          )}

          {/* ─ Theme / Appearance ──────────────────────────────────────────── */}
          {activeTab === 'theme' && (
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Palette className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Appearance
                </h2>
              </div>

              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Choose how the Quanby Case Management Platform looks on your device.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    value: 'light',
                    label: 'Light',
                    description: 'White and slate interface',
                    icon: Sun,
                    preview: 'bg-white border-slate-200',
                  },
                  {
                    value: 'dark',
                    label: 'Dark',
                    description: 'Dark navy interface',
                    icon: Moon,
                    preview: 'bg-slate-900 border-slate-700',
                  },
                  {
                    value: 'system',
                    label: 'System',
                    description: 'Follows your OS setting',
                    icon: Monitor,
                    preview: 'bg-gradient-to-br from-white to-slate-900 border-slate-300',
                  },
                ].map(({ value, label, description, icon: Icon, preview }) => (
                  <button
                    key={value}
                    onClick={() => {
                      setTheme(value)
                      toast.success(`Theme set to ${label}`)
                    }}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-left transition-all',
                      theme === value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:hover:border-blue-700'
                    )}
                  >
                    {/* Mini preview */}
                    <div className={cn('h-16 w-full rounded-lg border-2', preview)} />
                    <div className="w-full">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {label}
                        </span>
                        {theme === value && (
                          <BadgeCheck className="ml-auto h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* ─ Demo Account Switcher ────────────────────────────────────────── */}
          {activeTab === 'accounts' && (
            <Card className="p-6">
              <div className="mb-6 flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Demo Account Switcher
                </h2>
              </div>

              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Switch between demo accounts to experience the platform from different role perspectives.
              </p>

              <div className="space-y-3">
                {DEMO_USERS.map((user) => {
                  const roleMeta = ROLE_BADGE[user.role]
                  const isActive = currentUser.id === user.id
                  return (
                    <div
                      key={user.id}
                      className={cn(
                        'flex items-center justify-between rounded-xl border-2 p-4 transition-colors',
                        isActive
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#1E40AF] to-[#0F172A] text-sm font-bold text-white">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                          {user.barNumber && (
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                              Bar No. {user.barNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            'rounded-full px-2.5 py-0.5 text-xs font-medium',
                            roleMeta?.className ?? 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {roleMeta?.label ?? user.role}
                        </span>
                        {isActive ? (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-blue-600">
                            <Check className="h-3.5 w-3.5" /> Active
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSwitchAccount(user)}
                            className="text-xs"
                          >
                            Switch
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                <strong>Note:</strong> Switching accounts sets the <code className="mx-0.5 rounded bg-blue-100 px-1 py-0.5 dark:bg-blue-900/40">ql_demo_user</code> cookie and reloads the page. In production, replace with a proper authentication system.
              </div>
            </Card>
          )}

          {/* ─ System Information ──────────────────────────────────────────── */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="mb-6 flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    System Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: 'Platform', value: 'Quanby Case Management Platform' },
                    { label: 'Version', value: '1.0.0 (Demo)' },
                    { label: 'Environment', value: process.env.NODE_ENV ?? 'development' },
                    { label: 'Framework', value: 'Next.js 15.1.6' },
                    { label: 'Runtime', value: 'Node.js 18+' },
                    { label: 'Database', value: 'PostgreSQL 15 (Prisma ORM)' },
                    { label: 'Auth Mode', value: 'Mock (Demo Mode)' },
                    { label: 'Jurisdiction', value: 'Republic of the Philippines' },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Compliance certifications */}
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Compliance & Standards
                  </h2>
                </div>

                <div className="space-y-2">
                  {[
                    { code: 'RA-10173', name: 'Data Privacy Act of 2012', authority: 'NPC', compliant: true },
                    { code: 'RA-8792', name: 'Electronic Commerce Act', authority: 'DTI', compliant: true },
                    { code: 'A.M. 19-10-20-SC', name: 'SC Rules on Electronic Evidence', authority: 'Supreme Court', compliant: true },
                    { code: 'NIST SP 800-53', name: 'Security and Privacy Controls', authority: 'NIST', compliant: true },
                    { code: 'ISO 27001:2022', name: 'Information Security Management', authority: 'ISO', compliant: true },
                    { code: 'OWASP Top 10', name: 'Web Application Security', authority: 'OWASP', compliant: true },
                  ].map(({ code, name, authority, compliant }) => (
                    <div
                      key={code}
                      className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2.5 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <Scale className="h-4 w-4 shrink-0 text-slate-400" />
                        <div>
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {code}
                          </span>
                          <span className="mx-2 text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">{authority}</span>
                        {compliant && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                            ✓ Compliant
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Database status */}
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Database Commands
                  </h2>
                </div>
                <div className="space-y-2 rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-300">
                  <p><span className="text-slate-500"># Migrate</span></p>
                  <p className="text-green-400">npm run db:migrate</p>
                  <p className="mt-2"><span className="text-slate-500"># Seed demo data</span></p>
                  <p className="text-green-400">npm run db:seed</p>
                  <p className="mt-2"><span className="text-slate-500"># Reset (caution: deletes all data)</span></p>
                  <p className="text-yellow-400">npm run db:reset</p>
                  <p className="mt-2"><span className="text-slate-500"># Launch Prisma Studio</span></p>
                  <p className="text-blue-400">npm run db:studio</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
