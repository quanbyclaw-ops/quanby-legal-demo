// Quanby Legal Platform – Sidebar Navigation Component
// Navy blue sidebar with collapse/expand and mobile drawer support

'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  UserPlus,
  FileSearch,
  FileText,
  Stamp,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  Scale,
  LogOut,
  Settings,
  HelpCircle,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComplianceBadge } from './ComplianceBadge'

// ─── Types ─────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string
  section?: 'main' | 'secondary'
}

// ─── Navigation definitions ────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',      href: '/dashboard',              icon: LayoutDashboard, section: 'main' },
  { label: 'Cases',          href: '/dashboard/cases',        icon: Briefcase,       section: 'main' },
  { label: 'Client Intake',  href: '/dashboard/intake',       icon: UserPlus,        section: 'main' },
  { label: 'Contract Agent', href: '/dashboard/contracts',    icon: FileSearch,      section: 'main' },
  { label: 'Documents',      href: '/dashboard/documents',    icon: FileText,        section: 'main' },
  { label: 'Notarization',   href: '/dashboard/notarization', icon: Stamp,           section: 'main' },
  { label: 'Analytics',      href: '/dashboard/analytics',    icon: BarChart3,       section: 'main' },
  { label: 'Client Portal',  href: '/dashboard/portal',       icon: Users,           section: 'main' },
]

const SECONDARY_ITEMS: NavItem[] = [
  { label: 'Settings', href: '/dashboard/settings', icon: Settings,   section: 'secondary' },
  { label: 'Help',     href: '/dashboard/help',     icon: HelpCircle, section: 'secondary' },
]

// ─── Sidebar ───────────────────────────────────────────────────────────────────

interface SidebarProps {
  className?: string
  onClose?: () => void
  isMobile?: boolean
}

export function Sidebar({ className, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  // Never collapse on mobile drawer
  const isCollapsed = isMobile ? false : collapsed

  return (
    <aside
      data-sidebar
      className={cn(
        'relative flex h-full flex-col bg-[#0F172A] text-slate-100 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[68px]' : 'w-[260px]',
        className
      )}
      aria-label="Primary navigation"
    >
      {/* ── Logo / Brand ────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center border-b border-slate-700/60 px-4',
          isCollapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-900/50">
          <Scale className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        {!isCollapsed && (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-bold tracking-tight text-white">
              Quanby Legal
            </span>
            <span className="truncate text-[10px] font-semibold uppercase tracking-widest text-blue-400">
              Platform
            </span>
          </div>
        )}

        {/* Mobile close button */}
        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Collapse toggle (desktop only) ──────────────────────────────────── */}
      {!isMobile && (
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-[4.25rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-[#0F172A] text-slate-400 shadow-md transition-all hover:border-blue-500 hover:bg-slate-800 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      {/* ── Main navigation ─────────────────────────────────────────────────── */}
      <nav
        className="sidebar-scroll flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin"
        aria-label="Main navigation"
      >
        {!isCollapsed && (
          <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
        )}
        <ul className="space-y-0.5 px-2" role="list">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href)
              }
              collapsed={isCollapsed}
              onNavigate={onClose}
            />
          ))}
        </ul>

        {/* ── Secondary nav ─────────────────────────────────────────────────── */}
        <div className="mt-4 border-t border-slate-700/60 pt-4">
          {!isCollapsed && (
            <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              System
            </p>
          )}
          <ul className="space-y-0.5 px-2" role="list">
            {SECONDARY_ITEMS.map((item) => (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
                collapsed={isCollapsed}
                onNavigate={onClose}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Bottom: compliance badge + sign-out ─────────────────────────────── */}
      <div className="shrink-0 border-t border-slate-700/60">
        {!isCollapsed && (
          <div className="px-4 py-3">
            <ComplianceBadge
              standard="SC-RULES"
              variant="compact"
              className="w-full justify-center"
            />
          </div>
        )}
        {isCollapsed && (
          <div className="flex justify-center py-3">
            <ComplianceBadge standard="SC-RULES" variant="icon-only" />
          </div>
        )}
        <div className="px-2 pb-3">
          <button
            className={cn(
              'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-slate-400 transition-all hover:bg-slate-800 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
              isCollapsed && 'justify-center px-2'
            )}
            aria-label="Sign out"
            onClick={async () => {
              await fetch('/api/auth/set-user', {
                method: 'DELETE',
              }).catch(() => {})
              window.location.href = '/sign-in'
            }}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Nav item sub-component ────────────────────────────────────────────────────

interface SidebarNavItemProps {
  item: NavItem
  isActive: boolean
  collapsed: boolean
  onNavigate?: () => void
}

function SidebarNavItem({ item, isActive, collapsed, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon

  return (
    <li>
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        onClick={onNavigate}
        className={cn(
          'group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
            : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100',
          collapsed && 'justify-center px-2'
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
            isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-200'
          )}
          aria-hidden="true"
        />
        {!collapsed && (
          <span className="truncate">{item.label}</span>
        )}
        {!collapsed && item.badge && (
          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  )
}

// ─── Mobile sidebar drawer ─────────────────────────────────────────────────────

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  // Lock body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        data-mobile-drawer
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <Sidebar isMobile onClose={onClose} />
      </div>
    </>
  )
}
