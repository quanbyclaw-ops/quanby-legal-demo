// Quanby Legal Platform – Document Generation API
// POST /api/documents/generate – generate document from template with variable substitution

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { DocumentType } from '@prisma/client'

// ─── Template library ──────────────────────────────────────────────────────────

const TEMPLATE_LIBRARY: Record<string, {
  title: string
  docType: DocumentType
  category: string
  body: string
  requiredVars: string[]
}> = {
  'verified-complaint': {
    title: 'Verified Complaint',
    docType: 'COMPLAINT',
    category: 'Pleading',
    body: `REPUBLIC OF THE PHILIPPINES
{{court_name}}
{{court_branch}}

{{client_name}},
  Plaintiff,

-versus-                                         Civil Case No. {{case_number}}

{{opposing_party}},
  Defendant.

VERIFIED COMPLAINT

PLAINTIFF {{client_name}}, through undersigned counsel, most respectfully alleges:

PARTIES

1. Plaintiff {{client_name}} is of legal age, Filipino, and residing at {{plaintiff_address}}.
2. Defendant {{opposing_party}} is of legal age and may be served at {{defendant_address}}.

FACTS

3. {{cause_of_action}}

CAUSE OF ACTION

4. The acts of defendant constitute a violation of plaintiff's rights.

PRAYER

WHEREFORE, plaintiff respectfully prays that:
a) {{relief_sought}};
b) Attorney's fees and litigation expenses be awarded.

{{place_of_filing}}, Philippines, {{date_filed}}.

________________________
{{lawyer_name}}
IBP No. {{ibp_no}} | PTR No. {{ptr_no}}
Roll No. {{roll_no}} | MCLE No. {{mcle_no}}
Counsel for Plaintiff`,
    requiredVars: ['client_name', 'opposing_party', 'court_name', 'cause_of_action', 'relief_sought'],
  },

  'demand-letter': {
    title: 'Demand Letter',
    docType: 'CORRESPONDENCE',
    category: 'Letter',
    body: `{{date_filed}}

{{recipient_name}}
{{recipient_address}}

Dear {{recipient_name}}:

RE: FORMAL DEMAND — {{demand_subject}}

We represent {{client_name}} in connection with the above-captioned matter.

This is to formally demand from you, within {{deadline_days}} days from receipt hereof:

{{demand_details}}

Total amount demanded: {{amount_demanded}}

Failure to comply shall constrain our client to institute the necessary legal action.

Very truly yours,

________________________
{{lawyer_name}}
Counsel for {{client_name}}`,
    requiredVars: ['client_name', 'recipient_name', 'demand_subject', 'amount_demanded'],
  },

  'judicial-affidavit': {
    title: 'Judicial Affidavit',
    docType: 'AFFIDAVIT',
    category: 'Affidavit',
    body: `JUDICIAL AFFIDAVIT

I, {{witness_name}}, of legal age, Filipino, and residing at {{witness_address}}, after being duly sworn, depose and state:

Q1: What is your name, age, and address?
A1: I am {{witness_name}}, {{witness_age}} years old, residing at {{witness_address}}.

Q2: Are you familiar with {{case_number}} entitled {{case_title}}?
A2: Yes, I am the {{witness_role}} in the said case.

Q3: Please state the facts within your personal knowledge.
A3: {{witness_statement}}

I am executing this Judicial Affidavit in compliance with A.M. No. 12-8-8-SC (Judicial Affidavit Rule).

{{place_of_execution}}, Philippines, {{date_executed}}.

________________________
{{witness_name}}
Affiant

SUBSCRIBED AND SWORN to before me, Notary Public for and in {{notary_jurisdiction}},
this {{date_executed}}.

________________________
{{notary_name}}
Notary Public
Roll No. {{notary_roll_no}}`,
    requiredVars: ['witness_name', 'witness_address', 'case_number', 'witness_statement'],
  },

  'motion-to-dismiss': {
    title: 'Motion to Dismiss',
    docType: 'MOTION',
    category: 'Motion',
    body: `REPUBLIC OF THE PHILIPPINES
{{court_name}}
{{court_branch}}

{{plaintiff_name}},
  Plaintiff,

-versus-                                         Civil Case No. {{case_number}}

{{defendant_name}},
  Defendant.

MOTION TO DISMISS

DEFENDANT {{defendant_name}}, through undersigned counsel, respectfully moves for the dismissal of the above-entitled case on the following grounds:

1. {{ground_for_dismissal}}

DISCUSSION

2. {{discussion}}

PRAYER

WHEREFORE, defendant respectfully prays that the Honorable Court GRANT this Motion to Dismiss
and ORDER the dismissal of the above-entitled case.

{{place_of_filing}}, Philippines, {{date_filed}}.

________________________
{{lawyer_name}}
IBP No. {{ibp_no}} | PTR No. {{ptr_no}}
Roll No. {{roll_no}} | MCLE No. {{mcle_no}}
Counsel for Defendant`,
    requiredVars: ['plaintiff_name', 'defendant_name', 'case_number', 'ground_for_dismissal'],
  },

  'special-power-of-attorney': {
    title: 'Special Power of Attorney',
    docType: 'CERTIFICATE',
    category: 'Authorization',
    body: `SPECIAL POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS:

I, {{principal_name}}, of legal age, Filipino, residing at {{principal_address}}, do hereby
name, constitute, and appoint {{agent_name}}, residing at {{agent_address}}, as my
true and lawful attorney-in-fact to do and perform the following:

{{specific_authority}}

HEREBY GIVING AND GRANTING unto my said attorney-in-fact full power and authority to
carry into effect the foregoing, hereby ratifying and confirming all that my attorney-in-fact
shall lawfully do.

IN WITNESS WHEREOF, I have hereunto set my hand this {{date_filed}} in
{{place_of_filing}}, Philippines.

________________________
{{principal_name}}
Principal

Government ID: {{principal_id}}`,
    requiredVars: ['principal_name', 'agent_name', 'specific_authority', 'principal_id'],
  },

  'compromise-agreement': {
    title: 'Compromise Agreement',
    docType: 'CONTRACT',
    category: 'Contract',
    body: `COMPROMISE AGREEMENT

This COMPROMISE AGREEMENT is entered into by and between:

FIRST PARTY: {{party_a_name}}, hereinafter referred to as "FIRST PARTY";

AND

SECOND PARTY: {{party_b_name}}, hereinafter referred to as "SECOND PARTY";

WHEREAS, there is a pending case between the parties docketed as {{case_number}};

WHEREAS, the parties have agreed to settle the case amicably;

NOW THEREFORE, for and in consideration of the mutual covenants herein, the parties agree:

1. {{settlement_terms}}

2. In consideration of the foregoing, {{party_a_name}} shall pay {{party_b_name}} the
   total sum of {{settlement_amount}}.

3. Upon compliance with the above terms, the parties shall file a Joint Motion to Dismiss
   with prejudice.

IN WITNESS WHEREOF, the parties have signed this Compromise Agreement on {{date_filed}}
in {{place_of_filing}}, Philippines.

________________________        ________________________
{{party_a_name}}                 {{party_b_name}}
First Party                      Second Party`,
    requiredVars: ['party_a_name', 'party_b_name', 'case_number', 'settlement_terms', 'settlement_amount'],
  },

  'deed-of-sale': {
    title: 'Deed of Absolute Sale',
    docType: 'CONTRACT',
    category: 'Deed',
    body: `DEED OF ABSOLUTE SALE

KNOW ALL MEN BY THESE PRESENTS:

This DEED OF ABSOLUTE SALE is entered into by and between:

VENDOR: {{seller_name}}, residing at {{seller_address}};

AND

VENDEE: {{buyer_name}}, residing at {{buyer_address}};

WITNESSETH: That for and in consideration of the total sum of
{{purchase_price}} (₱{{purchase_price_figure}}), Philippine Currency,
the receipt of which is hereby acknowledged to the full satisfaction of the VENDOR,
the VENDOR does hereby SELL, TRANSFER, CONVEY, and DELIVER unto the VENDEE the following:

PROPERTY:
{{property_description}}

Tax Declaration No.: {{tax_declaration_no}}

The VENDOR warrants clear title free from liens and encumbrances.

IN WITNESS WHEREOF, the parties signed this Deed this {{date_filed}} in
{{place_of_filing}}, Philippines.

________________________        ________________________
{{seller_name}}                  {{buyer_name}}
VENDOR                           VENDEE`,
    requiredVars: ['seller_name', 'buyer_name', 'property_description', 'purchase_price', 'tax_declaration_no'],
  },
}

// ─── Request schema ────────────────────────────────────────────────────────────

const GenerateDocumentSchema = z.object({
  templateId: z.string().min(1),
  variables: z.record(z.string(), z.string()),
  caseId: z.string().cuid().optional(),
  customTitle: z.string().optional(),
})

// ─── Variable substitution ─────────────────────────────────────────────────────

function substituteVariables(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value || `[${key}]`)
  }
  // Mark any remaining unfilled placeholders
  result = result.replaceAll(/\{\{(\w+)\}\}/g, '[$1]')
  return result
}

// ─── POST /api/documents/generate ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = GenerateDocumentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Validation failed', details: parsed.error.flatten() },
        },
        { status: 400 }
      )
    }

    const { templateId, variables, caseId, customTitle } = parsed.data

    // Look up template
    const template = TEMPLATE_LIBRARY[templateId]
    if (!template) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Template "${templateId}" not found`,
            code: 'TEMPLATE_NOT_FOUND',
            availableTemplates: Object.keys(TEMPLATE_LIBRARY),
          },
        },
        { status: 404 }
      )
    }

    // Validate required variables
    const missingRequired = template.requiredVars.filter(v => !variables[v])
    if (missingRequired.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Missing required variables: ${missingRequired.join(', ')}`,
            code: 'MISSING_VARIABLES',
            missingRequired,
          },
        },
        { status: 400 }
      )
    }

    // Validate case if provided
    if (caseId) {
      const caseExists = await prisma.case.findUnique({ where: { id: caseId } })
      if (!caseExists) {
        return NextResponse.json(
          { success: false, error: { message: 'Case not found', code: 'CASE_NOT_FOUND' } },
          { status: 404 }
        )
      }
    }

    // Find uploader user record
    const dbUser = await prisma.user.findFirst({ where: { email: currentUser.email } })
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: { message: 'User record not found' } },
        { status: 404 }
      )
    }

    // Generate content
    const generatedContent = substituteVariables(template.body, variables)

    // Determine title
    const title = customTitle
      ?? (variables['client_name'] || variables['principal_name'] || variables['party_a_name'])
        ? `${template.title} – ${variables['client_name'] ?? variables['principal_name'] ?? variables['party_a_name']}`
        : template.title

    // Create document record
    const document = await prisma.document.create({
      data: {
        title: title || template.title,
        type: template.docType,
        status: 'DRAFT',
        description: `Generated from template: ${templateId}. Category: ${template.category}.`,
        fileName: `${templateId}-${Date.now()}.txt`,
        fileSize: Buffer.byteLength(generatedContent, 'utf8'),
        mimeType: 'text/plain',
        templateId: templateId,
        generatedContent: generatedContent,
        caseId: caseId ?? null,
        uploadedById: dbUser.id,
      },
      include: {
        case: { select: { id: true, caseNumber: true, title: true } },
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    // Log timeline event
    if (caseId) {
      await prisma.caseTimeline.create({
        data: {
          caseId,
          eventType: 'DOCUMENT_FILED',
          title: `Document generated: ${document.title}`,
          description: `${template.category} document "${document.title}" generated from template "${templateId}" by ${dbUser.firstName} ${dbUser.lastName}`,
          createdById: dbUser.id,
        },
      }).catch(() => {/* Non-critical */})
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          document,
          generatedContent,
          templateId,
          variablesUsed: Object.keys(variables).length,
          remainingPlaceholders: (generatedContent.match(/\[(\w+)\]/g) ?? []).length,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[POST /api/documents/generate]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── GET /api/documents/generate – list available templates ───────────────────

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: { message: 'Unauthorized', code: 'AUTH_REQUIRED' } },
        { status: 401 }
      )
    }

    const templates = Object.entries(TEMPLATE_LIBRARY).map(([id, tmpl]) => ({
      id,
      title: tmpl.title,
      docType: tmpl.docType,
      category: tmpl.category,
      requiredVars: tmpl.requiredVars,
    }))

    return NextResponse.json({ success: true, data: templates })
  } catch (error) {
    console.error('[GET /api/documents/generate]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
