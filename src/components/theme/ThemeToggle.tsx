import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/hooks/use-theme'
import type { Theme } from './theme-storage'

const labels: Record<Theme, string> = {
  light: 'Claro',
  dark: 'Oscuro',
  system: 'Sistema',
}

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const Icon =
    theme === 'system'
      ? Monitor
      : resolvedTheme === 'dark'
        ? Moon
        : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            aria-label="Cambiar tema de color"
          />
        }
      >
        <Icon className="size-4" />
        <span className="sr-only">Tema: {labels[theme]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(v) => {
            if (v === 'light' || v === 'dark' || v === 'system') {
              setTheme(v)
            }
          }}
        >
          <DropdownMenuLabel>Apariencia</DropdownMenuLabel>
          <DropdownMenuRadioItem value="light">
            <Sun className="size-4" />
            Claro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="size-4" />
            Oscuro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="size-4" />
            Sistema
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
