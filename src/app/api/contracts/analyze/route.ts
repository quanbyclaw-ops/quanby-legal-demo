// Quanby Legal Platform – Contract AI Analysis Route
// POST /api/contracts/analyze – triggers AI analysis on a contract

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const AnalyzeSchema = z.object({
  contractId: z.string().cuid(),
  message: z.string().optional(),  // For chat mode
  mode: z.enum(['full', 'chat']).default('full'),
})

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const body = await request.json()
    const parsed = AnalyzeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { message: 'Validation failed', details: parsed.error.flatten() } },
        { status: 400 }
      )
    }

    const { contractId, message, mode } = parsed.data

    // Fetch the contract
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { analyses: { orderBy: { createdAt: 'desc' }, take: 1 } },
    })

    if (!contract) {
      return NextResponse.json({ success: false, error: { message: 'Contract not found' } }, { status: 404 })
    }

    // Mark contract as analyzing
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'ANALYZING' },
    })

    // In production, this would call the Anthropic API.
    // For the scaffold, we return a structured mock response.
    // Replace this block with actual AI API call in Prompt 7.

    if (mode === 'chat' && message) {
      // Chat mode: append message to existing analysis chat history
      const existingAnalysis = contract.analyses[0]
      if (!existingAnalysis) {
        return NextResponse.json(
          { success: false, error: { message: 'No analysis found. Run full analysis first.' } },
          { status: 400 }
        )
      }

      const existingHistory = (existingAnalysis.chatHistory as Array<{ role: string; content: string; timestamp: string }>) ?? []
      const updatedHistory = [
        ...existingHistory,
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        {
          role: 'assistant',
          content: `[AI Response to: "${message}"] — Full AI integration will be implemented in Prompt 7 using Anthropic Claude with Philippine law context.`,
          timestamp: new Date().toISOString(),
        },
      ]

      const updatedAnalysis = await prisma.contractAnalysis.update({
        where: { id: existingAnalysis.id },
        data: { chatHistory: updatedHistory },
      })

      await prisma.contract.update({
        where: { id: contractId },
        data: { status: 'ANALYZED' },
      })

      return NextResponse.json({ success: true, data: updatedAnalysis })
    }

    // Full analysis mode
    const analysisData = {
      contractId,
      summary: `AI analysis of "${contract.title}". Full Anthropic Claude integration will be wired in Prompt 7.`,
      riskScore: 35,
      riskLevel: 'MEDIUM',
      keyObligations: [
        { party: contract.partyA, obligation: 'Fulfill primary obligations as stated', deadline: 'Per contract terms', severity: 'High' },
        { party: contract.partyB, obligation: 'Render consideration as agreed', deadline: 'Per contract terms', severity: 'High' },
      ],
      keyRights: [
        { party: contract.partyA, right: 'Receive contracted deliverables', basis: 'Contract terms' },
        { party: contract.partyB, right: 'Receive payment or consideration', basis: 'Contract terms' },
      ],
      riskFactors: [
        { factor: 'Missing data privacy provisions (RA 10173)', severity: 'HIGH', recommendation: 'Add Data Processing Agreement' },
        { factor: 'Dispute resolution clause not specified', severity: 'MEDIUM', recommendation: 'Specify RTC jurisdiction and arbitration clause' },
      ],
      recommendations: [
        'Add RA 10173 Data Privacy compliance clause',
        'Specify governing law and jurisdiction explicitly',
        'Include force majeure provisions',
      ],
      missingClauses: ['Data Privacy (RA 10173)', 'Force Majeure', 'Anti-corruption clause'],
      unusualClauses: [],
      complianceIssues: [
        { law: 'RA 10173 – Data Privacy Act', issue: 'No data processing agreement', severity: 'HIGH' },
      ],
      applicableLaws: [
        'Civil Code of the Philippines – Book IV (Obligations and Contracts)',
        'Republic Act No. 10173 – Data Privacy Act',
        'Republic Act No. 8792 – Electronic Commerce Act',
      ],
      courtJurisdiction: 'Regional Trial Court with jurisdiction over the principal office',
      enforceabilityNotes: 'Contract appears enforceable under Philippine law subject to the identified compliance gaps.',
      modelUsed: 'claude-3-5-sonnet',
      tokensUsed: 0,
      chatHistory: [],
    }

    const analysis = await prisma.contractAnalysis.create({ data: analysisData })

    await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'ANALYZED' },
    })

    return NextResponse.json({ success: true, data: analysis }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contracts/analyze]', error)
    return NextResponse.json({ success: false, error: { message: 'Internal server error' } }, { status: 500 })
  }
}
