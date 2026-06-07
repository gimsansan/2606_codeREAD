import { ETC_CATEGORY_NAME } from '../utils/categories'
import { LANGUAGE_OPTIONS } from '../utils/languages'

export default function PageEditor({
  page,
  onUpdate,
  isDraft,
  onSave,
  onCancel,
  categories,
  draftCategoryId,
  onCategoryChange,
}) {
  return (
    <div className="page-editor">
      {isDraft && (
        <label className="field field-inline">
          <span>카테고리</span>
          <select value={draftCategoryId} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="">{ETC_CATEGORY_NAME} (기본)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="field">
        <span>제목</span>
        <input
          type="text"
          value={page.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </label>

      <div className="page-split page-split-edit">
        <label className="split-field code-panel">
          <span>코드</span>
          <textarea
            className="split-textarea code-textarea"
            value={page.code}
            onChange={(e) => onUpdate('code', e.target.value)}
            placeholder="코드를 입력하세요"
            spellCheck={false}
          />
        </label>

        <label className="split-field comment-panel">
          <span>설명</span>
          <textarea
            className="split-textarea"
            value={page.text}
            onChange={(e) => onUpdate('text', e.target.value)}
            placeholder="설명을 입력하세요"
          />
        </label>
      </div>

      <label className="field field-inline">
        <span>언어</span>
        <select
          value={page.language}
          onChange={(e) => onUpdate('language', e.target.value)}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {isDraft && (
        <div className="page-editor-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={onSave}>
            저장
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
            취소
          </button>
        </div>
      )}
    </div>
  )
}
