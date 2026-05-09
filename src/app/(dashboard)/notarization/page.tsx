'use client'

// Quanby Case Management Platform – e-Notarization Page (Prompt 6)
// Full workflow: pending queue, request form, status tracking, certificate view

import { useState } from 'react'
import Link from 'next/link'
import { ComplianceBadge } from '@/components/layout/ComplianceBadge'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ENotarizationFlow } from '@/components/documents/ENotarizationFlow'
import { NotarizationCertificate, type NotarizationCertificateData } from '@/components/documents/NotarizationCertificate'

// ─── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_NOTARIZATIONS = [
  {
    id: 'ntz-1',
    documentTitle: 'Special Power of Attorney – Juan dela Cruz',
    documentType: 'CERTIFICATE',
    status: 'NOTARIZED',
    notaryName: 'Atty. Maria C. Santos',
    notaryRollNo: '56789',
    notaryPtrNo: '7891011/01-04-25/NCR',
    notaryIbpNo: '123456/01-05-25/NCR',
    notaryMcleNo: 'VII-0012345',
    certificateNumber: 'EN-2025-A1B2C3',
    notarizedAt: '2025-03-15T10:30:00Z',
    requestedAt: '2025-03-14T08:00:00Z',
    principalName: 'Juan dela Cruz',
    verificationUrl: 'https://verify.quanbylegal.com/notarization/EN-2025-A1B2C3',
    verificationHash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  },
  {
    id: 'ntz-2',
    documentTitle: 'Affidavit of Witness – Maria Cruz',
    documentType: 'AFFIDAVIT',
    status: 'VERIFIED',
    notaryName: 'Atty. Jose B. Reyes',
    notaryRollNo: '67890',
    notaryPtrNo: '8902112/01-04-25/NCR',
    notaryIbpNo: '234567/01-05-25/NCR',
    notaryMcleNo: 'VII-0023456',
    certificateNumber: null,
    notarizedAt: null,
    requestedAt: '2025-03-17T14:00:00Z',
    principalName: 'Maria Cruz',
    verificationUrl: null,
    verificationHash: null,
  },
  {
    id: 'ntz-3',
    documentTitle: 'Compromise Agreement – Labor Case 001',
    documentType: 'CONTRACT',
    status: 'PENDING',
    notaryName: null,
    notaryRollNo: null,
    notaryPtrNo: null,
    notaryIbpNo: null,
    notaryMcleNo: null,
    certificateNumber: null,
    notarizedAt: null,
    requestedAt: '2025-03-18T09:00:00Z',
    principalName: 'Pedro Santos',
    verificationUrl: null,
    verificationHash: null,
  },
  {
    id: 'ntz-4',
    documentTitle: 'Deed of Absolute Sale – Lot 4 Block 7',
    documentType: 'CONTRACT',
    status: 'REJECTED',
    notaryName: 'Atty. Ana L. Torres',
    notaryRollNo: '78901',
    notaryPtrNo: null,
    notaryIbpNo: null,
    notaryMcleNo: null,
    certificateNumber: null,
    notarizedAt: null,
    requestedAt: '2025-03-12T11:00:00Z',
    principalName: 'Roberto Lim',
    verificationUrl: null,
    verificationHash: null,
    rejectionReason: 'Document contains incomplete property description. Please update and resubmit.',
  },
]

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING:   { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',  icon: '⏳' },
  VERIFIED:  { label: 'Verified',   color: 'bg-blue-100 text-blue-700 border-blue-200',        icon: '🔍' },
  NOTARIZED: { label: 'Notarized',  color: 'bg-green-100 text-green-700 border-green-200',     icon: '✅' },
  REJECTED:  { label: 'Rejected',   color: 'bg-red-100 text-red-700 border-red-200',           icon: '❌' },
}

const STATUS_FLOW = [
  { key: 'UPLOAD',      label: 'Upload',            icon: '⬆️', desc: 'Document submitted' },
  { key: 'PENDING',     label: 'Pending Review',    icon: '⏳', desc: 'Awaiting notary assignment' },
  { key: 'VERIFIED',    label: 'Identity Verified', icon: '🪪', desc: 'Principal identity confirmed' },
  { key: 'NOTARIZED',   label: 'Notarized',         icon: '⚖️', desc: 'Digital seal affixed' },
  { key: 'CERTIFICATE', label: 'Certificate Issued',icon: '🏅', desc: 'Certificate available' },
]

type Notarization = typeof MOCK_NOTARIZATIONS[0]

// ─── Status Flow Indicator ─────────────────────────────────────────────────────

function StatusFlowIndicator({ currentStatus }: { currentStatus: string }) {
  const activeIdx = STATUS_FLOW.findIndex(s => s.key === currentStatus)

  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {STATUS_FLOW.map((step, idx) => (
        <div key={step.key} className="flex items-center shrink-0">
          <div className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 ${
            idx <= activeIdx
              ? 'bg-navy-950 text-white'
              : 'bg-gray-100 text-gray-400'
          }`}>
            <span>{step.icon}</span>
            <span className="hidden sm:inline">{step.label}</span>
          </div>
          {idx < STATUS_FLOW.length - 1 && (
            <span className={`mx-0.5 text-xs ${idx < activeIdx ? 'text-navy-950' : 'text-gray-300'}`}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Notarization Row ──────────────────────────────────────────────────────────

function NotarizationCard({
  item,
  onViewCertificate,
}: {
  item: Notarization
  onViewCertificate: (item: Notarization) => void
}) {
  const statusCfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDING

  return (
    <div className={`bg-white rounded-xl border transition-shadow hover:shadow-md ${
      item.status === 'NOTARIZED' ? 'border-green-200' :
      item.status === 'REJECTED' ? 'border-red-200' :
      'border-gray-200'
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">📄</span>
            <div className="min-w-0">
              <p className="font-semibold text-navy-950 text-sm truncate">{item.documentTitle}</p>
              <p className="text-xs text-gray-500">
                {item.documentType} · Requested {new Date(item.requestedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusCfg.color}`}>
            {statusCfg.icon} {statusCfg.label}
          </span>
        </div>

        {/* Status flow */}
        <StatusFlowIndicator currentStatus={
          item.status === 'PENDING' ? 'PENDING' :
          item.status === 'VERIFIED' ? 'VERIFIED' :
          item.status === 'NOTARIZED' ? 'CERTIFICATE' :
          'UPLOAD'
        } />

        {/* Notary info */}
        {item.notaryName && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Notary:</span>
              <span className="ml-1 font-medium text-navy-950">{item.notaryName}</span>
            </div>
            <div>
              <span className="text-gray-500">Roll No.:</span>
              <span className="ml-1 font-medium text-navy-950">{item.notaryRollNo}</span>
            </div>
            {item.notaryPtrNo && (
              <div>
                <span className="text-gray-500">PTR No.:</span>
                <span className="ml-1 font-medium text-navy-950">{item.notaryPtrNo}</span>
              </div>
            )}
            {item.notaryMcleNo && (
              <div>
                <span className="text-gray-500">MCLE No.:</span>
                <span className="ml-1 font-medium text-navy-950">{item.notaryMcleNo}</span>
              </div>
            )}
          </div>
        )}

        {/* Certificate number */}
        {item.certificateNumber && (
          <div className="mt-2 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-xs">
            <span>🏅</span>
            <span className="text-green-700">
              Certificate No. <strong className="font-mono">{item.certificateNumber}</strong>
            </span>
            {item.notarizedAt && (
              <span className="text-green-600 ml-auto">
                {new Date(item.notarizedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        )}

        {/* Rejection reason */}
        {item.status === 'REJECTED' && (item as typeof item & { rejectionReason?: string }).rejectionReason && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
            <strong>Rejection Reason:</strong> {(item as typeof item & { rejectionReason?: string }).rejectionReason}
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex gap-2">
          {item.status === 'NOTARIZED' && (
            <Button
              size="sm"
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => onViewCertificate(item)}
            >
              🏅 View Certificate
            </Button>
          )}
          {item.verificationUrl && (
            <Button size="sm" variant="outline" className="text-xs">
              🔗 Verify Online
            </Button>
          )}
          {item.status === 'REJECTED' && (
            <Button size="sm" variant="outline" className="text-xs border-red-300 text-red-600">
              🔄 Resubmit
            </Button>
          )}
          {item.status === 'PENDING' && (
            <Button size="sm" variant="outline" className="text-xs">
              🗑️ Cancel Request
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function NotarizationPage() {
  const [showFlow, setShowFlow] = useState(false)
  const [viewCertificate, setViewCertificate] = useState<Notarizationulation | null>(null)

  // Stats
  const stats = {
    total: MOCK_NOTARIZATIONS.length,
    pending: MOCK_NOTARIZATIONS.filter(n => n.status === 'PENDING').length,
    verified: MOCK_NOTARIZATIONS.filter(n => n.status === 'VERIFIED').length,
    notarized: MOCK_NOTARIZATIONS.filter(n => n.status === 'NOTARIZED').length,
  }

  const handleViewCertificate = (item: Notarization) => {
    if (item.status === 'NOTARIZED' && item.certificateNumber) {
      setViewCertificate(item as any)
    }
  }

  const buildCertData = (item: Notarization): NotarizationCertificateData => ({
    certificateNumber: item.certificateNumber!,
    documentTitle: item.documentTitle,
    documentType: item.documentType,
    notaryName: item.notaryName!,
    notaryRollNo: item.notaryRollNo!,
    notaryPtrNo: item.notaryPtrNo ?? undefined,
    notaryIbpNo: item.notaryIbpNo ?? undefined,
    notaryMcleNo: item.notaryMcleNo ?? undefined,
    notarizedAt: item.notarizedAt!,
    principalName: item.principalName,
    verificationUrl: item.verificationUrl!,
    verificationHash: item.verificationHash!,
  })

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ─── Page Header ─── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">e-Notarization</h1>
          <p className="text-sm text-gray-500 mt-1">
            Electronic notarization compliant with A.M. No. 20-07-04-SC (2020 Rules on Remote Online Notarization)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <ComplianceBadge standard="SC-RULES" variant="compact" />
          <ComplianceBadge standard="RA-10173" variant="compact" />
          <Button
            size="sm"
            onClick={() => setShowFlow(true)}
            className="bg-navy-950 hover:bg-navy-800 text-white"
          >
            ⚖️ New Notarization Request
          </Button>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link href="/dashboard" className="hover:text-navy-950">Dashboard</Link>
        <span className="mx-2">/</span>
        <span className="text-navy-950 font-medium">e-Notarization</span>
      </nav>

      {/* ─── Supreme Court Compliance Banner ─── */}
      <div className="bg-gradient-to-r from-navy-950 to-blue-900 text-white rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="text-4xl shrink-0">⚖️</div>
          <div className="flex-1">
            <h2 className="font-bold text-lg">Republic of the Philippines</h2>
            <p className="text-blue-200 text-sm">Supreme Court Electronic Notarization System</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 border border-white/30">
                ✅ A.M. No. 20-07-04-SC
              </span>
              <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 border border-white/30">
                ✅ 2004 Rules on Notarial Practice
              </span>
              <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 border border-white/30">
                ✅ RA 10173 Compliant
              </span>
              <span className="text-xs bg-white/20 text-white rounded-full px-2 py-0.5 border border-white/30">
                ✅ PKI Digital Signatures
              </span>
            </div>
          </div>
          <div className="shrink-0 hidden md:block">
            <div className="w-16 h-16 rounded-full border-4 border-double border-amber-400 bg-white/10 flex items-center justify-center">
              <span className="text-3xl">🏅</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Demo Disclaimer ─── */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-lg shrink-0">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-yellow-800">Demo Simulation Only</p>
            <p className="text-sm text-yellow-700 mt-1">
              This is a simulated e-notarization workflow for demonstration purposes.
              Real notarization requires physical appearance before a notary public or
              compliance with A.M. No. 20-07-04-SC for remote online notarization.
              Digital certificates generated here are for demonstration only.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total,     icon: '📋', color: 'text-navy-950' },
          { label: 'Pending',        value: stats.pending,   icon: '⏳', color: 'text-yellow-700' },
          { label: 'Verified',       value: stats.verified,  icon: '🔍', color: 'text-blue-700' },
          { label: 'Notarized',      value: stats.notarized, icon: '✅', color: 'text-green-700' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Status Flow Guide ─── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-sm font-semibold text-navy-950 mb-3">Notarization Process Flow</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_FLOW.map((step, idx) => (
            <div key={step.key} className="flex items-center shrink-0">
              <div className="flex flex-col items-center gap-1">
                <div className="h-10 w-10 rounded-full bg-navy-950 text-white flex items-center justify-center text-sm">
                  {step.icon}
                </div>
                <p className="text-xs font-medium text-navy-950 text-center w-16 leading-tight">{step.label}</p>
                <p className="text-xs text-gray-400 text-center w-16 leading-tight hidden sm:block">{step.desc}</p>
              </div>
              {idx < STATUS_FLOW.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Notarization Queue ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-navy-950">
            Notarization Queue
            <span className="ml-2 text-sm font-normal text-gray-500">({MOCK_NOTARIZATIONS.length} records)</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_NOTARIZATIONS.map(item => (
            <NotarizationCard
              key={item.id}
              item={item}
              onViewCertificate={handleViewCertificate}
            />
          ))}
        </div>
      </div>

      {/* ─── e-Notarization Flow Dialog ─── */}
      <Dialog open={showFlow} onOpenChange={setShowFlow}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>⚖️</span>
              <span>e-Notarization Request</span>
            </DialogTitle>
          </DialogHeader>
          <ENotarizationFlow
            onClose={() => setShowFlow(false)}
            onComplete={() => {
              // In production: refresh notarization list
              setShowFlow(false)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* ─── Certificate View Dialog ─── */}
      <Dialog
        open={!!viewCertificate}
        onOpenChange={() => setViewCertificate(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>🏅</span>
              <span>Notarization Certificate</span>
            </DialogTitle>
          </DialogHeader>
          {viewCertificate && (
            <NotarizationCertificate
              data={buildCertData(viewCertificate as Notarization)}
              onClose={() => setViewCertificate(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── Local type alias ──────────────────────────────────────────────────────────
type Notarizationulation = typeof MOCK_NOTARIZATIONS[0]
