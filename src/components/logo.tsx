import { cn } from '@/lib/cn'

type Props = {
  className?: string
}

export function Logo({ className }: Props) {
  return (
    <div className={cn('flex items-center', className)}>
      <img
        src="/brand/symbol.svg"
        width={28}
        height={28}
        alt="FluxoCerto"
        className="h-7 w-7"
      />
    </div>
  )
}
