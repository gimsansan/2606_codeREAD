import { textToComments } from '../utils/comments'

export default function PageSplitView({ text, code }) {
  const comments = textToComments(text)
  const displayCode = code?.trim() ?? ''

  return (
    <div className="page-split">
      <pre className="code-block code-panel">
        <code>{displayCode || ' '}</code>
      </pre>
      <pre className="code-block comment-panel">
        <code>{comments || ' '}</code>
      </pre>
    </div>
  )
}
