import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/lib/theme'

type Props = {
  className?: string
}

export function ThemeToggle({ className }: Props) {
  const { theme, toggle } = useTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg cursor-pointer',
        'text-[color:var(--color-dim-foreground)] hover:text-[color:var(--color-foreground)]',
        'transition-[color,opacity,transform] duration-200',
        'hover:opacity-90 hover:-translate-y-[1px]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(64,181,232,0.55)] focus-visible:ring-offset-0',
        'active:translate-y-[1px]',
        className
      )}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Tema: escuro' : 'Tema: claro'}
    >
      {theme === 'dark' ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
    </button>
  )
}


