export type Theme = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'estadistica-theme'

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored
  }
  return 'system'
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'light' || theme === 'dark') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function applyThemeToDocument(theme: Theme): 'light' | 'dark' {
  const resolved = resolveTheme(theme)
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  if (resolved === 'dark') {
    root.classList.add('dark')
  }
  return resolved
}
