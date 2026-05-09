'use client'

// Quanby Case Management Platform – SVG QR Code Component
// Generates a deterministic QR-like pattern from a verification URL string
// Uses a simple hash-based cell fill for a visually convincing grid

interface QRCodeProps {
  value: string
  size?: number
  cellSize?: number
  className?: string
  darkColor?: string
  lightColor?: string
}

/**
 * Simple djb2 hash for deterministic cell generation from a string.
 */
function djb2Hash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
    hash = hash >>> 0 // keep as unsigned 32-bit
  }
  return hash
}

/**
 * Generates a pseudo-random cell map for the QR-like grid.
 * Fixed finder pattern corners are always present.
 */
function generateCellMap(value: string, gridSize: number): boolean[][] {
  const cells: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  )

  // Seed fill using hash of value + position
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const seed = djb2Hash(`${value}:${row}:${col}`)
      cells[row][col] = seed % 3 !== 0 // ~67% fill density
    }
  }

  // ── Finder pattern top-left (7x7 with white inner ring) ──
  const drawFinder = (startRow: number, startCol: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const row = startRow + r
        const col = startCol + c
        if (row >= gridSize || col >= gridSize) continue
        const outerBorder = r === 0 || r === 6 || c === 0 || c === 6
        const innerBlock = r >= 2 && r <= 4 && c >= 2 && c <= 4
        cells[row][col] = outerBorder || innerBlock
      }
    }
    // White separator ring around finder
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const row = startRow + r
        const col = startCol + c
        if (row < 0 || col < 0 || row >= gridSize || col >= gridSize) continue
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          cells[row][col] = false
        }
      }
    }
  }

  drawFinder(0, 0)                         // top-left
  drawFinder(0, gridSize - 7)              // top-right
  drawFinder(gridSize - 7, 0)             // bottom-left

  // ── Alignment pattern (small 5x5 block near bottom-right) ──
  const ap = gridSize - 9
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const outerRing = r === 0 || r === 4 || c === 0 || c === 4
      const center = r === 2 && c === 2
      cells[ap + r][ap + c] = outerRing || center
    }
  }

  // ── Timing patterns ──
  for (let i = 8; i < gridSize - 8; i++) {
    cells[6][i] = i % 2 === 0
    cells[i][6] = i % 2 === 0
  }

  return cells
}

export function QRCode({
  value,
  size = 120,
  cellSize,
  className,
  darkColor = '#0F172A',
  lightColor = '#FFFFFF',
}: QRCodeProps) {
  const QUIET = 2           // quiet zone cells on each side
  const GRID = 21           // standard QR v1 is 21x21
  const cells = generateCellMap(value, GRID)

  const totalCells = GRID + QUIET * 2
  const cs = cellSize ?? size / totalCells

  const svgSize = totalCells * cs

  return (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      className={className}
      role="img"
      aria-label={`QR code for: ${value}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width={svgSize} height={svgSize} fill={lightColor} />

      {/* Cells */}
      {cells.map((row, r) =>
        row.map((dark, c) =>
          dark ? (
            <rect
              key={`${r}-${c}`}
              x={(c + QUIET) * cs}
              y={(r + QUIET) * cs}
              width={cs}
              height={cs}
              fill={darkColor}
            />
          ) : null
        )
      )}
    </svg>
  )
}
