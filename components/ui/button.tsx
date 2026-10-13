import Link from 'next/link'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Button / ButtonLink — the single CTA primitive.
 * Variants: primary (ochre), secondary (himalaya outline), ghost, light (on dark).
 * Always renders a visible focus ring (WCAG 2.1 AA).
 */

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-ochre-400 text-white hover:bg-ochre-500 active:bg-ochre-600 shadow-soft hover:shadow-lift border border-transparent',
  secondary:
    'bg-transparent text-himalaya-600 border border-himalaya-600/40 hover:border-himalaya-600 hover:bg-himalaya-50',
  ghost: 'bg-transparent text-charcoal-soft hover:bg-cream-100 border border-transparent',
  light: 'bg-white text-himalaya-600 hover:bg-cream-100 border border-transparent shadow-soft',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type = 'button', children, ...props },
  ref,
) {
  return (
    <button ref={ref} type={type} className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  )
})

export type ButtonLinkProps = {
  href: string
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
  'aria-label'?: string
  'aria-describedby'?: string
}

/** Link styled as a button (for CTAs that navigate). */
export function ButtonLink({ href, variant = 'primary', size = 'md', className, children, ...rest }: ButtonLinkProps) {
  return (
    <Link href={href} className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...rest}>
      {children}
    </Link>
  )
}
