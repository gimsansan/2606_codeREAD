export const ETC_CATEGORY_ID = 'cat-etc'
export const ETC_CATEGORY_NAME = 'Etc'

export function findEtcCategory(categories) {
  return categories.find((c) => c.id === ETC_CATEGORY_ID || c.name === ETC_CATEGORY_NAME)
}

export function resolveSaveCategoryId(draftCategoryId, categories) {
  const trimmed = draftCategoryId?.trim()
  if (trimmed && categories.some((c) => c.id === trimmed)) return trimmed
  return findEtcCategory(categories)?.id ?? ETC_CATEGORY_ID
}

export function createEtcCategory() {
  return { id: ETC_CATEGORY_ID, name: ETC_CATEGORY_NAME, pages: [] }
}
