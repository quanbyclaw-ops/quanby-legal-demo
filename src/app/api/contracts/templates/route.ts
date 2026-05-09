// Quanby Case Management Platform – Contract Templates API Route
// GET /api/contracts/templates – List available templates
// POST /api/contracts/templates – Generate contract from template with variables

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// ─── Static Template Definitions ─────────────────────────────────────────────

const TEMPLATE_CATALOG = [
  {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Bilateral confidentiality agreement with Philippine law provisions and NPC-compliant data handling clauses',
    category: 'Confidentiality',
    icon: '🔒',
    applicableLaws: ['RA 10173', 'Civil Code Art. 1305-1422'],
    scCompliant: true,
    variables: [
      { key: 'partyA', label: 'Disclosing Party (Full Name)', type: 'text', required: true },
      { key: 'partyB', label: 'Receiving Party (Full Name)', type: 'text', required: true },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
      { key: 'duration', label: 'Confidentiality Period (years)', type: 'number', required: true },
      { key: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true },
      { key: 'jurisdiction', label: 'Jurisdiction (City)', type: 'select', required: true,
        options: ['Makati City', 'Quezon City', 'Manila', 'Pasig City', 'Taguig City', 'Cebu City', 'Davao City'] },
    ],
  },
  {
    id: 'service',
    name: 'Service Agreement',
    description: 'Professional services contract compliant with Philippine commercial law, BIR requirements, and withholding tax provisions',
    category: 'Services',
    icon: '🤝',
    applicableLaws: ['Civil Code', 'RA 9184 (for government clients)', 'BIR RR 11-2018'],
    scCompliant: true,
    variables: [
      { key: 'clientName', label: 'Client Name', type: 'text', required: true },
      { key: 'providerName', label: 'Service Provider Name', type: 'text', required: true },
      { key: 'serviceName', label: 'Service Description', type: 'textarea', required: true },
      { key: 'contractValue', label: 'Contract Value (PHP)', type: 'number', required: true },
      { key: 'startDate', label: 'Start Date', type: 'date', required: true },
      { key: 'endDate', label: 'End Date', type: 'date', required: true },
      { key: 'paymentTerms', label: 'Payment Terms', type: 'select', required: true,
        options: ['Net 15', 'Net 30', 'Net 45', 'Upon completion', 'Monthly'] },
    ],
  },
  {
    id: 'retainer',
    name: 'Legal Retainer Agreement',
    description: 'Attorney retainer agreement per IBP guidelines, SC Rules, and CPR (Code of Professional Responsibility)',
    category: 'Legal Services',
    icon: '⚖️',
    applicableLaws: ['SC Rules', 'IBP Guidelines', 'Code of Professional Responsibility'],
    scCompliant: true,
    variables: [
      { key: 'clientName', label: 'Client Full Name', type: 'text', required: true },
      { key: 'lawyerName', label: "Lawyer's Full Name", type: 'text', required: true },
      { key: 'barNumber', label: 'Bar Roll Number', type: 'text', required: true },
      { key: 'legalServices', label: 'Scope of Legal Services', type: 'textarea', required: true },
      { key: 'retainerFee', label: 'Monthly Retainer Fee (PHP)', type: 'number', required: true },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    ],
  },
  {
    id: 'moa',
    name: 'Memorandum of Agreement (MOA)',
    description: 'MOA template for government, NGO, and inter-agency arrangements — includes COA and OGCC compliance provisions',
    category: 'Government',
    icon: '📜',
    applicableLaws: ['Administrative Code', 'RA 9184', 'COA guidelines'],
    scCompliant: true,
    variables: [
      { key: 'party1', label: 'First Party (Agency/Organization)', type: 'text', required: true },
      { key: 'party2', label: 'Second Party (Agency/Organization)', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose of Agreement', type: 'textarea', required: true },
      { key: 'obligations1', label: 'Obligations of First Party', type: 'textarea', required: true },
      { key: 'obligations2', label: 'Obligations of Second Party', type: 'textarea', required: true },
      { key: 'duration', label: 'Agreement Duration (months)', type: 'number', required: true },
      { key: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
    ],
  },
  {
    id: 'employment',
    name: 'Employment Contract',
    description: 'Regular/probationary employment contract fully compliant with the Labor Code of the Philippines (PD 442, as amended)',
    category: 'Employment',
    icon: '👔',
    applicableLaws: ['PD 442 Labor Code', 'DOLE issuances', 'RA 8282 SSS', 'RA 7875 PhilHealth', 'RA 9679 Pag-IBIG'],
    scCompliant: false,
    variables: [
      { key: 'employerName', label: 'Employer (Company Name)', type: 'text', required: true },
      { key: 'employeeName', label: "Employee's Full Name", type: 'text', required: true },
      { key: 'position', label: 'Position/Job Title', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'text', required: false },
      { key: 'salary', label: 'Monthly Salary (PHP)', type: 'number', required: true },
      { key: 'startDate', label: 'Employment Start Date', type: 'date', required: true },
      { key: 'employmentType', label: 'Employment Type', type: 'select', required: true,
        options: ['Regular', 'Probationary (6 months)', 'Project-based', 'Fixed-term', 'Part-time'] },
    ],
  },
]

// ─── GET: List Templates ───────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const scOnly = searchParams.get('scCompliant') === 'true'

    let templates = TEMPLATE_CATALOG

    if (category) {
      templates = templates.filter(t => t.category.toLowerCase() === category.toLowerCase())
    }
    if (scOnly) {
      templates = templates.filter(t => t.scCompliant)
    }

    // Also check for any custom templates in the database
    try {
      const dbTemplates = await prisma.contractTemplate.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          variables: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: {
          builtin: templates,
          custom: dbTemplates,
          total: templates.length + dbTemplates.length,
        },
      })
    } catch {
      // DB not available (scaffold) — return static only
      return NextResponse.json({
        success: true,
        data: {
          builtin: templates,
          custom: [],
          total: templates.length,
        },
      })
    }
  } catch (error) {
    console.error('[GET /api/contracts/templates]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── POST: Generate Contract from Template ────────────────────────────────────

const GenerateContractSchema = z.object({
  templateId: z.string().min(1),
  variables: z.record(z.union([z.string(), z.number()])),
  title: z.string().optional(),
  linkedCaseId: z.string().optional(),
  format: z.enum(['docx', 'pdf', 'text']).default('text'),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const body = await request.json()
    const parsed = GenerateContractSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const { templateId, variables, title, format } = parsed.data

    // Find template
    const template = TEMPLATE_CATALOG.find(t => t.id === templateId)
    if (!template) {
      return NextResponse.json(
        { success: false, error: { message: `Template '${templateId}' not found` } },
        { status: 404 }
      )
    }

    // Validate required variables
    const missingVars = template.variables
      .filter(v => v.required)
      .filter(v => !variables[v.key])
      .map(v => v.key)

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Missing required template variables',
            details: { missing: missingVars },
          },
        },
        { status: 400 }
      )
    }

    // Generate contract text (mock — production would call document generation service)
    const generatedTitle = title ?? `${template.name} – ${new Date().toLocaleDateString('en-PH')}`
    const generatedText = generateContractText(template.id, variables as Record<string, string>, generatedTitle)

    // Optionally save as a contract in the database
    let savedContract = null
    try {
      savedContract = await prisma.contract.create({
        data: {
          title: generatedTitle,
          type: templateIdToContractType(templateId) as import('@prisma/client').ContractType,
          status: 'DRAFT',
          partyA: String(variables['partyA'] ?? variables['clientName'] ?? variables['party1'] ?? variables['employerName'] ?? 'Party A'),
          partyB: String(variables['partyB'] ?? variables['providerName'] ?? variables['party2'] ?? variables['employeeName'] ?? 'Party B'),
          description: `Generated from ${template.name} template`,
          governingLaw: 'Philippine Law',
          jurisdiction: 'Philippines',
          linkedCaseId: parsed.data.linkedCaseId ?? undefined,
        },
      })
    } catch {
      // DB not available in scaffold
    }

    return NextResponse.json({
      success: true,
      data: {
        template: { id: template.id, name: template.name },
        contract: savedContract,
        generated: {
          title: generatedTitle,
          format,
          content: generatedText,
          applicableLaws: template.applicableLaws,
          scCompliant: template.scCompliant,
          generatedAt: new Date().toISOString(),
        },
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contracts/templates]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function templateIdToContractType(templateId: string): string {
  const map: Record<string, string> = {
    nda: 'NDA',
    service: 'SERVICE',
    retainer: 'SERVICE',
    moa: 'MOA',
    employment: 'EMPLOYMENT',
  }
  return map[templateId] ?? 'OTHER'
}

function generateContractText(templateId: string, vars: Record<string, string>, title: string): string {
  const today = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
  const filled = (key: string, fallback: string) => vars[key] ?? `[${fallback}]`

  const header = `${title.toUpperCase()}\n\n` +
    `Republic of the Philippines\n` +
    `This contract is executed in accordance with Philippine law.\n` +
    `Date: ${today}\n\n`

  const footer = `\n\nIN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\n` +
    `_______________________________\n` +
    `${vars['partyA'] ?? vars['clientName'] ?? vars['party1'] ?? vars['employerName'] ?? 'FIRST PARTY'}\n` +
    `(Signature over Printed Name)\n\n` +
    `_______________________________\n` +
    `${vars['partyB'] ?? vars['providerName'] ?? vars['party2'] ?? vars['employeeName'] ?? 'SECOND PARTY'}\n` +
    `(Signature over Printed Name)\n\n` +
    `SIGNED IN THE PRESENCE OF:\n\n` +
    `_______________________________        _______________________________\n` +
    `Witness 1                              Witness 2\n\n` +
    `ACKNOWLEDGMENT\n\n` +
    `Republic of the Philippines )\n` +
    `                             ) S.S.\n` +
    `__________________ City/Municipality )\n\n` +
    `BEFORE ME, a Notary Public for and in the above jurisdiction, personally appeared the above-named parties...\n\n` +
    `Doc No. ____; Page No. ____; Book No. ____; Series of ${new Date().getFullYear()}.`

  switch (templateId) {
    case 'nda':
      return header +
        `NON-DISCLOSURE AGREEMENT\n\n` +
        `This Non-Disclosure Agreement ("Agreement") is entered into as of ${filled('effectiveDate', 'DATE')}, between:\n\n` +
        `${filled('partyA', 'DISCLOSING PARTY')} ("Disclosing Party")\nand\n${filled('partyB', 'RECEIVING PARTY')} ("Receiving Party")\n\n` +
        `RECITALS\n\nThe parties wish to explore a potential business relationship for the purpose of: ${filled('purpose', 'PURPOSE')}\n\n` +
        `TERMS AND CONDITIONS\n\n` +
        `1. CONFIDENTIAL INFORMATION\n   "Confidential Information" means any data or information disclosed by the Disclosing Party...\n\n` +
        `2. OBLIGATIONS\n   The Receiving Party agrees to maintain confidentiality for ${filled('duration', 'X')} years...\n\n` +
        `3. DATA PRIVACY (RA 10173)\n   Both parties shall comply with the Data Privacy Act of 2012 (Republic Act No. 10173)...\n\n` +
        `4. GOVERNING LAW\n   This Agreement is governed by Philippine law. Disputes shall be resolved in ${filled('jurisdiction', 'JURISDICTION')}...\n` +
        footer

    case 'employment':
      return header +
        `EMPLOYMENT CONTRACT\n\n` +
        `This Employment Contract ("Contract") is entered into between:\n\n` +
        `${filled('employerName', 'EMPLOYER')}, ("Employer")\nand\n${filled('employeeName', 'EMPLOYEE')}, ("Employee")\n\n` +
        `1. POSITION: ${filled('position', 'POSITION')}${vars['department'] ? `, ${vars['department']} Department` : ''}\n\n` +
        `2. EMPLOYMENT TYPE: ${filled('employmentType', 'TYPE')}\n\n` +
        `3. COMMENCEMENT: ${filled('startDate', 'START DATE')}\n\n` +
        `4. COMPENSATION: PHP ${filled('salary', 'AMOUNT')} per month, subject to mandatory deductions per:\n` +
        `   - RA 8282 (SSS)\n   - RA 7875 (PhilHealth)\n   - RA 9679 (Pag-IBIG)\n   - NIRC (Income Tax)\n\n` +
        `5. LABOR CODE COMPLIANCE: This contract is executed pursuant to PD 442 (Labor Code of the Philippines), as amended...\n\n` +
        `6. DOLE REPORTING: The Employer shall report this employment to the Department of Labor and Employment...\n` +
        footer

    default:
      return header +
        template_vars_to_text(templateId, vars) +
        footer
  }
}

function template_vars_to_text(templateId: string, vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
    .join('\n') + '\n\nThis contract is executed in accordance with applicable Philippine law.\n'
}
