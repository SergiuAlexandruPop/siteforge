'use client'

import { type MotionValue, motion } from 'motion/react'

// ---------------------------------------------------------------------------
// RocketSVG — Hand-coded geometric blueprint rocket.
// ---------------------------------------------------------------------------
// Accepts MotionValue props from RocketBlueprint orchestrator to animate
// each layer group independently based on scroll progress.
//
// Layer groups (draw order):
//   1. Grid — crosshairs, dimension lines, grid dots
//   2. Body — main fuselage outline
//   3. Fins — left + right stabilizer fins
//   4. Nosecone — tip/cone at the top
//   5. Window — circular porthole
//   6. Fills — colored versions of shapes overlaid
//   7. Exhaust — flame shapes below rocket
//
// Two render paths:
//   - Animated: motion.* elements with MotionValue style props
//   - Static: plain SVG for prefers-reduced-motion
// ---------------------------------------------------------------------------

interface RocketSVGAnimatedProps {
  mode: 'animated'
  gridOpacity: MotionValue<number>
  gridFadeOut: MotionValue<number>
  bodyPathLength: MotionValue<number>
  finsPathLength: MotionValue<number>
  noseconePathLength: MotionValue<number>
  windowPathLength: MotionValue<number>
  fillOpacity: MotionValue<number>
  exhaustOpacity: MotionValue<number>
  rocketY: MotionValue<number>
}

interface RocketSVGStaticProps {
  mode: 'static'
}

type RocketSVGProps = RocketSVGAnimatedProps | RocketSVGStaticProps

// Shared stroke style
const STROKE_WIDTH = 1.5
const STROKE_STYLE = {
  fill: 'none',
  stroke: 'var(--blueprint-stroke)',
  strokeWidth: STROKE_WIDTH,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Dimension annotation line
function DimensionLine({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g stroke="var(--blueprint-grid)" strokeWidth={0.5} strokeDasharray="4 3" opacity={0.6}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {/* Tick marks at ends */}
      <line x1={x1 - 3} y1={y1} x2={x1 + 3} y2={y1} />
      <line x1={x2 - 3} y1={y2} x2={x2 + 3} y2={y2} />
    </g>
  )
}

export function RocketSVG(props: RocketSVGProps) {
  if (props.mode === 'static') {
    return <StaticRocket />
  }

  return <AnimatedRocket {...props} />
}

// ---------------------------------------------------------------------------
// Static fallback — fully assembled colored rocket, no animation
// ---------------------------------------------------------------------------
function StaticRocket() {
  return (
    <svg
      viewBox="0 0 400 600"
      className="mx-auto h-full max-h-[500px] w-auto"
      role="img"
      aria-label="Rocket illustration"
    >
      {/* Body fill */}
      <path
        d="M200 80 L160 280 L160 420 Q160 440 180 450 L220 450 Q240 440 240 420 L240 280 Z"
        fill="hsl(210, 80%, 55%)"
        opacity={0.9}
      />
      {/* Nosecone */}
      <path
        d="M200 80 L160 200 L240 200 Z"
        fill="hsl(0, 75%, 55%)"
        opacity={0.9}
      />
      {/* Left fin */}
      <path
        d="M160 360 L110 440 L110 460 L160 420 Z"
        fill="hsl(210, 70%, 45%)"
        opacity={0.9}
      />
      {/* Right fin */}
      <path
        d="M240 360 L290 440 L290 460 L240 420 Z"
        fill="hsl(210, 70%, 45%)"
        opacity={0.9}
      />
      {/* Window */}
      <circle cx={200} cy={260} r={22} fill="hsl(200, 90%, 75%)" stroke="hsl(210, 60%, 40%)" strokeWidth={2} />
      <circle cx={200} cy={260} r={14} fill="hsl(200, 80%, 90%)" />
      {/* Window glare */}
      <ellipse cx={194} cy={254} rx={5} ry={7} fill="white" opacity={0.5} />
      {/* Exhaust flames */}
      <path
        d="M180 450 Q190 500 200 530 Q210 500 220 450"
        fill="hsl(30, 100%, 55%)"
        opacity={0.8}
      />
      <path
        d="M188 450 Q195 490 200 510 Q205 490 212 450"
        fill="hsl(45, 100%, 60%)"
        opacity={0.9}
      />
      {/* Body outline */}
      <path
        d="M200 80 L160 280 L160 420 Q160 440 180 450 L220 450 Q240 440 240 420 L240 280 Z"
        {...STROKE_STYLE}
        strokeWidth={2}
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Animated rocket — uses motion.* elements with scroll-linked MotionValues
// ---------------------------------------------------------------------------
function AnimatedRocket({
  gridOpacity,
  gridFadeOut,
  bodyPathLength,
  finsPathLength,
  noseconePathLength,
  windowPathLength,
  fillOpacity,
  exhaustOpacity,
  rocketY,
}: RocketSVGAnimatedProps) {
  return (
    <svg
      viewBox="0 0 400 600"
      className="mx-auto h-full max-h-[500px] w-auto"
      role="img"
      aria-label="Rocket blueprint animation"
    >
      {/* ================================================================
          Layer 1: Blueprint Grid (fades in, then fades out)
          ================================================================ */}
      <motion.g style={{ opacity: gridOpacity }}>
        <motion.g style={{ opacity: gridFadeOut }}>
          {/* Crosshair at rocket center */}
          <line x1={200} y1={60} x2={200} y2={560} stroke="var(--blueprint-grid)" strokeWidth={0.5} strokeDasharray="8 4" opacity={0.4} />
          <line x1={80} y1={300} x2={320} y2={300} stroke="var(--blueprint-grid)" strokeWidth={0.5} strokeDasharray="8 4" opacity={0.4} />

          {/* Grid dots */}
          {Array.from({ length: 7 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle
                key={`dot-${row}-${col}`}
                cx={120 + col * 40}
                cy={100 + row * 70}
                r={1.2}
                fill="var(--blueprint-grid)"
                opacity={0.3}
              />
            ))
          )}

          {/* Dimension annotations */}
          <DimensionLine x1={100} y1={80} x2={100} y2={450} />
          <DimensionLine x1={160} y1={540} x2={240} y2={540} />

          {/* Dimension label */}
          <text x={92} y={270} fill="var(--blueprint-grid)" fontSize={8} textAnchor="end" opacity={0.5} fontFamily="monospace">
            370px
          </text>
          <text x={200} y={555} fill="var(--blueprint-grid)" fontSize={8} textAnchor="middle" opacity={0.5} fontFamily="monospace">
            80px
          </text>
        </motion.g>
      </motion.g>

      {/* ================================================================
          Layer 6: Color Fills (fade in over strokes)
          ================================================================ */}
      <motion.g style={{ opacity: fillOpacity, y: rocketY }}>
        {/* Body fill */}
        <path
          d="M200 80 L160 280 L160 420 Q160 440 180 450 L220 450 Q240 440 240 420 L240 280 Z"
          fill="hsl(210, 80%, 55%)"
          opacity={0.85}
        />
        {/* Nosecone fill */}
        <path
          d="M200 80 L160 200 L240 200 Z"
          fill="hsl(0, 75%, 55%)"
          opacity={0.85}
        />
        {/* Left fin fill */}
        <path
          d="M160 360 L110 440 L110 460 L160 420 Z"
          fill="hsl(210, 70%, 45%)"
          opacity={0.85}
        />
        {/* Right fin fill */}
        <path
          d="M240 360 L290 440 L290 460 L240 420 Z"
          fill="hsl(210, 70%, 45%)"
          opacity={0.85}
        />
        {/* Window fill */}
        <circle cx={200} cy={260} r={22} fill="hsl(200, 90%, 75%)" />
        <circle cx={200} cy={260} r={14} fill="hsl(200, 80%, 90%)" />
        <ellipse cx={194} cy={254} rx={5} ry={7} fill="white" opacity={0.5} />
      </motion.g>

      {/* ================================================================
          Layer 2: Body Outline (stroke draw-on)
          ================================================================ */}
      <motion.g style={{ y: rocketY }}>
        <motion.path
          d="M200 80 L160 280 L160 420 Q160 440 180 450 L220 450 Q240 440 240 420 L240 280 Z"
          {...STROKE_STYLE}
          strokeWidth={2}
          style={{ pathLength: bodyPathLength }}
        />
      </motion.g>

      {/* ================================================================
          Layer 3: Fins (stroke draw-on)
          ================================================================ */}
      <motion.g style={{ y: rocketY }}>
        {/* Left fin */}
        <motion.path
          d="M160 360 L110 440 L110 460 L160 420 Z"
          {...STROKE_STYLE}
          style={{ pathLength: finsPathLength }}
        />
        {/* Right fin */}
        <motion.path
          d="M240 360 L290 440 L290 460 L240 420 Z"
          {...STROKE_STYLE}
          style={{ pathLength: finsPathLength }}
        />
      </motion.g>

      {/* ================================================================
          Layer 4: Nosecone (stroke draw-on)
          ================================================================ */}
      <motion.g style={{ y: rocketY }}>
        <motion.path
          d="M200 80 L160 200 L240 200 Z"
          {...STROKE_STYLE}
          style={{ pathLength: noseconePathLength }}
        />
        {/* Nosecone detail line */}
        <motion.line
          x1={170} y1={200} x2={230} y2={200}
          stroke="var(--blueprint-stroke)"
          strokeWidth={1}
          style={{ pathLength: noseconePathLength }}
        />
      </motion.g>

      {/* ================================================================
          Layer 5: Window/Porthole (stroke draw-on)
          ================================================================ */}
      <motion.g style={{ y: rocketY }}>
        <motion.circle
          cx={200}
          cy={260}
          r={22}
          {...STROKE_STYLE}
          style={{ pathLength: windowPathLength }}
        />
        <motion.circle
          cx={200}
          cy={260}
          r={14}
          stroke="var(--blueprint-stroke)"
          strokeWidth={1}
          fill="none"
          style={{ pathLength: windowPathLength }}
        />
      </motion.g>

      {/* ================================================================
          Layer 7: Exhaust Flames (fade in during launch)
          ================================================================ */}
      <motion.g style={{ opacity: exhaustOpacity, y: rocketY }}>
        {/* Outer flame */}
        <path
          d="M180 450 Q185 490 190 510 Q195 530 200 550 Q205 530 210 510 Q215 490 220 450"
          fill="hsl(30, 100%, 55%)"
          opacity={0.8}
        />
        {/* Inner flame */}
        <path
          d="M188 450 Q192 480 196 500 Q198 515 200 525 Q202 515 204 500 Q208 480 212 450"
          fill="hsl(45, 100%, 60%)"
          opacity={0.9}
        />
        {/* Core bright flame */}
        <path
          d="M194 450 Q197 475 200 495 Q203 475 206 450"
          fill="hsl(55, 100%, 80%)"
          opacity={0.95}
        />
      </motion.g>
    </svg>
  )
}
