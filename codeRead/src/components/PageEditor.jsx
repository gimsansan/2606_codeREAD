export default function PageEditor({ page, onUpdate }) {
  return (
    <div className="page-editor">
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
          <span>설명 (자동 → 주석)</span>
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
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="css">CSS</option>
          <option value="py">Python</option>
          <option value="react">React</option>
          <option value="rn">React Native</option>
          <option value="next">Next.js</option>
        </select>
      </label>
    </div>
  )
}
