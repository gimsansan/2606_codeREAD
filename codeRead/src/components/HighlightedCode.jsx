import { useMemo } from 'react'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import bash from 'highlight.js/lib/languages/bash'
import python from 'highlight.js/lib/languages/python'
import { getHljsLanguage } from '../utils/languages'
import HighlightedText from './HighlightedText'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('python', python)

function highlightCode(text, language) {
  const trimmed = text?.trim()
  if (!trimmed) return null

  const hljsLanguage = getHljsLanguage(language)
  try {
    return hljs.highlight(trimmed, { language: hljsLanguage }).value
  } catch {
    return hljs.highlightAuto(trimmed).value
  }
}

export default function HighlightedCode({ text, language, query }) {
  const display = text ?? ''
  const trimmedQuery = query?.trim()

  const highlightedHtml = useMemo(
    () => (trimmedQuery ? null : highlightCode(display, language)),
    [display, language, trimmedQuery],
  )

  if (trimmedQuery) {
    return <HighlightedText text={display || ' '} query={query} />
  }

  if (!highlightedHtml) {
    return display || ' '
  }

  return <span className="hljs" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
}
