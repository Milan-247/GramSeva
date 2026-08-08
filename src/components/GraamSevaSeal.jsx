import React from "react";

export default function GraamSevaSeal({ className = "w-20 h-20", showText = true }) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Ring Metallic Gradient */}
        <linearGradient id="metalOuter" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e5e7eb" />
          <stop offset="20%" stopColor="#9ca3af" />
          <stop offset="40%" stopColor="#f3f4f6" />
          <stop offset="70%" stopColor="#4b5563" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>

        {/* Inner Ring Metallic Gradient */}
        <linearGradient id="metalInner" x1="300" y1="0" x2="0" y2="300" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="30%" stopColor="#f3f4f6" />
          <stop offset="60%" stopColor="#9ca3af" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>

        {/* Orange Pin Gradient */}
        <linearGradient id="orangePin" x1="80" y1="70" x2="160" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        {/* Green Leaf Hand Gradient */}
        <linearGradient id="greenHand" x1="130" y1="70" x2="200" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* Leaf Yellow Gradient */}
        <linearGradient id="yellowLeaf" x1="160" y1="50" x2="210" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        {/* Drop Shadow for Seal */}
        <filter id="sealShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        <filter id="elemShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Main Seal Body */}
      <g filter="url(#sealShadow)">
        {/* Outer Metallic Bezel */}
        <circle cx="150" cy="150" r="142" fill="none" stroke="url(#metalOuter)" strokeWidth="7" />
        <circle cx="150" cy="150" r="136" fill="none" stroke="#111827" strokeWidth="1.5" strokeOpacity="0.5" />
        
        {/* Inner Metallic Bezel */}
        <circle cx="150" cy="150" r="132" fill="none" stroke="url(#metalInner)" strokeWidth="5" />
        <circle cx="150" cy="150" r="127" fill="none" stroke="#374151" strokeWidth="1" strokeOpacity="0.4" />

        {/* Disc Canvas */}
        <circle cx="150" cy="150" r="126" fill="#ffffff" />
      </g>

      {/* Center Emblem Graphic */}
      <g filter="url(#elemShadow)">
        {/* Location Pin Base (Orange) */}
        <path
          d="M 125 62 C 96 62 76 86 76 112 C 76 142 110 178 136 198 C 142 202 148 202 152 198 C 153 196 148 182 144 172 C 128 148 106 130 106 112 C 106 95 118 80 134 80 C 146 80 152 86 156 94 C 146 74 136 62 125 62 Z"
          fill="url(#orangePin)"
        />

        {/* Ashoka Chakra Wheel inside Location Pin */}
        <g transform="translate(119, 112)">
          <circle cx="0" cy="0" r="23" fill="#ffffff" stroke="#1d4ed8" strokeWidth="3" />
          <circle cx="0" cy="0" r="20" fill="none" stroke="#1d4ed8" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="#1d4ed8" />
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="0"
              y1="0"
              x2={20 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={20 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="#1d4ed8"
              strokeWidth="1.2"
            />
          ))}
        </g>

        {/* Hand & Leaf Canopy (Green & Gold) */}
        {/* Palm & Main Stem */}
        <path
          d="M 136 198 C 154 176 168 144 168 116 C 168 98 158 86 148 78 C 160 80 176 92 182 108 C 188 126 182 156 156 190 C 148 198 142 202 136 198 Z"
          fill="url(#greenHand)"
        />

        {/* Leaves / Fingers */}
        {/* Top-left Leaf (Yellow) */}
        <path
          d="M 152 78 C 150 66 158 56 168 54 C 174 62 170 74 158 80 Z"
          fill="url(#yellowLeaf)"
        />
        {/* Top Leaf (Yellow) */}
        <path
          d="M 166 66 C 172 52 184 46 194 50 C 196 62 184 72 172 72 Z"
          fill="url(#yellowLeaf)"
        />
        {/* Middle-Right Leaf (Yellow/Green) */}
        <path
          d="M 180 72 C 190 58 204 56 210 64 C 206 76 192 82 180 78 Z"
          fill="url(#yellowLeaf)"
        />
        {/* Right Leaf 1 (Green) */}
        <path
          d="M 186 86 C 200 78 214 80 216 90 C 210 100 196 100 186 92 Z"
          fill="url(#greenHand)"
        />
        {/* Right Leaf 2 (Green) */}
        <path
          d="M 184 102 C 198 98 210 104 208 114 C 198 120 188 116 182 108 Z"
          fill="url(#greenHand)"
        />
        {/* Small Bottom Leaf (Green) */}
        <path
          d="M 178 116 C 190 114 198 122 194 130 C 184 132 178 126 174 118 Z"
          fill="url(#greenHand)"
        />
      </g>

      {/* Text Labels inside Seal */}
      {showText && (
        <g textAnchor="middle">
          {/* Devanagari "ग्रामसेवा" */}
          <text
            x="150"
            y="232"
            fill="#064e3b"
            fontSize="28"
            fontWeight="900"
            fontFamily="system-ui, 'Noto Sans Devanagari', 'Hind', sans-serif"
            letterSpacing="0.5"
          >
            ग्रामसेवा
          </text>
          {/* English "GraamSeva" */}
          <text
            x="150"
            y="258"
            fill="#047857"
            fontSize="22"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="-0.5"
          >
            GraamSeva
          </text>
        </g>
      )}
    </svg>
  );
}
