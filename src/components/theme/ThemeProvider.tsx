import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ThemeContext } from './theme-context'
import {
  applyThemeToDocument,
  getStoredTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type Theme,
} from './theme-storage'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())
  const [systemTick, setSystemTick] = useState(0)

  const resolvedTheme = useMemo(() => {
    void systemTick
    return resolveTheme(theme)
  }, [theme, systemTick])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    localStorage.setItem(THEME_STORAGE_KEY, next)
  }, [])

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme, systemTick])

  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTick((t) => t + 1)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}
