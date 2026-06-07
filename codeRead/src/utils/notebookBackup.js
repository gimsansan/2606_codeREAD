function isString(value) {
  return typeof value === 'string'
}

function validatePage(page) {
  if (!page || typeof page !== 'object') return false
  return (
    isString(page.id) &&
    page.id.length > 0 &&
    isString(page.title) &&
    isString(page.text) &&
    isString(page.code) &&
    isString(page.language) &&
    page.language.length > 0
  )
}

function validateCategory(category) {
  if (!category || typeof category !== 'object') return false
  if (!isString(category.id) || category.id.length === 0) return false
  if (!isString(category.name) || category.name.length === 0) return false
  if (!Array.isArray(category.pages)) return false
  return category.pages.every(validatePage)
}

export function validateNotebook(data) {
  if (!data || typeof data !== 'object') {
    return { ok: false, error: 'JSON 객체가 아닙니다.' }
  }
  if (!Array.isArray(data.categories)) {
    return { ok: false, error: 'categories 배열이 없습니다.' }
  }
  if (data.categories.length === 0) {
    return { ok: false, error: '카테고리가 비어 있습니다.' }
  }
  if (!data.categories.every(validateCategory)) {
    return { ok: false, error: '카테고리·페이지 형식이 올바르지 않습니다.' }
  }

  return {
    ok: true,
    data: {
      categories: data.categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        pages: cat.pages.map((page) => ({
          id: page.id,
          title: page.title,
          text: page.text,
          code: page.code,
          language: page.language,
        })),
      })),
    },
  }
}

export function getExportFilename(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `snippetnote-${y}-${m}-${d}.json`
}

export function downloadNotebook(notebook) {
  const blob = new Blob([JSON.stringify(notebook, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = getExportFilename()
  link.click()
  URL.revokeObjectURL(url)
}

export async function readNotebookFile(file) {
  if (!file) {
    return { ok: false, error: '파일이 없습니다.' }
  }

  let text
  try {
    text = await file.text()
  } catch {
    return { ok: false, error: '파일을 읽을 수 없습니다.' }
  }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, error: 'JSON 형식이 올바르지 않습니다.' }
  }

  return validateNotebook(parsed)
}
