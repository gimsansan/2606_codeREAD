import { useNotebook } from './hooks/useNotebook'
import CategorySidebar from './components/CategorySidebar'
import PageViewer from './components/PageViewer'
import PageEditor from './components/PageEditor'
import Pagination from './components/Pagination'
import './App.css'

function App() {
  const {
    activeCategory,
    activeCategoryId,
    activePage,
    activePageIndex,
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
  } = useNotebook()

  return (
    <div className="app">
      <header className="header">
        <div className="header-brand">
          <h1>codeRead</h1>
          <p className="tagline">복습용 코드 수첩</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className={`btn ${isEditing ? 'btn-active' : ''}`}
            onClick={() => setIsEditing((v) => !v)}
          >
            {isEditing ? '보기' : '편집'}
          </button>
          <button type="button" className="btn" onClick={addPage}>
            + 페이지
          </button>
          {isEditing && (
            <button type="button" className="btn btn-danger" onClick={deletePage}>
              삭제
            </button>
          )}
          <button type="button" className="btn btn-ghost" onClick={resetNotebook}>
            초기화
          </button>
        </div>
      </header>

      <div className="layout">
        <CategorySidebar
          categories={filteredCategories}
          activeCategoryId={activeCategoryId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectCategory={selectCategory}
          onAddCategory={addCategory}
        />

        <main className="main">
          {!activePage ? (
            <div className="empty-state">
              <p>카테고리를 선택하거나 새로 만드세요.</p>
            </div>
          ) : (
            <>
              <div className="page-header">
                {isEditing ? (
                  <input
                    className="category-rename"
                    value={activeCategory?.name ?? ''}
                    onChange={(e) => renameCategory(e.target.value)}
                  />
                ) : (
                  <span className="category-label">{activeCategory?.name}</span>
                )}
                <h2 className="page-title">
                  {isEditing ? null : activePage.title}
                </h2>
              </div>

              {isEditing ? (
                <PageEditor page={activePage} onUpdate={updatePage} />
              ) : (
                <PageViewer page={activePage} />
              )}

              <Pagination
                current={activePageIndex}
                total={pages.length}
                onPrev={() => goToPage(activePageIndex - 1)}
                onNext={() => goToPage(activePageIndex + 1)}
                onGoTo={goToPage}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
