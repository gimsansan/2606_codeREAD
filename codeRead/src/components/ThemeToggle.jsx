export default function ThemeToggle({ theme, themes, onChange }) {
  return (
    <div className="theme-toggle" role="group" aria-label="테마 선택">
      {themes.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`theme-toggle-btn ${theme === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
          title={item.label}
          aria-pressed={theme === item.id}
        >
          {item.short}
        </button>
      ))}
    </div>
  )
}
