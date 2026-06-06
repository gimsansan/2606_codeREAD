export function textToComments(text) {
  if (!text?.trim()) return ''
  return text
    .split('\n')
    .map((line) => (line.trim() ? `// ${line}` : '//'))
    .join('\n')
}

export function mergeCodeWithComments(text, code) {
  const comments = textToComments(text)
  const trimmedCode = code?.trim() ?? ''

  if (!comments) return trimmedCode
  if (!trimmedCode) return comments
  return `${comments}\n\n${trimmedCode}`
}
