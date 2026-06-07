import { useEffect, useState } from 'react'
import { getLanguageLabel } from '../utils/languages'
import HighlightedText from './HighlightedText'
import HighlightedCode from './HighlightedCode'

export default function PageSplitView({
  text,
  code,
  language,
  searchQuery,
  onTextUpdate,
  onCodeUpdate,
}) {
  const [isEditingText, setIsEditingText] = useState(false)
  const [draftText, setDraftText] = useState(text ?? '')
  const [isEditingCode, setIsEditingCode] = useState(false)
  const [draftCode, setDraftCode] = useState(code ?? '')
  const [copiedPanel, setCopiedPanel] = useState(null)

  useEffect(() => {
    setIsEditingText(false)
    setDraftText(text ?? '')
  }, [text])

  useEffect(() => {
    setIsEditingCode(false)
    setDraftCode(code ?? '')
  }, [code])

  const displayText = text ?? ''
  const displayCode = code?.trim() ?? ''
  const languageLabel = language ? getLanguageLabel(language) : null

  const copyToClipboard = async (content, panel) => {
    const value = content?.trim()
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
      setCopiedPanel(panel)
      setTimeout(() => setCopiedPanel(null), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  const startTextEdit = () => {
    if (!onTextUpdate) return
    setDraftText(text ?? '')
    setIsEditingText(true)
  }

  const saveTextEdit = () => {
    onTextUpdate?.(draftText)
    setIsEditingText(false)
  }

  const cancelTextEdit = () => {
    setDraftText(text ?? '')
    setIsEditingText(false)
  }

  const startCodeEdit = () => {
    if (!onCodeUpdate) return
    setDraftCode(code ?? '')
    setIsEditingCode(true)
  }

  const saveCodeEdit = () => {
    onCodeUpdate?.(draftCode)
    setIsEditingCode(false)
  }

  const cancelCodeEdit = () => {
    setDraftCode(code ?? '')
    setIsEditingCode(false)
  }

  return (
    <div className="page-split">
      {isEditingCode ? (
        <div className="panel-edit-form code-panel">
          <textarea
            className="code-block code-panel-editing code-textarea"
            value={draftCode}
            onChange={(e) => setDraftCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                cancelCodeEdit()
              }
            }}
            placeholder="코드를 입력하세요"
            spellCheck={false}
            autoFocus
          />
          <div className="panel-edit-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={saveCodeEdit}>
              저장
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelCodeEdit}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="code-panel-wrapper">
          {languageLabel && (
            <span className="code-language-badge">{languageLabel}</span>
          )}
          <pre
            className={`code-block code-panel ${onCodeUpdate ? 'code-panel-editable' : ''}`}
            onDoubleClick={startCodeEdit}
            title={onCodeUpdate ? '더블클릭하여 코드 수정' : undefined}
          >
            <code>
              <HighlightedCode
                text={displayCode || ' '}
                language={language}
                query={searchQuery}
              />
            </code>
          </pre>
          <div className="panel-actions">
            <button
              type="button"
              className="panel-action-btn"
              onClick={() => copyToClipboard(displayCode, 'code')}
              disabled={!displayCode}
              title="코드 복사"
              aria-label="코드 복사"
            >
              {copiedPanel === 'code' ? '복사됨' : '복사'}
            </button>
            {onCodeUpdate && (
              <button
                type="button"
                className="panel-action-btn"
                onClick={startCodeEdit}
                title="코드 수정"
                aria-label="코드 수정"
              >
                ✎ <span>수정</span>
              </button>
            )}
          </div>
        </div>
      )}

      {isEditingText ? (
        <div className="panel-edit-form comment-panel">
          <textarea
            className="code-block comment-panel-editing"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                cancelTextEdit()
              }
            }}
            placeholder="설명을 입력하세요"
            autoFocus
          />
          <div className="panel-edit-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={saveTextEdit}>
              저장
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancelTextEdit}>
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="comment-panel-wrapper">
          <pre
            className={`code-block comment-panel ${onTextUpdate ? 'comment-panel-editable' : ''}`}
            onDoubleClick={startTextEdit}
            title={onTextUpdate ? '더블클릭하여 설명 수정' : undefined}
          >
            <code>
              <HighlightedText text={displayText || ' '} query={searchQuery} />
            </code>
          </pre>
          <div className="panel-actions">
            <button
              type="button"
              className="panel-action-btn"
              onClick={() => copyToClipboard(displayText, 'text')}
              disabled={!displayText.trim()}
              title="설명 복사"
              aria-label="설명 복사"
            >
              {copiedPanel === 'text' ? '복사됨' : '복사'}
            </button>
            {onTextUpdate && (
              <button
                type="button"
                className="panel-action-btn"
                onClick={startTextEdit}
                title="설명 수정"
                aria-label="설명 수정"
              >
                ✎ <span>수정</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
