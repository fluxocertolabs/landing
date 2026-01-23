import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

export function Logo({ className }: Props) {
  return (
    <div className={cn('flex items-center', className)} aria-label="FluxoCerto">
      <img
        src="/brand/logo-light.svg"
        alt="FluxoCerto"
        height={28}
        className="fc-logo-light h-7 w-auto"
      />
      <img
        src="/brand/logo-dark.svg"
        alt="FluxoCerto"
        height={28}
        className="fc-logo-dark h-7 w-auto"
      />
    </div>
  )
}
