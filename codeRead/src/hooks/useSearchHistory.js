import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'coderead-search-history'
const MAX_HISTORY = 15

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.filter((q) => typeof q === 'string')
    }
  } catch {
    /* ignore corrupt data */
  }
  return []
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function useSearchHistory() {
  const [history, setHistory] = useState(loadHistory)

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const addToHistory = useCallback((query) => {
    const trimmed = query?.trim()
    if (!trimmed) return
    setHistory((prev) => [trimmed, ...prev.filter((h) => h !== trimmed)].slice(0, MAX_HISTORY))
  }, [])

  const removeFromHistory = useCallback((query) => {
    setHistory((prev) => prev.filter((h) => h !== query))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  return { history, addToHistory, removeFromHistory, clearHistory }
}
