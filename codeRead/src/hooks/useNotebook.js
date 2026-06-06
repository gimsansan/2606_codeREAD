import { useCallback, useEffect, useState } from 'react'
import { defaultNotebook } from '../data/defaultNotebook'

const STORAGE_KEY = 'coderead-notebook'

function loadNotebook() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore corrupt data */
  }
  return defaultNotebook
}

function saveNotebook(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function isPageEmpty(page) {
  if (!page) return true
  return !page.title?.trim() && !page.text?.trim() && !page.code?.trim()
}

export function useNotebook() {
  const [notebook, setNotebook] = useState(loadNotebook)
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => notebook.categories[0]?.id ?? null,
  )
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [searchQuery, setSearchQueryState] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    saveNotebook(notebook)
  }, [notebook])

  const activeCategory = notebook.categories.find((c) => c.id === activeCategoryId)

  const getVisiblePages = useCallback(
    (category) => {
      if (!category) return []
      const q = searchQuery.trim().toLowerCase()
      if (!q) return category.pages
      return category.pages.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          category.name.toLowerCase().includes(q),
      )
    },
    [searchQuery],
  )

  const pages = getVisiblePages(activeCategory)
  const safePageIndex =
    pages.length === 0 ? 0 : Math.min(activePageIndex, pages.length - 1)
  const activePage = pages[safePageIndex] ?? null

  const setSearchQuery = useCallback((query) => {
    setSearchQueryState(query)
    setActivePageIndex(0)
  }, [])

  const selectCategory = useCallback((categoryId) => {
    setActiveCategoryId(categoryId)
    setActivePageIndex(0)
    setIsEditing(false)
  }, [])

  const goToPage = useCallback(
    (index) => {
      if (index < 0 || index >= pages.length) return
      setActivePageIndex(index)
      setIsEditing(false)
    },
    [pages.length],
  )

  const updatePage = useCallback(
    (field, value) => {
      if (!activeCategory || !activePage) return
      setNotebook((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id !== activeCategory.id
            ? cat
            : {
                ...cat,
                pages: cat.pages.map((page) =>
                  page.id !== activePage.id ? page : { ...page, [field]: value },
                ),
              },
        ),
      }))
    },
    [activeCategory, activePage],
  )

  const addCategory = useCallback(() => {
    const id = createId('cat')
    setNotebook((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id,
          name: '새 카테고리',
          pages: [
            {
              id: createId('page'),
              title: '',
              text: '',
              code: '',
              language: 'js',
            },
          ],
        },
      ],
    }))
    setActiveCategoryId(id)
    setActivePageIndex(0)
    setIsEditing(true)
  }, [])

  const addPage = useCallback(() => {
    if (!activeCategory) return
    if (isPageEmpty(activePage)) return

    const pageId = createId('page')
    setNotebook((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id !== activeCategory.id
          ? cat
          : {
              ...cat,
              pages: [
                ...cat.pages,
                {
                  id: pageId,
                  title: '',
                  text: '',
                  code: '',
                  language: 'js',
                },
              ],
            },
      ),
    }))
    setActivePageIndex(activeCategory.pages.length)
    setIsEditing(true)
  }, [activeCategory, activePage])

  const deletePage = useCallback(() => {
    if (!activeCategory || !activePage) return
    const deletedIndex = activeCategory.pages.findIndex((p) => p.id === activePage.id)
    setNotebook((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id !== activeCategory.id
          ? cat
          : { ...cat, pages: cat.pages.filter((p) => p.id !== activePage.id) },
      ),
    }))
    setActivePageIndex((i) => Math.max(0, i - (deletedIndex <= i ? 1 : 0)))
  }, [activeCategory, activePage])

  const renameCategory = useCallback(
    (name) => {
      if (!activeCategory) return
      setNotebook((prev) => ({
        ...prev,
        categories: prev.categories.map((cat) =>
          cat.id !== activeCategory.id ? cat : { ...cat, name },
        ),
      }))
    },
    [activeCategory],
  )

  const resetNotebook = useCallback(() => {
    if (!window.confirm('모든 데이터를 초기 샘플로 되돌릴까요?')) return
    setNotebook(defaultNotebook)
    setActiveCategoryId(defaultNotebook.categories[0]?.id ?? null)
    setActivePageIndex(0)
    setIsEditing(false)
  }, [])

  const filteredCategories = notebook.categories
    .map((cat) => {
      const q = searchQuery.trim().toLowerCase()
      if (!q) return cat
      const nameMatch = cat.name.toLowerCase().includes(q)
      const matchedPages = cat.pages.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q),
      )
      if (nameMatch) return cat
      if (matchedPages.length > 0) return { ...cat, pages: matchedPages }
      return null
    })
    .filter(Boolean)

  return {
    notebook,
    activeCategory,
    activeCategoryId,
    activePage,
    activePageIndex: safePageIndex,
    pages,
    searchQuery,
    setSearchQuery,
    isEditing,
    setIsEditing,
    selectCategory,
    goToPage,
    updatePage,
    addCategory,
    addPage,
    deletePage,
    renameCategory,
    resetNotebook,
    filteredCategories,
  }
}
