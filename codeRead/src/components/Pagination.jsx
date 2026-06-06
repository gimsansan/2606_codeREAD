export default function Pagination({ current, total, onPrev, onNext }) {
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

      <span className="pagination-status" aria-live="polite">
        {current + 1} / {total}
      </span>

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
