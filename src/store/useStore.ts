// Quanby Case Management Platform – Zustand Global Store
// Client-side state management (non-server state only)

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  CaseFilters,
  ContractFilters,
  DocumentFilters,
  ModalState,
  ToastMessage,
  SessionUser,
  BreadcrumbItem,
} from '@/types'

// ─── Sidebar State ─────────────────────────────────────────────────────────────

interface SidebarState {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggleCollapse: () => void
  toggleMobile: () => void
  closeMobile: () => void
}

// ─── Toast State ───────────────────────────────────────────────────────────────

interface ToastState {
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

// ─── Modal State ───────────────────────────────────────────────────────────────

interface ModalStoreState {
  modals: Record<string, ModalState>
  openModal: (key: string, data?: unknown) => void
  closeModal: (key: string) => void
  isModalOpen: (key: string) => boolean
}

// ─── Filter State ──────────────────────────────────────────────────────────────

interface FilterState {
  caseFilters: CaseFilters
  contractFilters: ContractFilters
  documentFilters: DocumentFilters
  setCaseFilters: (filters: Partial<CaseFilters>) => void
  setContractFilters: (filters: Partial<ContractFilters>) => void
  setDocumentFilters: (filters: Partial<DocumentFilters>) => void
  resetCaseFilters: () => void
  resetContractFilters: () => void
  resetDocumentFilters: () => void
}

// ─── Session State ─────────────────────────────────────────────────────────────

interface SessionState {
  currentUser: SessionUser | null
  setCurrentUser: (user: SessionUser | null) => void
}

// ─── Navigation State ──────────────────────────────────────────────────────────

interface NavigationState {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void
  activePath: string
  setActivePath: (path: string) => void
}

// ─── Preferences State ─────────────────────────────────────────────────────────

interface PreferencesState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  caseViewMode: 'table' | 'card' | 'kanban'
  setCaseViewMode: (mode: 'table' | 'card' | 'kanban') => void
  contractViewMode: 'table' | 'card'
  setContractViewMode: (mode: 'table' | 'card') => void
  documentViewMode: 'list' | 'grid'
  setDocumentViewMode: (mode: 'list' | 'grid') => void
  dateFormat: 'long' | 'short' | 'relative'
  setDateFormat: (fmt: 'long' | 'short' | 'relative') => void
  itemsPerPage: number
  setItemsPerPage: (n: number) => void
}

// ─── Combined Store ────────────────────────────────────────────────────────────

type AppStore = SidebarState &
  ToastState &
  ModalStoreState &
  FilterState &
  SessionState &
  NavigationState &
  PreferencesState

const DEFAULT_CASE_FILTERS: CaseFilters = {
  page: 1,
  pageSize: 20,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
}

const DEFAULT_CONTRACT_FILTERS: ContractFilters = {
  page: 1,
  pageSize: 20,
  sortBy: 'updatedAt',
  sortOrder: 'desc',
}

const DEFAULT_DOCUMENT_FILTERS: DocumentFilters = {
  page: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const useStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Sidebar ──────────────────────────────────────────────────────────
        isCollapsed: false,
        isMobileOpen: false,
        toggleCollapse: () => set((s) => ({ isCollapsed: !s.isCollapsed })),
        toggleMobile: () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
        closeMobile: () => set({ isMobileOpen: false }),

        // ── Toasts ───────────────────────────────────────────────────────────
        toasts: [],
        addToast: (toast) =>
          set((s) => ({
            toasts: [
              ...s.toasts,
              { ...toast, id: crypto.randomUUID() },
            ],
          })),
        removeToast: (id) =>
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
        clearToasts: () => set({ toasts: [] }),

        // ── Modals ───────────────────────────────────────────────────────────
        modals: {},
        openModal: (key, data) =>
          set((s) => ({
            modals: { ...s.modals, [key]: { isOpen: true, data } },
          })),
        closeModal: (key) =>
          set((s) => ({
            modals: { ...s.modals, [key]: { isOpen: false } },
          })),
        isModalOpen: (key) => get().modals[key]?.isOpen ?? false,

        // ── Filters ──────────────────────────────────────────────────────────
        caseFilters: DEFAULT_CASE_FILTERS,
        contractFilters: DEFAULT_CONTRACT_FILTERS,
        documentFilters: DEFAULT_DOCUMENT_FILTERS,
        setCaseFilters: (filters) =>
          set((s) => ({ caseFilters: { ...s.caseFilters, ...filters } })),
        setContractFilters: (filters) =>
          set((s) => ({ contractFilters: { ...s.contractFilters, ...filters } })),
        setDocumentFilters: (filters) =>
          set((s) => ({ documentFilters: { ...s.documentFilters, ...filters } })),
        resetCaseFilters: () => set({ caseFilters: DEFAULT_CASE_FILTERS }),
        resetContractFilters: () => set({ contractFilters: DEFAULT_CONTRACT_FILTERS }),
        resetDocumentFilters: () => set({ documentFilters: DEFAULT_DOCUMENT_FILTERS }),

        // ── Session ──────────────────────────────────────────────────────────
        currentUser: null,
        setCurrentUser: (user) => set({ currentUser: user }),

        // ── Navigation ───────────────────────────────────────────────────────
        breadcrumbs: [],
        setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
        activePath: '',
        setActivePath: (path) => set({ activePath: path }),

        // ── Preferences ──────────────────────────────────────────────────────
        theme: 'light',
        setTheme: (theme) => set({ theme }),
        caseViewMode: 'table',
        setCaseViewMode: (mode) => set({ caseViewMode: mode }),
        contractViewMode: 'table',
        setContractViewMode: (mode) => set({ contractViewMode: mode }),
        documentViewMode: 'list',
        setDocumentViewMode: (mode) => set({ documentViewMode: mode }),
        dateFormat: 'long',
        setDateFormat: (fmt) => set({ dateFormat: fmt }),
        itemsPerPage: 20,
        setItemsPerPage: (n) => set({ itemsPerPage: n }),
      }),
      {
        name: 'quanby-legal-store',
        // Only persist preferences and UI state, NOT filters or session data
        partialize: (state) => ({
          isCollapsed: state.isCollapsed,
          theme: state.theme,
          caseViewMode: state.caseViewMode,
          contractViewMode: state.contractViewMode,
          documentViewMode: state.documentViewMode,
          dateFormat: state.dateFormat,
          itemsPerPage: state.itemsPerPage,
        }),
      }
    )
  )
)

// ─── Selector Hooks ────────────────────────────────────────────────────────────

export const useSidebar = () =>
  useStore((s) => ({
    isCollapsed: s.isCollapsed,
    isMobileOpen: s.isMobileOpen,
    toggleCollapse: s.toggleCollapse,
    toggleMobile: s.toggleMobile,
    closeMobile: s.closeMobile,
  }))

export const useToast = () =>
  useStore((s) => ({
    toasts: s.toasts,
    addToast: s.addToast,
    removeToast: s.removeToast,
  }))

export const useModal = (key: string) =>
  useStore((s) => ({
    isOpen: s.modals[key]?.isOpen ?? false,
    data: s.modals[key]?.data,
    open: (data?: unknown) => s.openModal(key, data),
    close: () => s.closeModal(key),
  }))

export const usePreferences = () =>
  useStore((s) => ({
    theme: s.theme,
    setTheme: s.setTheme,
    caseViewMode: s.caseViewMode,
    setCaseViewMode: s.setCaseViewMode,
    contractViewMode: s.contractViewMode,
    setContractViewMode: s.setContractViewMode,
    documentViewMode: s.documentViewMode,
    setDocumentViewMode: s.setDocumentViewMode,
    dateFormat: s.dateFormat,
    setDateFormat: s.setDateFormat,
    itemsPerPage: s.itemsPerPage,
    setItemsPerPage: s.setItemsPerPage,
  }))

export const useCurrentUser = () => useStore((s) => s.currentUser)
