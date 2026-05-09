// Quanby Case Management Platform – Decorative QR Code Component
// Renders a static QR-like SVG pattern for display on certificates.
// Not a real QR encoder; use for visual representation only.

interface QRCodeProps {
  url: string
  size?: number
  className?: string
}

// Fixed decorative pixel grid (7×7 with position detection patterns)
const PIXELS: boolean[] = [
  true,  true,  true,  true,  true,  true,  true,
  true,  false, false, false, false, false, true,
  true,  false, true,  false, true,  false, true,
  true,  false, false, true,  false, false, true,
  true,  false, true,  false, true,  false, true,
  true,  false, false, false, false, false, true,
  true,  true,  true,  true,  true,  true,  true,
]

export function QRCode({ url: _url, size = 80, className }: QRCodeProps) {
  const cellSize = size / 7
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="QR code for certificate verification"
    >
      <rect width={size} height={size} fill="white" />
      {PIXELS.map((filled, i) => {
        const col = i % 7
        const row = Math.floor(i / 7)
        return (
          <rect
            key={i}
            x={col * cellSize}
            y={row * cellSize}
            width={cellSize}
            height={cellSize}
            fill={filled ? '#1B3A6B' : 'white'}
          />
        )
      })}
    </svg>
  )
}
