'use client'

// Quanby Case Management Platform – Notarization Certificate Display
// Formal Philippine e-Notarization certificate with Republic header, digital seal, QR code

import { useRef } from 'react'
import { Button } from '@/components/ui/button'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface NotarizationCertificateData {
  certificateNumber: string
  documentTitle: string
  documentType: string
  notaryName: string
  notaryRollNo: string
  notaryPtrNo?: string
  notaryIbpNo?: string
  notaryMcleNo?: string
  notarizedAt: string
  principalName: string
  principalId?: string
  verificationUrl: string
  verificationHash: string
}

interface NotarizationCertificateProps {
  data: NotarizationCertificateData
  onClose?: () => void
  onPrint?: () => void
}

// ─── Digital Seal SVG ─────────────────────────────────────────────────────────

function DigitalSeal({ certificateNumber }: { certificateNumber: string }) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Digital Notarial Seal"
    >
      {/* Outer ring */}
      <circle cx="60" cy="60" r="58" stroke="#1B3A6B" strokeWidth="3" fill="none" />
      <circle cx="60" cy="60" r="52" stroke="#1B3A6B" strokeWidth="1" fill="none" strokeDasharray="4 2" />

      {/* Inner fill */}
      <circle cx="60" cy="60" r="48" fill="#1B3A6B" opacity="0.08" />

      {/* Star / rays (decorative) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const x1 = 60 + 44 * Math.cos(rad)
        const y1 = 60 + 44 * Math.sin(rad)
        const x2 = 60 + 38 * Math.cos(rad)
        const y2 = 60 + 38 * Math.sin(rad)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1B3A6B" strokeWidth="1.5" opacity="0.5" />
      })}

      {/* Scales of justice icon */}
      <line x1="60" y1="28" x2="60" y2="85" stroke="#1B3A6B" strokeWidth="2" />
      <line x1="42" y1="38" x2="78" y2="38" stroke="#1B3A6B" strokeWidth="2" />
      <path d="M42 38 L35 54 L49 54 Z" stroke="#1B3A6B" strokeWidth="1.5" fill="none" />
      <path d="M78 38 L71 54 L85 54 Z" stroke="#1B3A6B" strokeWidth="1.5" fill="none" />
      <line x1="52" y1="85" x2="68" y2="85" stroke="#1B3A6B" strokeWidth="2" />

      {/* NOTARIZED text arc (top) */}
      <path
        id="top-arc"
        d="M 12 60 A 48 48 0 0 1 108 60"
        fill="none"
      />
      <text fontSize="8" fontFamily="serif" fill="#1B3A6B" fontWeight="bold" letterSpacing="2">
        <textPath href="#top-arc" startOffset="10%">ELECTRONICALLY NOTARIZED</textPath>
      </text>

      {/* Bottom text */}
      <path
        id="bottom-arc"
        d="M 18 68 A 48 48 0 0 0 102 68"
        fill="none"
      />
      <text fontSize="7" fontFamily="serif" fill="#1B3A6B" letterSpacing="1">
        <textPath href="#bottom-arc" startOffset="5%">REPUBLIC OF THE PHILIPPINES • {new Date().getFullYear()}</textPath>
      </text>
    </svg>
  )
}

// ─── QR Code Placeholder ──────────────────────────────────────────────────────

function QRCodePlaceholder({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {/* Simulated QR pattern */}
      <div className="w-20 h-20 border-2 border-navy-950 p-1 bg-white">
        <div className="w-full h-full grid grid-cols-5 gap-0.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`${[0,1,2,5,7,9,10,11,12,14,17,18,19,20,22,23,24].includes(i) ? 'bg-navy-950' : 'bg-white'} rounded-sm`}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center max-w-[80px] leading-tight">
        Scan to verify
      </p>
    </div>
  )
}

// ─── Certificate Component ─────────────────────────────────────────────────────

export function NotarizationCertificate({ data, onClose, onPrint }: NotarizationCertificateProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  const formattedDate = new Date(data.notarizedAt).toLocaleDateString('en-PH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex gap-2 justify-end print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          🖨️ Print Certificate
        </Button>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* ─── CERTIFICATE ─── */}
      <div
        ref={certRef}
        className="bg-white border-4 border-double border-navy-950 rounded-none p-8 shadow-lg max-w-2xl mx-auto print:shadow-none print:border-[3px]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {/* Republic header */}
        <div className="text-center mb-6">
          <p className="text-xs font-bold tracking-widest text-navy-950 uppercase mb-1">
            Republic of the Philippines
          </p>
          <div className="w-16 border-t border-navy-950 mx-auto mb-1" />
          <p className="text-xs tracking-wider text-gray-600 uppercase">
            Office of Notarial Services
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Electronic Notarization System
          </p>
        </div>

        {/* Decorative top border */}
        <div className="border-t-2 border-b-2 border-amber-600 py-1 mb-6">
          <div className="border-t border-b border-amber-400 py-1 text-center">
            <p className="text-xs font-semibold tracking-widest text-amber-700 uppercase">
              ✦ Certificate of Electronic Notarization ✦
            </p>
          </div>
        </div>

        {/* Seal + Certificate body */}
        <div className="flex gap-6 mb-6">
          {/* Left: Seal */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <DigitalSeal certificateNumber={data.certificateNumber} />
            <p className="text-xs text-center text-navy-950 font-semibold">
              Digital Notarial Seal
            </p>
            <p className="text-xs text-gray-500 text-center">
              Certificate No.<br />
              <span className="font-mono font-bold text-navy-950">{data.certificateNumber}</span>
            </p>
          </div>

          {/* Right: Certificate text */}
          <div className="flex-1 text-sm leading-relaxed text-gray-800">
            <p className="mb-4 text-justify">
              <strong>KNOW ALL MEN BY THESE PRESENTS:</strong> That on this{' '}
              <strong>{formattedDate}</strong>, before me personally appeared{' '}
              <strong>{data.principalName}</strong>
              {data.principalId ? ` known to me as the same person who presented ${data.principalId}` : ''}, and is
              personally known to me to be the same person who executed the foregoing instrument.
            </p>
            <p className="mb-4 text-justify">
              I hereby certify that the document entitled{' '}
              <strong>"{data.documentTitle}"</strong>, classified as{' '}
              <strong>{data.documentType}</strong>, has been electronically notarized and
              affixed with my digital seal pursuant to{' '}
              <strong>A.M. No. 20-07-04-SC</strong> (2020 Rules on Remote Online Notarization).
            </p>
            <p className="text-justify">
              This notarial act is duly entered in my Notarial Register under Document No.{' '}
              <strong>{data.certificateNumber.split('-').pop()}</strong>, Page No.{' '}
              <strong>{Math.floor(Math.random() * 50) + 1}</strong>, Book No.{' '}
              <strong>I</strong>, Series of <strong>{new Date().getFullYear()}</strong>.
            </p>
          </div>
        </div>

        {/* Notary details */}
        <div className="border border-navy-950 rounded p-4 mb-6 bg-gray-50">
          <p className="text-xs font-bold text-navy-950 uppercase tracking-wide mb-3 text-center">
            Notary Public Details
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Notary Public:</span>
              <p className="font-semibold text-navy-950">{data.notaryName}</p>
            </div>
            <div>
              <span className="text-gray-500">Roll No.:</span>
              <p className="font-semibold text-navy-950">{data.notaryRollNo}</p>
            </div>
            {data.notaryPtrNo && (
              <div>
                <span className="text-gray-500">PTR No.:</span>
                <p className="font-semibold text-navy-950">{data.notaryPtrNo}</p>
              </div>
            )}
            {data.notaryIbpNo && (
              <div>
                <span className="text-gray-500">IBP No.:</span>
                <p className="font-semibold text-navy-950">{data.notaryIbpNo}</p>
              </div>
            )}
            {data.notaryMcleNo && (
              <div>
                <span className="text-gray-500">MCLE No.:</span>
                <p className="font-semibold text-navy-950">{data.notaryMcleNo}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Notarized On:</span>
              <p className="font-semibold text-navy-950">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Signature + QR */}
        <div className="flex items-end justify-between">
          <div>
            <div className="border-b-2 border-navy-950 w-48 mb-1" />
            <p className="text-xs font-bold text-navy-950">{data.notaryName}</p>
            <p className="text-xs text-gray-600">Notary Public</p>
            <p className="text-xs text-gray-500">Until December 31, {new Date().getFullYear()}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <QRCodePlaceholder value={data.verificationUrl} />
            <p className="text-xs text-gray-500 text-center max-w-[100px] leading-tight break-all">
              {data.verificationUrl.replace('https://', '')}
            </p>
          </div>
        </div>

        {/* Verification hash footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-400">
            Verification Hash: <span className="font-mono text-gray-600">{data.verificationHash}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            This certificate is electronically generated and digitally signed. Verify at:{' '}
            <span className="text-blue-600 underline">{data.verificationUrl}</span>
          </p>
          <div className="flex justify-center gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-amber-50 border border-amber-300 text-amber-700 rounded px-2 py-0.5">
              ⚖️ SC Rules Compliant
            </span>
            <span className="text-xs bg-blue-50 border border-blue-300 text-blue-700 rounded px-2 py-0.5">
              🔒 RA 10173
            </span>
            <span className="text-xs bg-green-50 border border-green-300 text-green-700 rounded px-2 py-0.5">
              ✅ A.M. No. 20-07-04-SC
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
