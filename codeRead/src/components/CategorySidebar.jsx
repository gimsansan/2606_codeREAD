import { useState } from 'react'
import HighlightedText from './HighlightedText'

export default function CategorySidebar({
  categories,
  activeCategoryId,
  activePageId,
  searchQuery,
  onSearchChange,
  globalSearchRef,
  onGlobalSearchFocus,
  onGlobalSearchKeyDown,
  onGlobalSearchBlur,
  onSelectCategory,
  onSelectPage,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingName, setEditingName] = useState('')

  const isGlobalSearch = Boolean(searchQuery.trim())

  const startAdd = () => {
    setIsAdding(true)
    setNewName('')
  }

  const cancelAdd = () => {
    setIsAdding(false)
    setNewName('')
  }

  const submitAdd = (e) => {
    e.preventDefault()
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddCategory(trimmed)
    setIsAdding(false)
    setNewName('')
  }

  const startRename = (cat) => {
    setEditingCategoryId(cat.id)
    setEditingName(cat.name)
  }

  const cancelRename = () => {
    setEditingCategoryId(null)
    setEditingName('')
  }

  const submitRename = () => {
    if (!editingCategoryId) return
    const trimmed = editingName.trim()
    if (trimmed) onRenameCategory(editingCategoryId, trimmed)
    cancelRename()
  }

  return (
    <aside className="sidebar">
      <div>
      
        {!isAdding && (
          <button type="button" className="btn-icon" onClick={startAdd} title="카테고리 추가">
            +
          </button>
        )}
      </div>

      {isAdding && (
        <form className="category-add-form" onSubmit={submitAdd}>

          <input
            type="text"
            className="category-add-input"
            placeholder="카테고리 이름"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
          <div className="category-add-actions">
            <button type="submit" className="btn btn-sm" disabled={!newName.trim()}>
              추가
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={cancelAdd}>
              취소
            </button>
          </div>
        </form>
      )}

      <div className="global-search-field">
        <div className="global-search-input-wrap">
          <span className="global-search-icon" aria-hidden="true">⌕</span>
          <input
            ref={globalSearchRef}
            type="search"
            className="global-search-input"
            placeholder="모든 카테고리에서 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onGlobalSearchFocus}
            onKeyDown={onGlobalSearchKeyDown}
            onBlur={onGlobalSearchBlur}
          />
        </div>
      </div>

      <ul className="category-list">
        {categories.length === 0 && (
          <li className="category-empty">검색 결과 없음</li>
        )}
        {categories.map((cat) => (
          <li key={cat.id} className="category-group">
            <div
              className={`category-item ${cat.id === activeCategoryId ? 'active' : ''}`}
            >
              {editingCategoryId === cat.id ? (
                <input
                  type="text"
                  className="category-rename-input"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={submitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      submitRename()
                    }
                    if (e.key === 'Escape') cancelRename()
                  }}
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  className="category-btn"
                  onClick={() => onSelectCategory(cat.id)}
                >
                  <span
                    className="category-name"
                    onDoubleClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      startRename(cat)
                    }}
                    title={cat.name}
                  >
                    {cat.name}
                  </span>
                  <span className="category-count">{cat.pages.length}</span>
                </button>
              )}
              <button
                type="button"
                className="category-rename-hint"
                onClick={(e) => {
                  e.stopPropagation()
                  startRename(cat)
                }}
                title="이름 수정"
                aria-label={`${cat.name} 이름 수정`}
              >
                ✎
              </button>
              <button
                type="button"
                className="category-delete"
                onClick={() => onDeleteCategory(cat.id)}
                title={`${cat.name} 삭제`}
                aria-label={`${cat.name} 삭제`}
              >
                ×
              </button>
            </div>

            {isGlobalSearch && cat.pages.length > 0 && (
              <ul className="global-search-results">
                {cat.pages.map((page) => (
                  <li key={page.id}>
                    <button
                      type="button"
                      className={`global-search-result-btn ${
                        cat.id === activeCategoryId && page.id === activePageId ? 'active' : ''
                      }`}
                      onClick={() => onSelectPage(cat.id, page.id)}
                    >
                      <HighlightedText
                        text={page.title?.trim() || '(제목 없음)'}
                        query={searchQuery}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  )
}
