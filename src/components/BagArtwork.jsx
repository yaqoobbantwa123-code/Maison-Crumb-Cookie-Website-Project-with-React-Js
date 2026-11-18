import { useId } from 'react'

/**
 * The bag is split into a back layer and a front layer.
 * The physics canvas sits between them, so cookies are visible through the
 * window and above the open top, but hidden by the opaque packaging edges.
 * The window geometry matches BAG_GEOMETRY in physics/cookiePhysics.js.
 */
export function BagBack() {
  const uid = useId().replace(/:/g, '')
  const back = `bag-back-${uid}`
  const inner = `bag-inner-${uid}`
  const top = `bag-top-${uid}`

  return (
    <svg
      viewBox="0 0 600 720"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={back} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7eddd" />
          <stop offset="48%" stopColor="#ead8bd" />
          <stop offset="100%" stopColor="#d9c1a1" />
        </linearGradient>
        <radialGradient id={inner} cx="50%" cy="18%" r="88%">
          <stop offset="0%" stopColor="#3d2a1c" />
          <stop offset="55%" stopColor="#241710" />
          <stop offset="100%" stopColor="#120b07" />
        </radialGradient>
        <linearGradient id={top} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff8ec" />
          <stop offset="100%" stopColor="#e6d2b5" />
        </linearGradient>
      </defs>

      <ellipse cx="300" cy="670" rx="196" ry="24" fill="#1a100a" opacity="0.16" />
      <ellipse cx="300" cy="672" rx="120" ry="12" fill="#1a100a" opacity="0.12" />

      {/* Back of the pouch */}
      <path
        d="M150 108 H450 Q478 108 484 142 L500 620 Q502 650 470 654 Q300 672 130 654 Q98 650 100 620 L116 142 Q122 108 150 108 Z"
        fill={`url(#${back})`}
      />

      {/* Open mouth of the bag */}
      <path
        d="M150 112 H450 Q468 112 472 126 L474 150 H126 L128 126 Q132 112 150 112 Z"
        fill={`url(#${top})`}
      />
      <ellipse cx="300" cy="126" rx="172" ry="15" fill="#1b100a" opacity="0.85" />
      <ellipse cx="300" cy="123" rx="160" ry="11" fill="#0f0805" opacity="0.7" />

      {/* Interior visible through the window */}
      <path
        d="M150 150 Q300 166 450 150 L450 606 Q300 622 150 606 Z"
        fill={`url(#${inner})`}
      />
      <path
        d="M150 150 Q300 166 450 150 L450 606 Q300 622 150 606 Z"
        fill="none"
        stroke="#0c0704"
        strokeOpacity="0.5"
        strokeWidth="3"
      />
      <path
        d="M170 160 Q300 174 430 160 L430 594 Q300 608 170 594 Z"
        fill="none"
        stroke="#f7ead6"
        strokeOpacity="0.06"
        strokeWidth="1"
      />
    </svg>
  )
}

export function BagFront() {
  const uid = useId().replace(/:/g, '')
  const front = `bag-front-${uid}`
  const rim = `bag-rim-${uid}`
  const side = `bag-side-${uid}`
  const glare = `bag-glare-${uid}`
  const gold = `bag-gold-${uid}`

  return (
    <svg
      viewBox="0 0 600 720"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbf3e6" />
          <stop offset="34%" stopColor="#f0e0c9" />
          <stop offset="72%" stopColor="#e3cfb1" />
          <stop offset="100%" stopColor="#d2b795" />
        </linearGradient>
        <linearGradient id={rim} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf1" />
          <stop offset="100%" stopColor="#e2cdae" />
        </linearGradient>
        <linearGradient id={side} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8f6b47" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#8f6b47" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={glare} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
          <stop offset="38%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="62%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.07" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b98645" />
          <stop offset="50%" stopColor="#e2c08b" />
          <stop offset="100%" stopColor="#b98645" />
        </linearGradient>
      </defs>

      {/* Front wall with a real cut-out window */}
      <path
        d="M136 140 Q300 158 464 140 L484 142 L500 620 Q502 650 470 654 Q300 672 130 654 Q98 650 100 620 L116 142 Z
           M150 152 Q300 168 450 152 L450 606 Q300 622 150 606 Z"
        fill={`url(#${front})`}
        fillRule="evenodd"
      />

      {/* Folded top rim */}
      <path
        d="M136 140 Q300 158 464 140 L464 151 Q300 170 136 151 Z"
        fill={`url(#${rim})`}
      />
      <path
        d="M136 140 Q300 158 464 140"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <path
        d="M136 151 Q300 170 464 151"
        fill="none"
        stroke="#8a6440"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Gussets and creases */}
      <path
        d="M116 142 L150 152 L150 606 L130 654 L100 620 Z"
        fill={`url(#${side})`}
      />
      <path
        d="M484 142 L450 152 L450 606 L470 654 L500 620 Z"
        fill={`url(#${side})`}
      />
      <path d="M152 154 L152 604" stroke="#9b7652" strokeOpacity="0.18" strokeWidth="1" />
      <path d="M448 154 L448 604" stroke="#9b7652" strokeOpacity="0.22" strokeWidth="1" />
      <path
        d="M150 606 Q300 622 450 606"
        fill="none"
        stroke="#9b7652"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <path
        d="M148 614 Q300 630 452 614"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.24"
        strokeWidth="1"
      />

      {/* Paper texture and highlights */}
      <path
        d="M124 160 L138 158 L138 620 L124 634 Z"
        fill="#ffffff"
        opacity="0.16"
      />
      <path
        d="M476 160 L462 158 L462 618 L476 632 Z"
        fill="#5f432a"
        opacity="0.06"
      />
      <path
        d="M150 152 Q300 168 450 152 L450 606 Q300 622 150 606 Z"
        fill={`url(#${glare})`}
      />
      <path
        d="M150 152 Q300 168 450 152 L450 606 Q300 622 150 606 Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="1"
      />
      <path
        d="M156 158 L156 600"
        stroke="#ffffff"
        strokeOpacity="0.12"
        strokeWidth="2"
      />

      {/* Printed maison label */}
      <g>
        <rect x="206" y="616" width="188" height="24" rx="1" fill="#24160e" />
        <rect
          x="208"
          y="618"
          width="184"
          height="20"
          rx="0.5"
          fill="none"
          stroke={`url(#${gold})`}
          strokeOpacity="0.55"
          strokeWidth="0.7"
        />
        <text
          x="300"
          y="629.5"
          textAnchor="middle"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="12.5"
          letterSpacing="3.6"
          fill="#f2e3ca"
        >
          MAISON CRUMB
        </text>
        <text
          x="300"
          y="636.4"
          textAnchor="middle"
          fontFamily="Manrope, sans-serif"
          fontSize="3.4"
          letterSpacing="1.35"
          fill="#d8bd94"
        >
          THE ART OF PERFECT COOKIES
        </text>
        <circle cx="416" cy="628" r="8" fill="none" stroke={`url(#${gold})`} strokeWidth="0.8" />
        <g fill="#d9b27a">
          <circle cx="413" cy="626" r="1.1" />
          <circle cx="419" cy="626.5" r="1" />
          <circle cx="416" cy="630" r="1.1" />
        </g>
        <text
          x="184"
          y="631"
          textAnchor="middle"
          fontFamily="Manrope, sans-serif"
          fontSize="3.2"
          letterSpacing="1.1"
          fill="#8c6743"
        >
          6 COOKIES · 210 G
        </text>
      </g>

      {/* Bottom shadow */}
      <path
        d="M130 654 Q300 672 470 654 Q300 664 130 654 Z"
        fill="#3b2717"
        opacity="0.18"
      />
    </svg>
  )
}
