export default function CategorySidebar({
  categories,
  activeCategoryId,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onAddCategory,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>카테고리</h2>
        <button type="button" className="btn-icon" onClick={onAddCategory} title="카테고리 추가">
          +
        </button>
      </div>

      <input
        type="search"
        className="search-input"
        placeholder="검색..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <ul className="category-list">
        {categories.length === 0 && (
          <li className="category-empty">검색 결과 없음</li>
        )}
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              type="button"
              className={`category-btn ${cat.id === activeCategoryId ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.pages.length}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
