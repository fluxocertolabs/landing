import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'fc-theme'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

function readStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

function getSystemTheme(): Theme {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeToDom(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.dataset.theme = theme

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d1117' : '#f8fafd')
}

export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => readStoredTheme() ?? 'system')
  const [systemTheme, setSystemTheme] = useState<Theme>(() => getSystemTheme())

  useEffect(() => {
    if (!window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')

    const onChange = () => setSystemTheme(mql.matches ? 'dark' : 'light')
    onChange()

    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const resolvedTheme = useMemo<Theme>(() => (preference === 'system' ? systemTheme : preference), [preference, systemTheme])

  useEffect(() => {
    applyThemeToDom(resolvedTheme)
  }, [resolvedTheme])

  const toggle = () => {
    const next: Theme = resolvedTheme === 'dark' ? 'light' : 'dark'
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
    setPreference(next)
  }

  return {
    theme: resolvedTheme,
    toggle,
  }
}


