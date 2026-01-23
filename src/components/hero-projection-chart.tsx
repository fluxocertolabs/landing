import { useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/cn'

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function makeLinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return ''
  let d = `M ${points[0]!.x.toFixed(2)} ${points[0]!.y.toFixed(2)}`
  for (let i = 1; i < points.length; i++) {
    const p = points[i]!
    d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`
  }
  return d
}

function makeAreaPath(points: Array<{ x: number; y: number }>, yBottom: number) {
  if (points.length === 0) return ''
  const first = points[0]!
  const last = points[points.length - 1]!
  return (
    `M ${first.x.toFixed(2)} ${yBottom.toFixed(2)}` +
    ` L ${first.x.toFixed(2)} ${first.y.toFixed(2)}` +
    points
      .slice(1)
      .map((p) => ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
      .join('') +
    ` L ${last.x.toFixed(2)} ${yBottom.toFixed(2)}` +
    ' Z'
  )
}

function findDangerRange(values: number[]) {
  let start: number | null = null
  let end: number | null = null

  for (let i = 0; i < values.length; i++) {
    if (values[i]! < 0) {
      if (start === null) start = i
      end = i
    }
  }

  if (start === null || end === null) return null
  return { start, end }
}

function buildStaticSeries(params: {
  count: number
  kind: 'optimistic' | 'pessimistic'
}) {
  const { count, kind } = params

  const base = kind === 'optimistic' ? 48 : 36
  const amp = kind === 'optimistic' ? 16 : 15
  const wobble = kind === 'optimistic' ? 2.0 : 1.8

  // A fixed dip so the marker occasionally hits "danger days".
  // This is intentionally strong enough to guarantee some points go < 0.
  const dipCenter = 0.33

  const vals: number[] = []
  for (let i = 0; i < count; i++) {
    const u = i / (count - 1)

    const w1 = Math.sin(u * 1.45 * Math.PI * 2 + 0.25)
    const w2 = Math.sin(u * 3.3 * Math.PI * 2 + 0.9)
    const w3 = Math.sin(u * 6.6 * Math.PI * 2 + 1.75)
    const noise = (w2 * 0.35 + w3 * 0.15) * wobble

    let v = base + w1 * amp + noise

    if (kind === 'pessimistic') {
      const d = Math.abs(u - dipCenter)
      // Wide gaussian dip + triangular notch = guaranteed danger pocket.
      const dip = Math.exp(-Math.pow(d * 6.6, 2)) * 56
      const notch = Math.max(0, 1 - Math.abs(u - dipCenter) / 0.085) * 18
      v -= dip + notch
    } else {
      // optimistic gets a subtle lift to keep it generally higher.
      v += lerp(1.0, 2.8, Math.sin(u * 0.75 * Math.PI * 2 - 0.35) * 0.5 + 0.5)
    }

    vals.push(clamp(v, -45, 90))
  }
  return vals
}

function mapToPoints(params: {
  values: number[]
  w: number
  h: number
  pad: number
  vMin: number
  vMax: number
}) {
  const { values, w, h, pad, vMin, vMax } = params
  const innerW = w - pad * 2
  const innerH = h - pad * 2

  const toX = (i: number) => pad + (i / (values.length - 1)) * innerW
  const toY = (v: number) => {
    const t = (v - vMin) / (vMax - vMin)
    return pad + (1 - t) * innerH
  }

  return {
    toX,
    toY,
    points: values.map((v, i) => ({ x: toX(i), y: toY(v) })),
  }
}

export function HeroProjectionChart({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0) // 0..1 (within sweep)
  const [markerVisible, setMarkerVisible] = useState(true)

  useEffect(() => {
    if (reduce) return

    let raf = 0
    const start = performance.now()

    const tick = (now: number) => {
      // Smooth left -> right sweep for the marker + a brief "gap" at the end.
      const sweepMs = 9800
      const gapMs = 900
      const totalMs = sweepMs + gapMs
      const u = ((now - start) % totalMs) / totalMs

      if (u < sweepMs / totalMs) {
        const t = u / (sweepMs / totalMs)
        setMarkerVisible(true)
        setProgress(t)
      } else {
        setMarkerVisible(false)
        setProgress(1)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  const {
    optLine,
    pessLine,
    optArea,
    pessArea,
    cursor,
    markerOpacity,
    isInDangerZone,
    dangerZoneX,
    dangerZoneW,
    yZero,
  } = useMemo(() => {
    const w = 320
    const h = 112
    const pad = 8
    const count = 56
    const vMin = -40
    const vMax = 90

    const optVals = buildStaticSeries({ count, kind: 'optimistic' })
    const pessVals = buildStaticSeries({ count, kind: 'pessimistic' })

    const mappedOpt = mapToPoints({ values: optVals, w, h, pad, vMin, vMax })
    const mappedPess = mapToPoints({ values: pessVals, w, h, pad, vMin, vMax })

    const yBottom = h - pad
    const yZero = mappedOpt.toY(0)

    // Marker that moves left->right; lines stay static.
    const t = clamp(progress, 0, 1)
    const cursorPos = t * (count - 1) // continuous "day" position
    const i0 = Math.floor(cursorPos)
    const i1 = Math.min(count - 1, i0 + 1)
    const frac = cursorPos - i0

    // X can be continuous; Y is interpolated between adjacent points for smooth motion.
    const innerW = w - pad * 2
    const cursorX = pad + (cursorPos / (count - 1)) * innerW
    const y0 = mappedOpt.points[i0]?.y ?? mappedOpt.points[0]!.y
    const y1 = mappedOpt.points[i1]?.y ?? y0
    const cursorY = lerp(y0, y1, frac)

    const danger = findDangerRange(pessVals)
    const range = danger ?? { start: Math.round(count * 0.28), end: Math.round(count * 0.4) }
    const dangerZoneX = mappedOpt.toX(range.start)
    const dangerZoneW = Math.max(10, mappedOpt.toX(range.end + 1) - dangerZoneX)
    const isInDangerZone = cursorPos >= range.start && cursorPos <= range.end + 0.999

    // Slight fade out during the gap so it doesn't "blink".
    const markerOpacity = markerVisible ? 1 : 0

    return {
      optLine: makeLinePath(mappedOpt.points),
      pessLine: makeLinePath(mappedPess.points),
      optArea: makeAreaPath(mappedOpt.points, yBottom),
      pessArea: makeAreaPath(mappedPess.points, yBottom),
      yZero,
      cursor: { x: cursorX, y: cursorY },
      markerOpacity,
      isInDangerZone,
      dangerZoneX,
      dangerZoneW,
    }
  }, [progress, markerVisible])

  return (
    <svg
      className={cn('h-full w-full', className)}
      viewBox="0 0 320 112"
      preserveAspectRatio="none"
      role="img"
      aria-label="Gráfico animado de projeção (cenário otimista e pessimista)"
    >
      <defs>
        <clipPath id="fcHeroReveal">
          <motion.rect
            x="0"
            y="0"
            height="112"
            initial={reduce ? false : { width: 0 }}
            animate={reduce ? { width: 320 } : { width: 320 }}
            transition={
              reduce
                ? undefined
                : { duration: 1.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 }
            }
          />
        </clipPath>

        <linearGradient id="fcHeroOptFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="fcHeroPessFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="fcHeroDanger" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0.06" />
        </linearGradient>

        <pattern
          id="fcHeroGrid"
          width="28"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path d="M 28 0 L 0 0 0 18" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* background grid */}
      <rect x="0" y="0" width="320" height="112" fill="url(#fcHeroGrid)" opacity="0.18" />

      {/* Persistent danger zone band (pessimistic < 0 window) */}
      <rect x={dangerZoneX} y={0} width={dangerZoneW} height={112} fill="url(#fcHeroDanger)" opacity="0.55" />
      <rect
        x={dangerZoneX}
        y={0}
        width={dangerZoneW}
        height={112}
        fill="none"
        stroke="rgba(239,68,68,0.28)"
        strokeWidth="1"
      />

      {/* zero line */}
      <line
        x1="0"
        x2="320"
        y1={yZero}
        y2={yZero}
        stroke="#ef4444"
        strokeOpacity={isInDangerZone ? 0.55 : 0.28}
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      {/* areas + lines reveal on mount */}
      <g clipPath="url(#fcHeroReveal)">
        {/* areas */}
        <path d={pessArea} fill="url(#fcHeroPessFill)" />
        <path d={optArea} fill="url(#fcHeroOptFill)" />

        {/* lines (draw-in on mount) */}
        <path
          d={pessLine}
          fill="none"
          stroke="#f59e0b"
          strokeOpacity="0.92"
          strokeWidth="2.1"
          pathLength={1}
          className="fc-line-draw"
        />
        <path
          d={optLine}
          fill="none"
          stroke="#22c55e"
          strokeOpacity="0.95"
          strokeWidth="2.2"
          pathLength={1}
          className="fc-line-draw fc-line-draw--delay"
        />
      </g>

      {/* cursor */}
      {markerOpacity > 0 && (
        <>
          <line
            x1={cursor.x}
            x2={cursor.x}
            y1="0"
            y2="112"
            stroke={isInDangerZone ? 'rgba(239,68,68,0.45)' : 'rgba(255,255,255,0.10)'}
            strokeWidth="1"
            opacity={markerOpacity}
          />
          <circle
            cx={cursor.x}
            cy={cursor.y}
            r="3.8"
            fill={isInDangerZone ? '#ef4444' : '#22c55e'}
            fillOpacity={0.95 * markerOpacity}
          />
          <circle
            cx={cursor.x}
            cy={cursor.y}
            r="7.2"
            fill={isInDangerZone ? '#ef4444' : '#22c55e'}
            fillOpacity={(isInDangerZone ? 0.16 : 0.10) * markerOpacity}
          />
        </>
      )}
    </svg>
  )
}


