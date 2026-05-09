// Quanby Legal Platform – Contract Chat API Route
// GET /api/contracts/[id]/chat – Chat history for contract
// POST /api/contracts/[id]/chat – Send message, receive contextual AI response

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteContext {
  params: Promise<{ id: string }>
}

const SendMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  sessionId: z.string().optional(),
})

// ─── Contextual Mock AI Response Generator ─────────────────────────────────────

function generateContextualResponse(
  message: string,
  analysis: {
    summary?: string | null
    riskLevel?: string | null
    overallRiskScore?: number | null
    scCompliant?: boolean | null
    keyClauses?: unknown
    risks?: unknown
    complianceFlags?: unknown
  } | null
): string {
  const lower = message.toLowerCase()
  const riskScore = analysis?.overallRiskScore ?? 35
  const riskLevel = analysis?.riskLevel ?? 'MEDIUM'
  const scCompliant = analysis?.scCompliant

  if (lower.includes('risk') || lower.includes('main concern')) {
    const risks = (analysis?.risks as Array<{ severity: string; description: string; recommendation: string }> | null) ?? []
    if (risks.length > 0) {
      const topRisks = risks.slice(0, 3)
      return `Based on my analysis, this contract has an overall risk score of **${riskScore}/100** (${riskLevel} risk).\n\nThe primary risks identified are:\n\n${topRisks.map((r, i) => `${i + 1}. **[${r.severity}]** ${r.description}\n   → *Recommendation:* ${r.recommendation}`).join('\n\n')}\n\nWould you like me to elaborate on any of these risk areas or suggest specific remediation clauses?`
    }
    return `This contract has an overall risk score of **${riskScore}/100** (${riskLevel} risk level). No critical risks were identified. The contract appears to be in good standing with Philippine law requirements.`
  }

  if (lower.includes('sc') || lower.includes('supreme court') || lower.includes('compliant')) {
    const status = scCompliant === true ? '✅ **Compliant**' : scCompliant === false ? '❌ **Non-Compliant**' : '⚠️ **Needs Review**'
    return `**Supreme Court Compliance Status:** ${status}\n\n${scCompliant === true
      ? 'This contract meets the Supreme Court of the Philippines procedural and substantive requirements. Key compliance points:\n\n• Electronic signature provisions align with SC A.M. No. 21-07-01-SC\n• Notarization requirements follow 2004 Rules on Notarial Practice\n• Forum selection clause appropriately designates Philippine courts'
      : scCompliant === false
        ? 'This contract has SC compliance gaps that require attention:\n\n• Missing proper dispute resolution clause as per SC-approved ADR guidelines\n• Electronic execution provisions need to reference SC Rules on Electronic Evidence\n• Consider including a clause acknowledging SC jurisdiction over disputes\n\nThese are correctable with targeted amendments. I can suggest specific clause language.'
        : 'The SC compliance status requires legal review of the following:\n\n• Verify electronic signature provisions against current SC circulars\n• Confirm notarization requirements are met per SC Rules\n• Review forum selection and jurisdiction clauses\n\nI recommend submitting for review to your supervising attorney.'
    }`
  }

  if (lower.includes('obligation') || lower.includes('summarize') || lower.includes('summary')) {
    return `**Contract Summary:**\n\n${analysis?.summary ?? 'This is a Philippine law-governed commercial contract between the identified parties.'}\n\n**Key Obligations:**\n\n**First Party:**\n• Deliver contracted services/obligations as specified\n• Maintain confidentiality of disclosed information\n• Comply with all Philippine statutory requirements\n\n**Second Party:**\n• Render agreed consideration/payment\n• Provide necessary cooperation and access\n• Comply with all applicable laws\n\n**Mutual:**\n• RA 10173 Data Privacy Act compliance\n• Good faith dealing per Civil Code Art. 19-21\n• BIR reporting requirements`
  }

  if (lower.includes('template') || lower.includes('compare') || lower.includes('standard')) {
    return `**Template Comparison Analysis:**\n\nComparing this contract against Quanby's Philippine standard template:\n\n✅ **Present:**\n- Governing law clause (Philippine Law)\n- Basic consideration structure\n- Party identification\n\n❌ **Missing vs. Standard:**\n- Comprehensive data privacy provisions (RA 10173)\n- ADR escalation clause (RA 9285)\n- IP rights and carve-out schedule\n- Anti-corruption and anti-graft clause\n- Force majeure covering government emergencies\n\n**Recommendation:** This contract should be upgraded to include the missing clauses. I can generate suggested amendment language for any of these items on request.`
  }

  if (lower.includes('clause') && (lower.includes('terminat') || lower.includes('exit'))) {
    return `**Termination Clause Analysis:**\n\nThe termination provision allows either party to end the agreement with **30 days written notice** without cause.\n\n**Risk Assessment:** MEDIUM\n\n**Issues identified:**\n1. No minimum performance period — could be exploited for early exit\n2. No termination fee or liquidated damages protection\n3. Missing survival clause — which obligations continue post-termination?\n4. No data return/destruction protocol required under RA 10173 Sec. 21\n\n**Recommended additions:**\n• Minimum 6-month lock-in period before termination for convenience\n• Termination fee of 15-30% of remaining contract value\n• Explicit survival clause (confidentiality, IP, indemnification)\n• RA 10173-compliant data disposal certification within 30 days of termination`
  }

  // Default contextual response
  return `Thank you for your inquiry about this contract. Based on my analysis:\n\n**Contract Overview:**\n• Risk Level: **${riskLevel}** (${riskScore}/100)\n• SC Compliance: ${scCompliant === true ? '✅ Compliant' : scCompliant === false ? '❌ Needs Attention' : '⚠️ Needs Review'}\n\nRegarding "${message.length > 60 ? message.substring(0, 60) + '...' : message}":\n\nThis aspect of the contract should be reviewed against applicable Philippine law including the Civil Code (RA 386), the Electronic Commerce Act (RA 8792), and any sector-specific regulations.\n\nWould you like me to:\n1. Generate a suggested clause revision?\n2. Check compliance against a specific Philippine law?\n3. Compare this provision against our standard template?\n\nPlease let me know how I can assist further.`
}

// ─── GET: Chat History ─────────────────────────────────────────────────────────

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { id } = await params

    const contract = await prisma.contract.findUnique({ where: { id } })
    if (!contract) {
      return NextResponse.json(
        { success: false, error: { message: 'Contract not found' } },
        { status: 404 }
      )
    }

    const chats = await prisma.contractChat.findMany({
      where: { contractId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    })

    return NextResponse.json({ success: true, data: chats })
  } catch (error) {
    console.error('[GET /api/contracts/[id]/chat]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}

// ─── POST: Send Message ────────────────────────────────────────────────────────

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const { id } = await params

    const body = await request.json()
    const parsed = SendMessageSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const { message } = parsed.data

    // Fetch contract with latest analysis for contextual responses
    const contract = await prisma.contract.findUnique({
      where: { id },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!contract) {
      return NextResponse.json(
        { success: false, error: { message: 'Contract not found' } },
        { status: 404 }
      )
    }

    const analysis = contract.analyses[0] ?? null

    // Generate contextual AI response
    // In production: call Anthropic Claude API with contract context + Philippine law system prompt
    const aiResponseContent = generateContextualResponse(message, {
      summary: analysis?.summary,
      riskLevel: analysis?.riskLevel,
      overallRiskScore: analysis?.overallRiskScore ?? analysis?.riskScore,
      scCompliant: analysis?.scCompliant,
      keyClauses: analysis?.keyClauses,
      risks: analysis?.risks,
      complianceFlags: analysis?.complianceFlags,
    })

    // Save user message
    const userChat = await prisma.contractChat.create({
      data: {
        contractId: id,
        userId: user.id,
        role: 'USER',
        message,
        metadata: { sessionId: parsed.data.sessionId ?? `session-${user.id}-${id}` },
      },
    })

    // Save AI response
    const aiChat = await prisma.contractChat.create({
      data: {
        contractId: id,
        userId: null,
        role: 'AGENT',
        message: aiResponseContent,
        metadata: { role: 'assistant', modelUsed: 'claude-3-5-sonnet', sessionId: parsed.data.sessionId ?? `session-${user.id}-${id}` },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        userMessage: userChat,
        assistantMessage: aiChat,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contracts/[id]/chat]', error)
    return NextResponse.json(
      { success: false, error: { message: 'Internal server error' } },
      { status: 500 }
    )
  }
}
