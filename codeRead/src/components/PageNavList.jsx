import HighlightedText from './HighlightedText'

export default function PageNavList({ query, pages, activePageId, onSelect }) {
  if (pages.length === 0) return null

  const trimmed = query?.trim()
  const isSearching = Boolean(trimmed)

  return (
    <div className="page-nav">
      <span className="page-nav-count">
        {isSearching ? `${pages.length}개 결과` : `${pages.length}개 페이지`}
      </span>
      <ul className="page-nav-list">
        {pages.map((page, index) => {
          const label = page.title?.trim() || '(제목 없음)'
          return (
            <li key={page.id}>
              <button
                type="button"
                className={`page-nav-btn ${page.id === activePageId ? 'active' : ''}`}
                onClick={() => onSelect(page, index)}
                title={label}
              >
                {isSearching ? (
                  <HighlightedText text={label} query={trimmed} />
                ) : (
                  label
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
