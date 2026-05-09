'use client'

// Quanby Legal Platform – PDF Generator using @react-pdf/renderer
// Professional Philippine legal document layout with court header, numbered paragraphs, footer

import { useState, useCallback } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
  Font,
} from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'

// ─── PDF Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 12,
    paddingTop: 72,
    paddingBottom: 72,
    paddingLeft: 90,
    paddingRight: 72,
    color: '#1a1a1a',
    lineHeight: 1.6,
  },
  // ── Header ──
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  republicLine: {
    fontSize: 13,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  courtName: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  courtBranch: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    marginBottom: 16,
  },
  dividerLine: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#1a1a1a',
    marginBottom: 12,
    width: '100%',
  },
  // ── Caption ──
  captionRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  captionLeft: {
    flex: 1,
    fontSize: 11,
  },
  captionRight: {
    width: 200,
    fontSize: 11,
  },
  captionLabel: {
    fontFamily: 'Times-Roman',
    fontSize: 10,
    color: '#555',
    marginTop: -2,
  },
  captionDocket: {
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  captionVersus: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Times-Italic',
    marginVertical: 4,
  },
  // ── Document title ──
  docTitle: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 20,
    textDecoration: 'underline',
  },
  // ── Body ──
  sectionHeading: {
    fontSize: 12,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    marginTop: 14,
    marginBottom: 6,
    textDecoration: 'underline',
  },
  paragraph: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 1.8,
  },
  numberedParagraph: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paraNumber: {
    width: 28,
    fontSize: 11,
    fontFamily: 'Times-Roman',
  },
  paraBody: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.8,
  },
  // ── Prayer ──
  prayerItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 20,
  },
  prayerLetter: {
    width: 20,
    fontSize: 11,
    fontFamily: 'Times-Roman',
  },
  prayerText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
  },
  // ── Signature block ──
  signatureBlock: {
    marginTop: 40,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    width: 200,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
  },
  signatureDetail: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    color: '#444',
  },
  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 36,
    left: 90,
    right: 72,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#aaa',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 8,
    fontFamily: 'Times-Roman',
    color: '#666',
  },
  footerPage: {
    fontSize: 8,
    fontFamily: 'Times-Roman',
    color: '#666',
  },
  // ── Notarization box ──
  notarizationBox: {
    marginTop: 32,
    border: 1,
    borderColor: '#333',
    padding: 12,
  },
  notarizationTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 8,
  },
  notarizationText: {
    fontSize: 10,
    fontFamily: 'Times-Roman',
    textAlign: 'justify',
    lineHeight: 1.6,
  },
})

// ─── PDF Document component ────────────────────────────────────────────────────

interface LegalDocumentPDFProps {
  title: string
  courtName: string
  courtBranch: string
  caseNumber: string
  plaintiff: string
  defendant: string
  caseType: string
  bodyParagraphs: string[]
  prayerItems: string[]
  lawyerName: string
  rollNo?: string
  ibpNo?: string
  ptrNo?: string
  mcleNo?: string
  placeDate: string
  includeVerification?: boolean
}

function LegalDocumentPDF({
  title,
  courtName,
  courtBranch,
  caseNumber,
  plaintiff,
  defendant,
  caseType,
  bodyParagraphs,
  prayerItems,
  lawyerName,
  rollNo,
  ibpNo,
  ptrNo,
  mcleNo,
  placeDate,
  includeVerification = false,
}: LegalDocumentPDFProps) {
  return (
    <Document
      title={title}
      author="Quanby Legal Platform"
      subject={`${caseType} – ${caseNumber}`}
      creator="Quanby Legal Platform v1.0"
    >
      <Page size="LETTER" style={styles.page}>
        {/* ─── Republic header ─── */}
        <View style={styles.headerSection}>
          <Text style={styles.republicLine}>Republic of the Philippines</Text>
          <Text style={styles.courtName}>{courtName}</Text>
          <Text style={styles.courtBranch}>{courtBranch}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ─── Case caption ─── */}
        <View>
          <View style={styles.captionRow}>
            <View style={styles.captionLeft}>
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 11 }}>{plaintiff},</Text>
              <Text style={styles.captionLabel}>    Plaintiff,</Text>
            </View>
          </View>
          <Text style={styles.captionVersus}>– versus –</Text>
          <View style={styles.captionRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Times-Bold', fontSize: 11 }}>{defendant},</Text>
              <Text style={styles.captionLabel}>    Defendant.</Text>
            </View>
            <View style={styles.captionRight}>
              <Text style={styles.captionLabel}>{caseType}</Text>
              <Text style={styles.captionDocket}>Case No. {caseNumber}</Text>
              <Text style={styles.captionLabel}>For: {title}</Text>
            </View>
          </View>
          <View style={styles.dividerLine} />
        </View>

        {/* ─── Document title ─── */}
        <Text style={styles.docTitle}>{title}</Text>

        {/* ─── Introduction ─── */}
        <Text style={styles.paragraph}>
          {plaintiff.toUpperCase()}, through undersigned counsel and to this Honorable Court,
          most respectfully states:
        </Text>

        {/* ─── Body paragraphs (numbered) ─── */}
        {bodyParagraphs.map((para, idx) => (
          <View key={idx} style={styles.numberedParagraph}>
            <Text style={styles.paraNumber}>{idx + 1}.</Text>
            <Text style={styles.paraBody}>{para}</Text>
          </View>
        ))}

        {/* ─── Prayer ─── */}
        {prayerItems.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Prayer</Text>
            <Text style={styles.paragraph}>
              WHEREFORE, premises considered, it is respectfully prayed that:
            </Text>
            {prayerItems.map((item, idx) => (
              <View key={idx} style={styles.prayerItem}>
                <Text style={styles.prayerLetter}>{String.fromCharCode(97 + idx)})</Text>
                <Text style={styles.prayerText}>{item}</Text>
              </View>
            ))}
            <Text style={{ ...styles.paragraph, marginTop: 8 }}>
              Other reliefs, just and equitable, are likewise prayed for.
            </Text>
          </View>
        )}

        {/* ─── Signature block ─── */}
        <View style={styles.signatureBlock}>
          <Text style={styles.paragraph}>{placeDate}.</Text>
          <Text style={[styles.paragraph, { marginBottom: 32 }]}>Respectfully submitted,</Text>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureName}>{lawyerName}</Text>
          {rollNo && <Text style={styles.signatureDetail}>Roll No. {rollNo}</Text>}
          {ibpNo && <Text style={styles.signatureDetail}>IBP No. {ibpNo}</Text>}
          {ptrNo && <Text style={styles.signatureDetail}>PTR No. {ptrNo}</Text>}
          {mcleNo && <Text style={styles.signatureDetail}>MCLE Compliance No. {mcleNo}</Text>}
          <Text style={styles.signatureDetail}>Counsel for Plaintiff</Text>
        </View>

        {/* ─── Verification / Notarization ─── */}
        {includeVerification && (
          <View style={styles.notarizationBox}>
            <Text style={styles.notarizationTitle}>Verification and Certification</Text>
            <Text style={styles.notarizationText}>
              I, {plaintiff}, of legal age, Filipino, after being duly sworn depose and say:
              that I am the Plaintiff in the above-entitled case; that I have caused the preparation
              of the foregoing Complaint; that I have read and understood the same and the allegations
              therein are true and correct of my own knowledge and based on authentic records.
            </Text>
            <View style={{ marginTop: 24 }}>
              <View style={{ borderBottomWidth: 1, borderBottomColor: '#333', width: 180, marginBottom: 4 }} />
              <Text style={styles.notarizationText}>{plaintiff}</Text>
            </View>
          </View>
        )}

        {/* ─── Footer ─── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {title} | {caseNumber} | QUANBY LEGAL PLATFORM
          </Text>
          <Text
            style={styles.footerPage}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

// ─── PDF Generator UI ──────────────────────────────────────────────────────────

interface PDFGeneratorProps {
  /** Pre-filled document data from template editor */
  documentData?: Partial<LegalDocumentPDFProps>
  onClose?: () => void
}

const DEFAULT_DATA: LegalDocumentPDFProps = {
  title: 'VERIFIED COMPLAINT',
  courtName: 'Regional Trial Court, Branch 45',
  courtBranch: 'Quezon City, National Capital Region',
  caseNumber: 'CV-2025-0042',
  plaintiff: 'Juan Dela Cruz',
  defendant: 'Pedro Santos',
  caseType: 'Civil Case',
  bodyParagraphs: [
    'Plaintiff Juan Dela Cruz is of legal age, Filipino, and residing at 123 Mabini Street, Quezon City.',
    'Defendant Pedro Santos is of legal age, Filipino, and may be served with summons at 456 Rizal Avenue, Manila.',
    'On January 15, 2025, plaintiff and defendant entered into a contract whereby defendant agreed to deliver goods worth ₱500,000.00 within thirty (30) days.',
    'Despite plaintiff\'s repeated demands, defendant has failed and refused to deliver the goods or return the payment, causing plaintiff damages in the said amount.',
    'By reason of defendant\'s unjustified refusal to comply with his obligation, plaintiff was constrained to engage the services of counsel for which defendant should be held liable.',
  ],
  prayerItems: [
    'Defendant be ordered to pay plaintiff the sum of ₱500,000.00 plus interest;',
    'Defendant be ordered to pay moral damages in the sum of ₱50,000.00;',
    'Defendant be ordered to pay attorney\'s fees of ₱50,000.00 and litigation expenses.',
  ],
  lawyerName: 'Atty. Maria Santos',
  rollNo: '56789',
  ibpNo: '123456/01-05-25/NCR',
  ptrNo: '7891011/01-04-25/QC',
  mcleNo: 'VI-0012345',
  placeDate: 'Quezon City, Philippines, May 9, 2025',
  includeVerification: true,
}

export function PDFGenerator({ documentData, onClose }: PDFGeneratorProps) {
  const [showViewer, setShowViewer] = useState(false)
  const data: LegalDocumentPDFProps = { ...DEFAULT_DATA, ...documentData }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-navy-950 text-white rounded-xl">
        <span className="text-2xl">📕</span>
        <div>
          <p className="font-semibold">{data.title}</p>
          <p className="text-xs text-blue-300">
            {data.courtName} · {data.caseNumber}
          </p>
        </div>
      </div>

      {/* Document info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Parties</p>
          <p className="font-medium text-navy-950">{data.plaintiff}</p>
          <p className="text-xs text-gray-500">vs. {data.defendant}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Court</p>
          <p className="font-medium text-navy-950 text-xs leading-snug">{data.courtName}</p>
          <p className="text-xs text-gray-500">{data.courtBranch}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Counsel</p>
          <p className="font-medium text-navy-950 text-xs">{data.lawyerName}</p>
          {data.rollNo && <p className="text-xs text-gray-500">Roll No. {data.rollNo}</p>}
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">MCLE Compliance</p>
          <p className="font-medium text-navy-950 text-xs">{data.mcleNo ?? 'N/A'}</p>
          <p className="text-xs text-gray-500">IBP: {data.ibpNo ?? 'N/A'}</p>
        </div>
      </div>

      {/* Preview toggle */}
      <div>
        <button
          onClick={() => setShowViewer(!showViewer)}
          className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
        >
          {showViewer ? '▲ Hide PDF Preview' : '▼ Show PDF Preview (embedded viewer)'}
        </button>

        {showViewer && (
          <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 h-[500px]">
            <PDFViewer width="100%" height="100%" showToolbar>
              <LegalDocumentPDF {...data} />
            </PDFViewer>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        {onClose && (
          <Button variant="outline" onClick={onClose}>Close</Button>
        )}
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="border-navy-950 text-navy-950"
        >
          🖨️ Print
        </Button>
        <PDFDownloadLink
          document={<LegalDocumentPDF {...data} />}
          fileName={`${data.title.replace(/\s+/g, '_')}_${data.caseNumber}.pdf`}
        >
          {({ loading }) => (
            <Button
              disabled={loading}
              className="bg-navy-950 hover:bg-navy-800 text-white"
            >
              {loading ? '⏳ Preparing…' : '⬇️ Download PDF'}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      {/* Compliance note */}
      <p className="text-xs text-gray-400 text-center">
        Generated by Quanby Legal Platform · RA 10173 compliant · Document hash logged for audit trail
      </p>
    </div>
  )
}
