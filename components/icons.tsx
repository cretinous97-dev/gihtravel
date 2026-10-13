import type { SVGProps } from 'react'

/**
 * Tiny inline SVG icon set for trust points, pillars and contact details.
 * Decorative by default (aria-hidden) — always pair with visible text.
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function baseProps({ size = 24, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...rest,
  }
}

export function MountainIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m3 20 6.5-11 3.5 5.5L15.5 11 21 20H3Z" />
      <path d="M9.5 9 11 6l1.5 3" />
    </svg>
  )
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 20s-7-4.35-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.65 12 20 12 20Z" />
    </svg>
  )
}

export function LeafIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M5 19C5 9 13 5 20 4c0 7-2 15-12 15H5Z" />
      <path d="M5 19c2-6 6-9 10-11" />
    </svg>
  )
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 3 5 6v5c0 5 3 8.5 7 10 4-1.5 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m12 3 2.7 5.8L21 9.6l-4.5 4.3L17.6 21 12 17.7 6.4 21l1.1-7.1L3 9.6l6.3-.8L12 3Z" />
    </svg>
  )
}

export function UsersIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 14.5A4.5 4.5 0 0 1 21 19" />
    </svg>
  )
}

export function FlagsIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 21V4" />
      <path d="M4 5c4-2 8 2 12 0v9c-4 2-8-2-12 0" />
    </svg>
  )
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 3h3l1.5 4.5-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2L21 15v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z" />
    </svg>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  )
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 12h16m0 0-6-6m6 6-6 6" />
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  )
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

/** Map icon names (as stored in CMS fields) to components. */
export const iconMap = {
  mountain: MountainIcon,
  heart: HeartIcon,
  leaf: LeafIcon,
  compass: CompassIcon,
  shield: ShieldIcon,
  star: StarIcon,
  users: UsersIcon,
  flags: FlagsIcon,
} as const

export function TrustIcon({ name, size = 28 }: { name: string; size?: number }) {
  const Cmp = iconMap[name as keyof typeof iconMap] ?? CompassIcon
  return <Cmp size={size} />
}
