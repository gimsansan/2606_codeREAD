export default function HighlightedText({ text, query }) {
  const display = text ?? ''
  const trimmed = query?.trim()

  if (!trimmed) return display || ' '

  const lowerText = display.toLowerCase()
  const lowerQuery = trimmed.toLowerCase()
  const parts = []
  let start = 0
  let index = lowerText.indexOf(lowerQuery, start)
  let key = 0

  while (index !== -1) {
    if (index > start) parts.push(display.slice(start, index))
    parts.push(
      <mark key={key} className="search-highlight">
        {display.slice(index, index + trimmed.length)}
      </mark>,
    )
    key += 1
    start = index + trimmed.length
    index = lowerText.indexOf(lowerQuery, start)
  }

  if (start < display.length) parts.push(display.slice(start))
  return parts.length > 0 ? parts : display || ' '
}
