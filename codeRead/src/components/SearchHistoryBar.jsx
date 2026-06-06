export default function SearchHistoryBar({ history, onApply, onRemove, onClear }) {
  if (history.length === 0) return null

  return (
    <div className="search-history">
      <div className="search-history-heading">
        <span className="search-history-label">검색 기록</span>
        <button
          type="button"
          className="search-history-clear"
          onClick={onClear}
          title="검색 기록 전체 삭제"
        >
          기록 지우기
        </button>
      </div>
      <ul className="search-history-list">
        {history.map((query) => (
          <li key={query} className="search-history-item">
            <button
              type="button"
              className="search-history-query"
              onClick={() => onApply(query)}
              title={`"${query}" 검색창에 입력`}
            >
              {query}
            </button>
            <button
              type="button"
              className="search-history-remove"
              onClick={() => onRemove(query)}
              aria-label={`"${query}" 기록 삭제`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
