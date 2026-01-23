import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium select-none',
        'cursor-pointer',
        'transition-[transform,background-color,border-color,box-shadow,opacity] duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,181,232,0.55)] focus-visible:ring-offset-0',
        'disabled:opacity-55 disabled:pointer-events-none',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-sm',
        size === 'lg' && 'h-12 px-5 text-base',
        variant === 'primary' &&
          'bg-[linear-gradient(135deg,rgba(64,181,232,1),rgba(99,102,241,0.95))] text-[color:var(--color-primary-foreground)] border border-white/20 shadow-[0_10px_30px_rgba(64,181,232,0.18)] hover:brightness-[1.03] hover:shadow-[0_14px_44px_rgba(64,181,232,0.22)] hover:-translate-y-[1px]',
        variant === 'secondary' &&
          'bg-[color:var(--fc-btn-secondary-bg)] text-[color:var(--color-foreground)] border border-[color:var(--fc-btn-secondary-border)] hover:bg-[color:var(--fc-btn-secondary-hover-bg)] hover:-translate-y-[1px] hover:shadow-[0_12px_40px_var(--fc-btn-secondary-shadow)]',
        variant === 'ghost' &&
          'bg-transparent text-[color:var(--color-foreground)] hover:bg-[color:var(--color-surface-2)]',
        'active:translate-y-[1px]',
        className
      )}
      {...props}
    />
  )
}
