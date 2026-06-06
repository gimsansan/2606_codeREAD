export const LANGUAGE_OPTIONS = [
  { value: 'js', label: 'JavaScript', hljs: 'javascript' },
  { value: 'ts', label: 'TypeScript', hljs: 'typescript' },
  { value: 'html', label: 'HTML', hljs: 'xml' },
  { value: 'css', label: 'CSS', hljs: 'css' },
  { value: 'json', label: 'JSON', hljs: 'json' },
  { value: 'md', label: 'Markdown', hljs: 'markdown' },
  { value: 'bash', label: 'Bash', hljs: 'bash' },
  { value: 'py', label: 'Python', hljs: 'python' },
  { value: 'react', label: 'React', hljs: 'javascript' },
  { value: 'rn', label: 'React Native', hljs: 'javascript' },
  { value: 'next', label: 'Next.js', hljs: 'javascript' },
]

const languageByValue = Object.fromEntries(LANGUAGE_OPTIONS.map((o) => [o.value, o]))

export function getLanguageLabel(value) {
  return languageByValue[value]?.label ?? value ?? 'JavaScript'
}

export function getHljsLanguage(value) {
  return languageByValue[value]?.hljs ?? 'javascript'
}
