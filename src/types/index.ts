// Quanby Case Management Platform – TypeScript Type Definitions v2.0
// Central type registry for the entire application
// Updated: ContractTemplate, ContractChat, ENotarization + new enums

import type {
  User,
  Client,
  Case,
  CaseTimeline,
  CaseTask,
  Document,
  Contract,
  ContractAnalysis,
  ContractTemplate,
  ContractChat,
  ENotarization,
  Notification,
  Role,
  CaseType,
  CaseStatus,
  CasePriority,
  CourtLevel,
  DocumentType,
  DocumentStatus,
  ContractType,
  ContractStatus,
  AnalysisType,
  AnalysisStatus,
  ChatRole,
  ENotarizationStatus,
  EligibilityStatus,
  TimelineEventType,
  NotificationType,
} from '@prisma/client'

// Re-export Prisma enums for convenience
export type {
  Role,
  CaseType,
  CaseStatus,
  CasePriority,
  CourtLevel,
  DocumentType,
  DocumentStatus,
  ContractType,
  ContractStatus,
  AnalysisType,
  AnalysisStatus,
  ChatRole,
  ENotarizationStatus,
  EligibilityStatus,
  TimelineEventType,
  NotificationType,
}

// ─── Prisma Model Exports ──────────────────────────────────────────────────────
export type {
  User,
  Client,
  Case,
  CaseTimeline,
  CaseTask,
  Document,
  Contract,
  ContractAnalysis,
  ContractTemplate,
  ContractChat,
  ENotarization,
  Notification,
}

// ─── Extended/Computed Types ───────────────────────────────────────────────────

export type UserWithProfile = User & {
  clientProfile?: Client | null
  assignedCases?: Case[]
  _count?: {
    assignedCases: number
    notifications: number
  }
}

export type ClientWithUser = Client & {
  user: User
  cases?: Case[]
  _count?: {
    cases: number
  }
}

export type CaseSummary = Pick<
  Case,
  | 'id'
  | 'caseNumber'
  | 'title'
  | 'type'
  | 'status'
  | 'priority'
  | 'reglementaryDeadline'
  | 'nextHearingDate'
  | 'courtLevel'
  | 'courtDocket'
  | 'createdAt'
  | 'updatedAt'
> & {
  client: Pick<Client, 'id'> & {
    user: Pick<User, 'firstName' | 'lastName' | 'email'>
  }
  assignedLawyer?: Pick<User, 'id' | 'firstName' | 'lastName' | 'barNumber'> | null
  _count?: {
    documents: number
    tasks: number
    timeline: number
    contracts: number
  }
}

export type CaseDetail = Case & {
  client: ClientWithUser
  assignedLawyer?: UserWithProfile | null
  createdBy: User
  timeline: CaseTimeline[]
  tasks: (CaseTask & {
    assignedTo?: User | null
    createdBy: User
  })[]
  documents: Document[]
  contracts: ContractSummary[]
  notifications: Notification[]
}

export type ContractSummary = Pick<
  Contract,
  | 'id'
  | 'title'
  | 'type'
  | 'status'
  | 'effectiveDate'
  | 'expirationDate'
  | 'value'
  | 'contractValue'
  | 'currency'
  | 'createdAt'
> & {
  latestAnalysis?: Pick<ContractAnalysis, 'overallRiskScore' | 'riskLevel' | 'status' | 'analysisType'> | null
}

export type ContractWithAnalysis = Contract & {
  analyses: ContractAnalysis[]
  latestAnalysis?: ContractAnalysis | null
  chats?: ContractChat[]
  uploadedBy?: Pick<User, 'id' | 'firstName' | 'lastName'> | null
  linkedCase?: Pick<Case, 'id' | 'caseNumber' | 'title'> | null
}

export type ContractAnalysisDetail = ContractAnalysis & {
  contract: Pick<Contract, 'id' | 'title' | 'type' | 'status'>
  analyzedBy?: Pick<User, 'id' | 'firstName' | 'lastName'> | null
}

export type ContractChatWithUser = ContractChat & {
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'> | null
}

export type ENotarizationWithDocument = ENotarization & {
  document: Pick<Document, 'id' | 'title' | 'type' | 'fileName' | 'fileSize'>
}

// ─── API Request/Response Types ────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  message?: string
  pagination?: PaginationMeta
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginationQuery {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ─── Filter Types ──────────────────────────────────────────────────────────────

export interface CaseFilters extends PaginationQuery {
  status?: CaseStatus | CaseStatus[]
  type?: CaseType | CaseType[]
  priority?: CasePriority | CasePriority[]
  assignedLawyerId?: string
  clientId?: string
  search?: string
  overdueOnly?: boolean
  upcomingHearings?: boolean
}

export interface ContractFilters extends PaginationQuery {
  type?: ContractType | ContractType[]
  status?: ContractStatus | ContractStatus[]
  search?: string
  expiringIn?: number  // days
  uploadedById?: string
  linkedCaseId?: string
}

export interface DocumentFilters extends PaginationQuery {
  caseId?: string
  type?: DocumentType | DocumentType[]
  status?: DocumentStatus | DocumentStatus[]
  search?: string
  isNotarized?: boolean
}

export interface ContractAnalysisFilters extends PaginationQuery {
  contractId?: string
  analysisType?: AnalysisType
  status?: AnalysisStatus
}

// ─── Form Input Types ──────────────────────────────────────────────────────────

export interface IntakeFormData {
  // Personal
  firstName: string
  lastName: string
  middleName?: string
  suffix?: string
  dateOfBirth: string
  gender: string
  civilStatus: string
  nationality: string

  // Contact
  email: string
  phone: string
  alternatePhone?: string

  // Address
  streetAddress: string
  barangay: string
  municipality: string
  province: string
  region: string
  zipCode: string

  // Financial
  monthlyIncome: number
  occupation: string
  employer?: string

  // IDs
  tinNumber?: string
  sssNumber?: string
  philhealthNumber?: string
  pagibigNumber?: string

  // Legal concern
  legalConcern: string
  caseType: CaseType
  briefDescription: string
}

export interface CaseFormData {
  title: string
  type: CaseType
  priority: CasePriority
  clientId: string
  assignedLawyerId?: string
  description?: string
  causeOfAction?: string
  reliefSought?: string
  factualBackground?: string
  courtLevel?: CourtLevel
  courtName?: string
  courtBranch?: string
  courtDocket?: string
  judgeAssigned?: string
  dateOfIncident?: string
  dateOfFiling?: string
  reglementaryDeadline?: string
  prescriptionDate?: string
  nextHearingDate?: string
  opposingParty?: string
  opposingCounsel?: string
  estimatedValue?: number
  isConfidential?: boolean
  tags?: string[]
}

export interface ContractUploadFormData {
  title: string
  type: ContractType
  partyA: string
  partyB: string
  partyAAddress?: string
  partyBAddress?: string
  parties?: ContractParty[]
  executionDate?: string
  effectiveDate?: string
  expirationDate?: string
  value?: number
  description?: string
  linkedCaseId?: string
  tags?: string[]
  file: File
}

export interface ContractParty {
  name: string
  role: string
  address?: string
  email?: string
  phone?: string
}

export interface DocumentGenerationData {
  templateId: string
  caseId: string
  data: Record<string, unknown>
  title: string
}

export interface ContractTemplateGenerateData {
  templateId: string
  variables: Record<string, string | number>
  title?: string
}

export interface ENotarizationRequestData {
  documentId: string
  notaryId: string
  notaryName: string
  notaryRollNo: string
  notaryPtrNo?: string
  notaryIbpNo?: string
  notaryMcleNo?: string
}

// ─── Dashboard / Analytics Types ──────────────────────────────────────────────

export interface DashboardStats {
  totalCases: number
  activeCases: number
  pendingAssignment: number
  upcomingDeadlines: number
  overdueDeadlines: number
  closedThisMonth: number
  totalClients: number
  totalContracts: number
  contractsExpiringSoon: number
  pendingNotarizations: number
  casesByType: Record<CaseType, number>
  casesByStatus: Record<CaseStatus, number>
  casesByPriority: Record<CasePriority, number>
}

export interface AnalyticsData {
  caseVolumeTrend: TimeSeriesPoint[]
  caseOutcomeRate: {
    won: number
    lost: number
    settled: number
    dismissed: number
    active: number
  }
  lawyerWorkload: LawyerWorkloadData[]
  caseTypeDistribution: PieChartData[]
  revenueByMonth: TimeSeriesPoint[]
  averageCaseDuration: number  // in days
  deadlineComplianceRate: number  // percentage
  contractRiskDistribution: PieChartData[]
}

export interface TimeSeriesPoint {
  date: string
  value: number
  label?: string
}

export interface LawyerWorkloadData {
  lawyerId: string
  lawyerName: string
  activeCases: number
  maxCaseLoad: number
  utilizationRate: number
}

export interface PieChartData {
  name: string
  value: number
  color?: string
}

// ─── Contract Analysis Types ───────────────────────────────────────────────────

export interface ContractObligation {
  party: string
  obligation: string
  deadline?: string
  severity: 'High' | 'Medium' | 'Low'
}

export interface ContractRight {
  party: string
  right: string
  basis: string
}

export interface ContractRiskFactor {
  factor: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  recommendation: string
}

export interface ContractRisk {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  recommendation: string
}

export interface ContractKeyClause {
  title: string
  text: string
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  section?: string
}

export interface ContractComplianceFlag {
  law: string
  issue: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  compliant: boolean
}

export interface ContractSuggestion {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  suggestion: string
  rationale: string
}

export interface ContractComplianceIssue {
  law: string
  issue: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface UnusualClause {
  clause: string
  section: string
  concern: string
}

export interface ApplicableLaw {
  title: string
  relevance?: string
}

// ─── Contract Template Types ───────────────────────────────────────────────────

export interface TemplateVariable {
  key: string
  label: string
  type: 'text' | 'textarea' | 'date' | 'number' | 'select'
  required: boolean
  defaultValue?: string
  options?: string[]  // for select type
}

export type ContractTemplateWithCreator = ContractTemplate & {
  createdBy?: Pick<User, 'id' | 'firstName' | 'lastName'> | null
}

// ─── Chat / Agent Types ────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface ContractAgentRequest {
  contractId: string
  message: string
  analysisRef?: string
  clauseRef?: string
}

export interface ContractAgentResponse {
  message: string
  analysisUpdates?: Partial<ContractAnalysis>
  suggestedClauses?: ContractKeyClause[]
  citations?: ApplicableLaw[]
}

// ─── Notification Types ────────────────────────────────────────────────────────

export interface NotificationWithCase extends Notification {
  case?: Pick<Case, 'id' | 'caseNumber' | 'title'> | null
}

// ─── Auth / Session Types ──────────────────────────────────────────────────────

export interface SessionUser {
  id: string
  userId: string
  email: string
  firstName: string
  lastName: string
  role: Role
  barNumber?: string | null
}

// ─── UI State Types ────────────────────────────────────────────────────────────

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
}

export interface ModalState {
  isOpen: boolean
  type?: string
  data?: unknown
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

// ─── Compliance Badge Types ────────────────────────────────────────────────────

export interface ComplianceBadgeProps {
  standard: 'RA-10173' | 'NIST' | 'ISO-27001' | 'OWASP' | 'SC-RULES'
  variant?: 'default' | 'compact' | 'icon-only'
  className?: string
}

// ─── e-Notarization Types ──────────────────────────────────────────────────────

export interface NotarizationCertificate {
  certificateNumber: string
  documentTitle: string
  notaryName: string
  notaryRollNo: string
  notaryPtrNo?: string
  notaryIbpNo?: string
  notaryMcleNo?: string
  notarizedAt: string
  digitalSeal: string
  verificationUrl: string
  verificationHash: string
}

export interface NotarizationVerificationResult {
  isValid: boolean
  certificateNumber: string
  documentIntegrity: boolean
  notaryVerified: boolean
  message: string
}
