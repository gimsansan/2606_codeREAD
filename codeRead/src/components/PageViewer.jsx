import PageSplitView from './PageSplitView'

export default function PageViewer({ page }) {
  return (
    <div className="page-viewer">
      <PageSplitView text={page.text} code={page.code} />
    </div>
  )
}
