import { useCallback, useEffect, useState } from 'react'
import { defaultNotebook } from '../data/defaultNotebook'
import {
  createEtcCategory,
  findEtcCategory,
  resolveSaveCategoryId,
} from '../utils/categories'

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

function createEmptyPage() {
  return {
    id: createId('page'),
    title: '',
    text: '',
    code: '',
    language: 'js',
  }
}

export function useNotebook() {
  const [notebook, setNotebook] = useState(loadNotebook)
  const [activeCategoryId, setActiveCategoryId] = useState(
    () => notebook.categories[0]?.id ?? null,
  )
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [searchQuery, setSearchQueryState] = useState('')
  const [categorySearchQuery, setCategorySearchQueryState] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [draftPage, setDraftPage] = useState(null)
  const [draftCategoryId, setDraftCategoryId] = useState('')

  useEffect(() => {
    saveNotebook(notebook)
  }, [notebook])

  const activeCategory = notebook.categories.find((c) => c.id === activeCategoryId)

  const getVisiblePages = useCallback(
    (category) => {
      if (!category) return []
      const q = categorySearchQuery.trim().toLowerCase()
      if (!q) return category.pages
      return category.pages.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.text.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q),
      )
    },
    [categorySearchQuery],
  )

  const pages = getVisiblePages(activeCategory)
  const safePageIndex =
    pages.length === 0 ? 0 : Math.min(activePageIndex, pages.length - 1)
  const activePage = pages[safePageIndex] ?? null
  const isDraftingPage = draftPage !== null
  const editorPage = isDraftingPage ? draftPage : activePage

  const closeEditing = useCallback(() => {
    setDraftPage(null)
    setDraftCategoryId('')
    setIsEditing(false)
  }, [])

  const ensureEtcCategory = useCallback((categories) => {
    if (findEtcCategory(categories)) return categories
    return [...categories, createEtcCategory()]
  }, [])

  const startPageDraft = useCallback((categoryId = '') => {
    setDraftCategoryId(categoryId)
    setDraftPage(createEmptyPage())
    setIsEditing(true)
  }, [])

  const setSearchQuery = useCallback((query) => {
    setSearchQueryState(query)
    setActivePageIndex(0)
  }, [])

  const setCategorySearchQuery = useCallback((query) => {
    setCategorySearchQueryState(query)
    setActivePageIndex(0)
  }, [])

  const selectCategory = useCallback((categoryId) => {
    setActiveCategoryId(categoryId)
    setActivePageIndex(0)
    setCategorySearchQueryState('')
    setDraftPage(null)
    setDraftCategoryId('')
    setIsEditing(false)
  }, [])

  const selectPage = useCallback(
    (categoryId, pageId) => {
      const category = notebook.categories.find((c) => c.id === categoryId)
      if (!category) return
      const pageIndex = category.pages.findIndex((p) => p.id === pageId)
      if (pageIndex < 0) return
      setActiveCategoryId(categoryId)
      setActivePageIndex(pageIndex)
      setCategorySearchQueryState('')
      setDraftPage(null)
      setDraftCategoryId('')
      setIsEditing(false)
    },
    [notebook.categories],
  )

  const goToPage = useCallback(
    (index) => {
      if (index < 0 || index >= pages.length) return
      setActivePageIndex(index)
      setDraftPage(null)
      setDraftCategoryId('')
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

  const updateDraftPage = useCallback((field, value) => {
    setDraftPage((prev) => (prev ? { ...prev, [field]: value } : prev))
  }, [])

  const saveDraftPage = useCallback(() => {
    if (!draftPage) return

    const categoriesWithEtc = ensureEtcCategory(notebook.categories)
    const targetCategoryId = resolveSaveCategoryId(draftCategoryId, categoriesWithEtc)
    const targetCategory = categoriesWithEtc.find((c) => c.id === targetCategoryId)
    if (!targetCategory) return

    const pageToSave = draftPage
    const nextPageIndex = targetCategory.pages.length
    const needsEtcInsert = categoriesWithEtc.length !== notebook.categories.length

    setNotebook((prev) => {
      const categories = needsEtcInsert ? ensureEtcCategory(prev.categories) : prev.categories
      return {
        ...prev,
        categories: categories.map((cat) =>
          cat.id !== targetCategoryId
            ? cat
            : { ...cat, pages: [...cat.pages, pageToSave] },
        ),
      }
    })
    setActiveCategoryId(targetCategoryId)
    setActivePageIndex(nextPageIndex)
    setDraftPage(null)
    setDraftCategoryId('')
    setIsEditing(false)
  }, [draftPage, draftCategoryId, ensureEtcCategory, notebook.categories])

  const cancelDraftPage = useCallback(() => {
    setDraftPage(null)
    setDraftCategoryId('')
    setIsEditing(false)
  }, [])

  const addCategory = useCallback((name) => {
    const trimmed = name?.trim()
    if (!trimmed) return

    const id = createId('cat')
    setNotebook((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id,
          name: trimmed,
          pages: [],
        },
      ],
    }))
    setActiveCategoryId(id)
    setActivePageIndex(0)
    startPageDraft(id)
  }, [startPageDraft])

  const addPage = useCallback(() => {
    if (draftPage) {
      setIsEditing(true)
      return
    }

    let categoryId = activeCategoryId
    let categories = notebook.categories

    if (!categoryId) {
      categories = ensureEtcCategory(categories)
      categoryId = resolveSaveCategoryId('', categories)
      if (categories.length !== notebook.categories.length) {
        setNotebook((prev) => ({ ...prev, categories: ensureEtcCategory(prev.categories) }))
      }
      setActiveCategoryId(categoryId)
    }

    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    const existingEmptyIndex = category.pages.findIndex((p) => isPageEmpty(p))
    if (existingEmptyIndex >= 0) {
      setActiveCategoryId(categoryId)
      setActivePageIndex(existingEmptyIndex)
      setIsEditing(true)
      return
    }

    const draftDefaultCategoryId = activeCategoryId ?? ''
    setActiveCategoryId(categoryId)
    startPageDraft(draftDefaultCategoryId)
  }, [activeCategoryId, draftPage, ensureEtcCategory, notebook.categories, startPageDraft])

  const deletePage = useCallback(() => {
    if (!activeCategory || !activePage) return
    const pageLabel = activePage.title?.trim() || '제목 없는 페이지'
    if (!window.confirm(`"${pageLabel}" 페이지를 삭제할까요?`)) return
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

  const renameCategory = useCallback((categoryId, name) => {
    const trimmed = name?.trim()
    if (!categoryId || !trimmed) return
    setNotebook((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id !== categoryId ? cat : { ...cat, name: trimmed },
      ),
    }))
  }, [])

  const deleteCategory = useCallback(
    (categoryId = activeCategoryId) => {
      if (!categoryId) return
      const category = notebook.categories.find((c) => c.id === categoryId)
      if (!category) return
      if (!window.confirm(`"${category.name}" 카테고리와 모든 페이지를 삭제할까요?`)) return

      const index = notebook.categories.findIndex((c) => c.id === categoryId)
      const nextCategories = notebook.categories.filter((c) => c.id !== categoryId)

      setNotebook((prev) => ({ ...prev, categories: nextCategories }))

      if (nextCategories.length === 0) {
        setActiveCategoryId(null)
      } else {
        const nextIndex = Math.min(index, nextCategories.length - 1)
        setActiveCategoryId(nextCategories[nextIndex].id)
      }
      setActivePageIndex(0)
      setCategorySearchQueryState('')
      setDraftPage(null)
      setDraftCategoryId('')
      setIsEditing(false)
    },
    [activeCategoryId, notebook.categories],
  )

  const resetNotebook = useCallback(() => {
    if (!window.confirm('모든 데이터를 초기 샘플로 되돌릴까요?')) return
    if (!window.confirm('정말 초기화할까요? 저장된 카테고리와 페이지가 모두 삭제됩니다.')) return
    setNotebook(defaultNotebook)
    setActiveCategoryId(defaultNotebook.categories[0]?.id ?? null)
    setActivePageIndex(0)
    setCategorySearchQueryState('')
    setDraftPage(null)
    setDraftCategoryId('')
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
    editorPage,
    activePageIndex: safePageIndex,
    pages,
    searchQuery,
    setSearchQuery,
    categorySearchQuery,
    setCategorySearchQuery,
    isEditing,
    isDraftingPage,
    draftCategoryId,
    setDraftCategoryId,
    categories: notebook.categories,
    setIsEditing,
    closeEditing,
    selectCategory,
    selectPage,
    goToPage,
    updatePage,
    updateDraftPage,
    saveDraftPage,
    cancelDraftPage,
    addCategory,
    addPage,
    deletePage,
    deleteCategory,
    renameCategory,
    resetNotebook,
    filteredCategories,
  }
}
