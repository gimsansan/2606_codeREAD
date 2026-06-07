import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'coderead-theme'

export const THEMES = [
  { id: 'neon-glass', label: 'Neon + Glass', short: 'Neon' },
  { id: 'glass', label: 'Glass', short: 'Glass' },
  { id: 'editorial', label: 'Bold Editorial', short: 'Edit' },
]

const VALID_THEMES = new Set(THEMES.map((t) => t.id))

export function getStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value && VALID_THEMES.has(value)) return value
  } catch {
    /* ignore */
  }
  return 'neon-glass'
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function useTheme() {
  const [theme, setThemeState] = useState(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((id) => {
    if (VALID_THEMES.has(id)) setThemeState(id)
  }, [])

  return { theme, setTheme, themes: THEMES }
}
