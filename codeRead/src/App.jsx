import { useCallback, useRef, useState } from 'react'
import { useNotebook } from './hooks/useNotebook'
import { useSearchHistory } from './hooks/useSearchHistory'
import CategorySidebar from './components/CategorySidebar'
import PageViewer from './components/PageViewer'
import PageEditor from './components/PageEditor'
import Pagination from './components/Pagination'
import PageNavList from './components/PageNavList'
import SearchHistoryBar from './components/SearchHistoryBar'
import ThemeToggle from './components/ThemeToggle'
import { useTheme } from './hooks/useTheme'
import './App.css'

function App() {
  const {
    activeCategory,
    activeCategoryId,
    activePage,
    editorPage,
    activePageIndex,
    pages,
    searchQuery,
    setSearchQuery,
    categorySearchQuery,
    setCategorySearchQuery,
    isEditing,
    isDraftingPage,
    setIsEditing,
    closeEditing,
    selectCategory,
    selectPage,
    goToPage,
    updatePage,
    updateDraftPage,
    saveDraftPage,
    cancelDraftPage,
    draftCategoryId,
    setDraftCategoryId,
    categories,
    addCategory,
    addPage,
    deletePage,
    deleteCategory,
    renameCategory,
    resetNotebook,
    exportNotebook,
    importNotebook,
    filteredCategories,
  } = useNotebook()

  const importInputRef = useRef(null)

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [activeSearchTarget, setActiveSearchTarget] = useState(null)
  const [lastSearchTarget, setLastSearchTarget] = useState('global')
  const globalSearchRef = useRef(null)
  const categorySearchRef = useRef(null)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()
  const { theme, setTheme, themes } = useTheme()

  const commitSearch = useCallback(
    (query) => {
      addToHistory(query)
    },
    [addToHistory],
  )

  const handleSearchFocus = useCallback((target) => {
    setActiveSearchTarget(target)
    setLastSearchTarget(target)
  }, [])

  const handleSearchKeyDown = useCallback(
    (e, query) => {
      if (e.key === 'Enter') commitSearch(query)
    },
    [commitSearch],
  )

  const handleSearchBlur = useCallback(
    (query) => {
      commitSearch(query)
    },
    [commitSearch],
  )

  const applyHistoryQuery = useCallback(
    (query) => {
      const target = activeSearchTarget ?? lastSearchTarget
      if (target === 'category') {
        setCategorySearchQuery(query)
        categorySearchRef.current?.focus()
      } else {
        setSearchQuery(query)
        globalSearchRef.current?.focus()
      }
    },
    [activeSearchTarget, lastSearchTarget, setSearchQuery, setCategorySearchQuery],
  )

  const handleImportClick = useCallback(() => {
    importInputRef.current?.click()
  }, [])

  const handleImportFile = useCallback(
    async (e) => {
      const file = e.target.files?.[0]
      e.target.value = ''
      if (!file) return

      const result = await importNotebook(file)
      if (result.ok) return
      if (result.cancelled) return
      window.alert(result.error ?? '가져오기에 실패했습니다.')
    },
    [importNotebook],
  )

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h1>SnippetNote</h1>
        </div>
        <SearchHistoryBar
          history={history}
          onApply={applyHistoryQuery}
          onRemove={removeFromHistory}
          onClear={clearHistory}
        />
        <div className="header-actions">
          <ThemeToggle theme={theme} themes={themes} onChange={setTheme} />
          <button
            type="button"
            className={`btn ${isEditing ? 'btn-active' : ''}`}
            onClick={() => (isEditing ? closeEditing() : setIsEditing(true))}
          >
            {isEditing ? '닫기' : '편집'}
          </button>
          <button type="button" className="btn" onClick={addPage}>
            + 페이지
          </button>
          {activePage && !isDraftingPage && (
            <button type="button" className="btn btn-danger" onClick={deletePage}>
              페이지 삭제
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={exportNotebook}>
            내보내기
          </button>
          <button type="button" className="btn btn-ghost" onClick={handleImportClick}>
            가져오기
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleImportFile}
          />
          <button type="button" className="btn btn-ghost" onClick={resetNotebook}>
            초기화
          </button>
        </div>
      </header>

      <div className={`layout ${isSidebarCollapsed ? 'layout-sidebar-collapsed' : ''}`}>
        <CategorySidebar
          categories={filteredCategories}
          activeCategoryId={activeCategoryId}
          activePageId={activePage?.id}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          globalSearchRef={globalSearchRef}
          onGlobalSearchFocus={() => handleSearchFocus('global')}
          onGlobalSearchKeyDown={(e) => handleSearchKeyDown(e, searchQuery)}
          onGlobalSearchBlur={() => handleSearchBlur(searchQuery)}
          onSelectCategory={selectCategory}
          onSelectPage={selectPage}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onRenameCategory={renameCategory}
        />

        <div className="main-wrap">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            title={isSidebarCollapsed ? '사이드바 보이기' : '메인 넓게 보기'}
            aria-label={isSidebarCollapsed ? '사이드바 보이기' : '사이드바 숨기기'}
          >
            {isSidebarCollapsed ? '»' : '«'}
          </button>

          <main className={`main ${isHeaderCollapsed ? 'main-header-collapsed' : ''}`}>
          {!activeCategory ? (
            <div className="empty-state">
              <p>카테고리를 선택하거나 새로 만드세요.</p>
            </div>
          ) : (
            <>
              {isHeaderCollapsed ? (
                <button
                  type="button"
                  className="header-toggle header-toggle-collapsed"
                  onClick={() => setIsHeaderCollapsed(false)}
                  title="헤더 보이기"
                  aria-label="헤더 보이기"
                >
                  ▼
                </button>
              ) : (
              <div className="page-header">
                <div className="page-header-top">
                  {isEditing ? (
                    <input
                      className="category-rename"
                      value={activeCategory.name}
                      onChange={(e) => renameCategory(activeCategory.id, e.target.value)}
                    />
                  ) : (
                    <span className="category-label">{activeCategory.name}</span>
                  )}
                  <div className="page-header-actions">
                    <div className="category-search-field">
                      <div className="global-search-input-wrap">
                        <span className="global-search-icon" aria-hidden="true">⌕</span>
                        <input
                          ref={categorySearchRef}
                          type="search"
                          className="global-search-input"
                          placeholder="이 카테고리에서 검색..."
                          value={categorySearchQuery}
                          onChange={(e) => setCategorySearchQuery(e.target.value)}
                          onFocus={() => handleSearchFocus('category')}
                          onKeyDown={(e) => handleSearchKeyDown(e, categorySearchQuery)}
                          onBlur={() => handleSearchBlur(categorySearchQuery)}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="header-toggle"
                      onClick={() => setIsHeaderCollapsed(true)}
                      title="패널 넓게 보기"
                      aria-label="헤더 숨기고 패널 넓게 보기"
                    >
                      ▲
                    </button>
                  </div>
                </div>
                {!isEditing && activePage && (
                  <h2 className="page-title">
                    {activePage.title?.trim() || '(제목 없음)'}
                  </h2>
                )}
                {!isEditing && (
                  <PageNavList
                    query={categorySearchQuery}
                    pages={pages}
                    activePageId={activePage?.id}
                    onSelect={(_, index) => goToPage(index)}
                  />
                )}
              </div>
              )}

              {!activePage && !isDraftingPage ? (
                <div className="empty-state">
                  {categorySearchQuery.trim() ? (
                    <p>검색 결과 없음</p>
                  ) : (
                    <div className="empty-state-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => addPage()}
                      >
                        + 페이지 추가
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {isEditing && editorPage ? (
                    <PageEditor
                      page={editorPage}
                      onUpdate={isDraftingPage ? updateDraftPage : updatePage}
                      isDraft={isDraftingPage}
                      onSave={saveDraftPage}
                      onCancel={cancelDraftPage}
                      categories={categories}
                      draftCategoryId={draftCategoryId}
                      onCategoryChange={setDraftCategoryId}
                    />
                  ) : activePage ? (
                    <PageViewer
                      page={activePage}
                      searchQuery={categorySearchQuery}
                      onUpdate={updatePage}
                    />
                  ) : null}

                  {!isDraftingPage && activePage && (
                    <Pagination
                      current={activePageIndex}
                      total={pages.length}
                      onPrev={() => goToPage(activePageIndex - 1)}
                      onNext={() => goToPage(activePageIndex + 1)}
                    />
                  )}
                </>
              )}
            </>
          )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
