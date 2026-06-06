export default function Pagination({ current, total, onPrev, onNext, onGoTo }) {
  if (total === 0) return null

  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button
        type="button"
        className="btn-nav"
        onClick={onPrev}
        disabled={current === 0}
      >
        ← 이전
      </button>

      <div className="page-dots">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`page-dot ${i === current ? 'active' : ''}`}
            onClick={() => onGoTo(i)}
            aria-label={`${i + 1}페이지`}
            aria-current={i === current ? 'page' : undefined}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-nav"
        onClick={onNext}
        disabled={current >= total - 1}
      >
        다음 →
      </button>
    </nav>
  )
}
