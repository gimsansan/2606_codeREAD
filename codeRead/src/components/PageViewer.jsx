import PageSplitView from './PageSplitView'

export default function PageViewer({ page, searchQuery, onUpdate }) {
  return (
    <div className="page-viewer">
      <PageSplitView
        text={page.text}
        code={page.code}
        language={page.language}
        searchQuery={searchQuery}
        onTextUpdate={onUpdate ? (value) => onUpdate('text', value) : undefined}
        onCodeUpdate={onUpdate ? (value) => onUpdate('code', value) : undefined}
      />
    </div>
  )
}
