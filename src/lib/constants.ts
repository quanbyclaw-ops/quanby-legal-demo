// Quanby Case Management Platform – Application Constants
// Philippine legal system reference data

// ─── Case Types ───────────────────────────────────────────────────────────────

export const CASE_TYPES = {
  CIVIL: {
    label: 'Civil',
    description: 'Actions involving private rights and obligations between parties',
    color: 'blue',
    icon: 'scale',
    examples: ['Recovery of Property', 'Damages', 'Contracts', 'Torts'],
  },
  CRIMINAL: {
    label: 'Criminal',
    description: 'State prosecution of violations of the Revised Penal Code',
    color: 'red',
    icon: 'gavel',
    examples: ['Theft', 'Estafa', 'Physical Injuries', 'Homicide'],
  },
  LABOR: {
    label: 'Labor',
    description: 'Employment disputes governed by the Labor Code',
    color: 'orange',
    icon: 'briefcase',
    examples: ['Illegal Dismissal', 'Unpaid Wages', 'Constructive Dismissal'],
  },
  ADMINISTRATIVE: {
    label: 'Administrative',
    description: 'Proceedings before government agencies and quasi-judicial bodies',
    color: 'purple',
    icon: 'building',
    examples: ['Government Employee Discipline', 'License Revocation', 'Agency Orders'],
  },
  FAMILY: {
    label: 'Family',
    description: 'Cases under the Family Code and related laws',
    color: 'pink',
    icon: 'heart',
    examples: ['Annulment', 'Legal Separation', 'Child Custody', 'Support'],
  },
  COMMERCIAL: {
    label: 'Commercial',
    description: 'Business disputes and corporate matters',
    color: 'cyan',
    icon: 'trending-up',
    examples: ['Breach of Contract', 'Corporate Disputes', 'Insolvency'],
  },
  SPECIAL_PROCEEDINGS: {
    label: 'Special Proceedings',
    description: 'Non-adversarial proceedings to establish rights or status',
    color: 'teal',
    icon: 'file-text',
    examples: ['Settlement of Estate', 'Adoption', 'Guardianship', 'Habeas Corpus'],
  },
  ELECTION: {
    label: 'Election',
    description: 'Election contests and COMELEC proceedings',
    color: 'indigo',
    icon: 'flag',
    examples: ['Election Protest', 'Quo Warranto', 'Vote Counting'],
  },
  TAX: {
    label: 'Tax',
    description: 'BIR assessments, CTA appeals, and tax disputes',
    color: 'green',
    icon: 'receipt',
    examples: ['Income Tax Assessment', 'VAT Deficiency', 'Tax Refund Claims'],
  },
  ENVIRONMENTAL: {
    label: 'Environmental',
    description: 'Cases under environmental laws and citizen suits',
    color: 'lime',
    icon: 'leaf',
    examples: ['Pollution', 'Environmental Damage', 'SLAPP Defense'],
  },
} as const

export type CaseTypeKey = keyof typeof CASE_TYPES

// ─── Case Statuses ─────────────────────────────────────────────────────────────

export const CASE_STATUSES = {
  INTAKE: {
    label: 'Intake',
    description: 'Client intake in progress, eligibility not yet determined',
    color: 'gray',
    next: ['PENDING_ASSIGNMENT'],
  },
  PENDING_ASSIGNMENT: {
    label: 'Pending Assignment',
    description: 'Awaiting lawyer assignment',
    color: 'yellow',
    next: ['ACTIVE'],
  },
  ACTIVE: {
    label: 'Active',
    description: 'Case is actively being handled',
    color: 'green',
    next: ['ON_HOLD', 'AWAITING_HEARING', 'AWAITING_DECISION', 'CLOSED_WON', 'CLOSED_LOST', 'CLOSED_SETTLED', 'DISMISSED'],
  },
  ON_HOLD: {
    label: 'On Hold',
    description: 'Case temporarily suspended',
    color: 'orange',
    next: ['ACTIVE', 'DISMISSED'],
  },
  AWAITING_HEARING: {
    label: 'Awaiting Hearing',
    description: 'Hearing scheduled, waiting for court date',
    color: 'blue',
    next: ['ACTIVE', 'AWAITING_DECISION'],
  },
  AWAITING_DECISION: {
    label: 'Awaiting Decision',
    description: 'Submitted for decision, awaiting ruling',
    color: 'purple',
    next: ['APPEALED', 'CLOSED_WON', 'CLOSED_LOST', 'CLOSED_SETTLED'],
  },
  APPEALED: {
    label: 'Appealed',
    description: 'Decision appealed to higher court',
    color: 'indigo',
    next: ['ACTIVE', 'CLOSED_WON', 'CLOSED_LOST'],
  },
  CLOSED_WON: { label: 'Closed – Won', description: 'Case decided in client\'s favor', color: 'emerald', next: ['ARCHIVED'] },
  CLOSED_LOST: { label: 'Closed – Lost', description: 'Case decided against client', color: 'red', next: ['ARCHIVED'] },
  CLOSED_SETTLED: { label: 'Closed – Settled', description: 'Case resolved through settlement', color: 'teal', next: ['ARCHIVED'] },
  DISMISSED: { label: 'Dismissed', description: 'Case dismissed by court', color: 'gray', next: ['ARCHIVED'] },
  ARCHIVED: { label: 'Archived', description: 'Case archived for record-keeping', color: 'slate', next: [] },
} as const

export type CaseStatusKey = keyof typeof CASE_STATUSES

// ─── Case Priorities ───────────────────────────────────────────────────────────

export const CASE_PRIORITIES = {
  URGENT: { label: 'Urgent', color: 'red', bgClass: 'bg-red-100 text-red-800', dotClass: 'bg-red-500' },
  HIGH:   { label: 'High',   color: 'orange', bgClass: 'bg-orange-100 text-orange-800', dotClass: 'bg-orange-500' },
  MEDIUM: { label: 'Medium', color: 'yellow', bgClass: 'bg-yellow-100 text-yellow-800', dotClass: 'bg-yellow-500' },
  LOW:    { label: 'Low',    color: 'green',  bgClass: 'bg-green-100 text-green-800',  dotClass: 'bg-green-500' },
} as const

// ─── Court Levels ──────────────────────────────────────────────────────────────

export const COURT_LEVELS = {
  BARANGAY:    { label: 'Barangay',                          abbr: 'Brgy',      hierarchy: 1 },
  MTC:         { label: 'Municipal Trial Court',             abbr: 'MTC',       hierarchy: 2 },
  MTCC:        { label: 'Municipal Trial Court in Cities',   abbr: 'MTCC',      hierarchy: 2 },
  RTC:         { label: 'Regional Trial Court',              abbr: 'RTC',       hierarchy: 3 },
  CA:          { label: 'Court of Appeals',                  abbr: 'CA',        hierarchy: 4 },
  SB:          { label: 'Sandiganbayan',                     abbr: 'SB',        hierarchy: 4 },
  SC:          { label: 'Supreme Court',                     abbr: 'SC',        hierarchy: 5 },
  NLRC:        { label: 'National Labor Relations Commission', abbr: 'NLRC',    hierarchy: 3 },
  DARAB:       { label: 'DARAB',                             abbr: 'DARAB',     hierarchy: 3 },
  COMELEC:     { label: 'COMELEC',                           abbr: 'COMELEC',   hierarchy: 3 },
  CTA:         { label: 'Court of Tax Appeals',              abbr: 'CTA',       hierarchy: 4 },
  OMBUDSMAN:   { label: 'Office of the Ombudsman',           abbr: 'OMB',       hierarchy: 3 },
} as const

// ─── Philippine Regions ────────────────────────────────────────────────────────

export const PH_REGIONS = [
  { code: 'NCR',   name: 'National Capital Region (Metro Manila)' },
  { code: 'I',     name: 'Region I – Ilocos Region' },
  { code: 'II',    name: 'Region II – Cagayan Valley' },
  { code: 'III',   name: 'Region III – Central Luzon' },
  { code: 'IV-A',  name: 'Region IV-A – CALABARZON' },
  { code: 'IV-B',  name: 'Region IV-B – MIMAROPA' },
  { code: 'V',     name: 'Region V – Bicol Region' },
  { code: 'VI',    name: 'Region VI – Western Visayas' },
  { code: 'VII',   name: 'Region VII – Central Visayas' },
  { code: 'VIII',  name: 'Region VIII – Eastern Visayas' },
  { code: 'IX',    name: 'Region IX – Zamboanga Peninsula' },
  { code: 'X',     name: 'Region X – Northern Mindanao' },
  { code: 'XI',    name: 'Region XI – Davao Region' },
  { code: 'XII',   name: 'Region XII – SOCCSKSARGEN' },
  { code: 'XIII',  name: 'Region XIII – Caraga' },
  { code: 'BARMM', name: 'Bangsamoro Autonomous Region in Muslim Mindanao' },
  { code: 'CAR',   name: 'Cordillera Administrative Region' },
] as const

// ─── Legal Document Templates ──────────────────────────────────────────────────

export const DOCUMENT_TEMPLATES = [
  { id: 'verified-complaint', label: 'Verified Complaint', category: 'Pleading', caseTypes: ['CIVIL', 'LABOR'] },
  { id: 'answer-with-counterclaim', label: 'Answer with Counterclaim', category: 'Pleading', caseTypes: ['CIVIL', 'COMMERCIAL'] },
  { id: 'motion-to-dismiss', label: 'Motion to Dismiss', category: 'Motion', caseTypes: ['CIVIL', 'CRIMINAL'] },
  { id: 'judicial-affidavit', label: 'Judicial Affidavit', category: 'Affidavit', caseTypes: ['CIVIL', 'CRIMINAL', 'LABOR'] },
  { id: 'position-paper', label: 'Position Paper', category: 'Pleading', caseTypes: ['LABOR'] },
  { id: 'memorandum-on-appeal', label: 'Memorandum on Appeal', category: 'Appeal', caseTypes: ['CIVIL', 'CRIMINAL', 'LABOR'] },
  { id: 'petition-certiorari', label: 'Petition for Certiorari', category: 'Petition', caseTypes: ['ADMINISTRATIVE'] },
  { id: 'demand-letter', label: 'Demand Letter', category: 'Letter', caseTypes: ['CIVIL', 'COMMERCIAL', 'LABOR'] },
  { id: 'compromise-agreement', label: 'Compromise Agreement', category: 'Contract', caseTypes: ['CIVIL', 'LABOR'] },
  { id: 'deed-of-sale', label: 'Deed of Absolute Sale', category: 'Deed', caseTypes: ['CIVIL', 'COMMERCIAL'] },
  { id: 'special-power-of-attorney', label: 'Special Power of Attorney', category: 'Authorization', caseTypes: ['CIVIL', 'COMMERCIAL'] },
  { id: 'affidavit-of-complaint', label: 'Affidavit-Complaint', category: 'Affidavit', caseTypes: ['CRIMINAL'] },
] as const

// ─── Reglementary Periods (Philippine law) ─────────────────────────────────────

export const REGLEMENTARY_PERIODS = {
  // Civil cases
  ANSWER_RTC: { days: 15, label: 'Answer – RTC', description: 'Time to file answer in RTC (Rule 11, Sec. 1)' },
  ANSWER_MTC: { days: 10, label: 'Answer – MTC/MTCC', description: 'Time to file answer in MTC/MTCC' },
  APPEAL_RTC_FROM_MTC: { days: 15, label: 'Appeal to RTC from MTC', description: 'Notice of appeal to RTC' },
  APPEAL_CA_FROM_RTC: { days: 15, label: 'Appeal to CA from RTC', description: 'Notice of appeal to CA' },
  APPEAL_SC_FROM_CA: { days: 15, label: 'Appeal to SC from CA', description: 'Petition for review on certiorari' },
  // Criminal cases
  PRELIMINARY_INVESTIGATION: { days: 10, label: 'Counter-Affidavit (PI)', description: 'Reply in preliminary investigation' },
  ARRAIGNMENT: { days: 30, label: 'Arraignment', description: 'From filing of information' },
  // Labor cases
  NLRC_APPEAL: { days: 10, label: 'NLRC Appeal', description: 'Appeal from Labor Arbiter decision' },
  CA_APPEAL_FROM_NLRC: { days: 60, label: 'CA Appeal from NLRC', description: 'Petition for certiorari from NLRC' },
  // Tax cases
  PROTEST_ASSESSMENT: { days: 30, label: 'Protest – Assessment', description: 'Request for reinvestigation or reconsideration' },
  CTA_APPEAL: { days: 30, label: 'CTA Appeal', description: 'Petition for review to CTA' },
} as const

// ─── Prescribed Periods / Prescription ────────────────────────────────────────

export const PRESCRIPTION_PERIODS = {
  // Civil (Civil Code)
  WRITTEN_CONTRACT: { years: 10, label: 'Written Contract (Art. 1144)' },
  ORAL_CONTRACT: { years: 6, label: 'Oral Contract (Art. 1145)' },
  QUASI_DELICT: { years: 4, label: 'Quasi-delict (Art. 1146)' },
  REAL_PROPERTY: { years: 30, label: 'Recovery of Real Property (Art. 1141)' },
  // Criminal (RPC)
  RECLUSION_PERPETUA: { years: 20, label: 'Capital offenses / Reclusion Perpetua (Art. 90)' },
  RECLUSION_TEMPORAL: { years: 15, label: 'Reclusion Temporal (Art. 90)' },
  PRISION_MAYOR: { years: 10, label: 'Prision Mayor (Art. 90)' },
  PRISION_CORRECCIONAL: { years: 5, label: 'Prision Correccional (Art. 90)' },
} as const

// ─── Contract Types ────────────────────────────────────────────────────────────

export const CONTRACT_TYPES = {
  EMPLOYMENT:         { label: 'Employment Contract' },
  SERVICE:            { label: 'Service Agreement' },
  LEASE:              { label: 'Lease Agreement' },
  SALE:               { label: 'Contract of Sale' },
  PARTNERSHIP:        { label: 'Partnership Agreement' },
  LOAN:               { label: 'Loan Agreement / Promissory Note' },
  NDA:                { label: 'Non-Disclosure Agreement' },
  MOA:                { label: 'Memorandum of Agreement' },
  MOU:                { label: 'Memorandum of Understanding' },
  DEED_OF_SALE:       { label: 'Deed of Absolute Sale' },
  DEED_OF_DONATION:   { label: 'Deed of Donation' },
  POWER_OF_ATTORNEY:  { label: 'Power of Attorney' },
  FRANCHISE:          { label: 'Franchise Agreement' },
  CONSTRUCTION:       { label: 'Construction Contract' },
  SUPPLY:             { label: 'Supply Agreement' },
  OTHER:              { label: 'Other' },
} as const

// ─── PAO Eligibility Criteria ──────────────────────────────────────────────────

export const PAO_ELIGIBILITY = {
  INCOME_THRESHOLD: 18000,  // PHP per month – rough threshold for PAO eligibility
  MINIMUM_SCORE: 60,        // Minimum eligibility score (out of 100)
  FACTORS: {
    income:        { weight: 0.4, label: 'Monthly Household Income' },
    employment:    { weight: 0.2, label: 'Employment Status' },
    assets:        { weight: 0.2, label: 'Estimated Asset Value' },
    dependents:    { weight: 0.1, label: 'Number of Dependents' },
    caseType:      { weight: 0.1, label: 'Nature of Case' },
  },
} as const

// ─── App Navigation ────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { href: '/dashboard',      label: 'Dashboard',         icon: 'layout-dashboard' },
  { href: '/cases',          label: 'Cases',             icon: 'briefcase' },
  { href: '/intake',         label: 'Client Intake',     icon: 'user-plus' },
  { href: '/contracts',      label: 'Contract Agent',    icon: 'file-signature' },
  { href: '/documents',      label: 'Documents',         icon: 'folder-open' },
  { href: '/notarization',   label: 'e-Notarization',    icon: 'stamp' },
  { href: '/portal',         label: 'Client Portal',     icon: 'users' },
  { href: '/analytics',      label: 'Analytics',         icon: 'bar-chart-2' },
] as const

// ─── Date Formats ──────────────────────────────────────────────────────────────

export const DATE_FORMATS = {
  DISPLAY:        'MMMM d, yyyy',
  DISPLAY_SHORT:  'MMM d, yyyy',
  INPUT:          'yyyy-MM-dd',
  DATETIME:       'MMM d, yyyy h:mm a',
  LEGAL:          'd MMMM yyyy',       // For legal documents: "15 March 2025"
  COURT:          'MMMM dd, yyyy',     // For court filings
  TIME_ONLY:      'h:mm a',
} as const

// ─── Compliance Standards ──────────────────────────────────────────────────────

export const COMPLIANCE_STANDARDS = [
  { code: 'RA-10173', name: 'Data Privacy Act of 2012', authority: 'NPC' },
  { code: 'RA-8792',  name: 'Electronic Commerce Act',  authority: 'DTI' },
  { code: 'NIST-800-53', name: 'NIST SP 800-53 Rev. 5', authority: 'NIST' },
  { code: 'ISO-27001', name: 'ISO/IEC 27001:2022', authority: 'ISO' },
  { code: 'OWASP-TOP10', name: 'OWASP Top 10', authority: 'OWASP' },
] as const

// ─── Pagination Defaults ───────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const

// ─── Risk Score Thresholds ─────────────────────────────────────────────────────

export const RISK_THRESHOLDS = {
  LOW:      { max: 30,  label: 'Low Risk',      color: 'green',  bgClass: 'bg-green-100 text-green-800' },
  MEDIUM:   { max: 60,  label: 'Medium Risk',   color: 'yellow', bgClass: 'bg-yellow-100 text-yellow-800' },
  HIGH:     { max: 80,  label: 'High Risk',     color: 'orange', bgClass: 'bg-orange-100 text-orange-800' },
  CRITICAL: { max: 100, label: 'Critical Risk', color: 'red',    bgClass: 'bg-red-100 text-red-800' },
} as const

export function getRiskLevel(score: number): keyof typeof RISK_THRESHOLDS {
  if (score <= 30) return 'LOW'
  if (score <= 60) return 'MEDIUM'
  if (score <= 80) return 'HIGH'
  return 'CRITICAL'
}
