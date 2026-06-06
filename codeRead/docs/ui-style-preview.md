# SnippetNote UI 스타일 미리보기 가이드

> 코드 수첩 앱(SnippetNote) UI 리디자인 전, AI 이미지 생성으로 스타일을 미리 확인하기 위한 문서입니다.  
> 아래 **AI 프롬프트**를 복사해 이미지 생성 AI(DALL·E, Midjourney, Gemini 등)에 붙여 넣으세요.

---

## 앱 레이아웃 (공통)

모든 스타일은 동일한 화면 구조를 가정합니다.

```
┌─────────────────────────────────────────────────────────────┐
│  SnippetNote          [검색기록]              [편집] [초기화] │  ← 헤더
├──────────┬──────────────────────────────────────────────────┤
│  +       │  JavaScript                    [카테고리 검색 ⌕]  │
│  ⌕ 검색  │  await 한 줄 규칙                                 │
│          │  [await 규칙] [이벤트 루프] [setState]              │
│ JS       │  ────────────────────────────────────────────────  │
│  4       │  ┌─ CODE ──────────┐  ┌─ COMMENT ──────────────┐ │
│ React    │  │ async function  │  │ await는 async 함수     │ │
│  2       │  │   await fetch() │  │ 안에서만 사용 가능...   │ │
│          │  └─────────────────┘  └────────────────────────┘ │
└──────────┴──────────────────────────────────────────────────┘
   사이드바                      메인 (코드 + 설명 2분할)
```

---

## 1. Neon IDE — 화려 + 개발자 감성

### 한 줄 요약
어두운 배경 + 네온 글로우 + 터미널/IDE 느낌. VS Code 다크 테마 + Cyberpunk.

### 핵심 디자인 토큰

| 항목 | 값 |
|------|-----|
| 배경 | `#0a0a12` ~ `#12121f` (거의 검정) |
| Accent | 시안 `#22d3ee`, 보라 `#a78bfa`, 핑크 `#f472b6` |
| 글로우 | `box-shadow: 0 0 24px rgba(34,211,238,0.35)` |
| 폰트 | JetBrains Mono (코드), Inter (UI) |
| 패널 | 어두운 카드 + 1px 네온 border |
| 활성 항목 | 왼쪽 3px 네온 바 + accent 배경 |

### ASCII 미리보기

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓ SnippetNote ════════════════════════ [편집] ▓  ← cyan glow text
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓ ┃JS 4    ▓  await 한 줄 규칙                    ▓
▓ ┃React 2 ▓  ┌─ ● ● ● ─ CODE ─────────┐          ▓
▓ ┃        ▓  │ const x = await fetch │  comment ▓  ← syntax colors
▓ ┃▌active ▓  └───────────────────────┘          ▓  ← purple left bar
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### AI 이미지 생성 프롬프트 (복사용)

```
UI mockup of a code notebook web app called "SnippetNote", dark neon IDE theme.
Deep black-purple background (#0a0a12). Left sidebar with category list (JS, React).
Main area: split view — left panel shows syntax-highlighted JavaScript code in a terminal-style box with red/yellow/green/cyan colors and macOS traffic light dots (●●●) on top. Right panel shows Korean explanation text.
Cyan and purple neon glow on borders and active sidebar item. JetBrains Mono font for code.
Cyberpunk developer aesthetic, VS Code dark theme inspired, high contrast, glowing accents.
Flat UI design, desktop web app, 16:9 aspect ratio, no phone frame.
```

---

## 2. Glass — 세련 + 모던

### 한 줄 요약
반투명 유리 패널 + 블러 + 부드러운 그라데이션 배경. macOS / iOS / Raycast 느낌.

### 핵심 디자인 토큰

| 항목 | 값 |
|------|-----|
| 배경 | 그라데이션 `#667eea → #764ba2` 또는 `#1a1a2e → #16213e` |
| 패널 | `rgba(255,255,255,0.08)` + `backdrop-filter: blur(16px)` |
| Border | `1px solid rgba(255,255,255,0.18)` |
| Accent | 흰색/연보라, 부드러운 shadow |
| 폰트 | SF Pro / Inter |
| hover | 살짝 밝아짐 + `scale(1.02)` |

### ASCII 미리보기

```
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░  (보라→남색 그라데이션 배경, 은은한 빛)                      ░
░  ╭──────────────────────────────────────────────────────╮  ░
░  │ ░░ SnippetNote ░░              [편집] [초기화]      │  ░  ← glass header
░  ╰──────────────────────────────────────────────────────╯  ░
░  ╭────────╮  ╭──────────────────────────────────────────╮  ░
░  │ ░ JS 4 │  │  await 한 줄 규칙                        │  ░
░  │ ░React2│  │  ╭─────────────╮  ╭─────────────────╮  │  ░
░  │        │  │  │ code panel  │  │ comment panel   │  │  ░  ← frosted glass
░  │        │  │  ╰─────────────╯  ╰─────────────────╯  │  ░
░  ╰────────╯  ╰──────────────────────────────────────────╯  ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

### AI 이미지 생성 프롬프트 (복사용)

```
UI mockup of a code notebook web app "SnippetNote", glassmorphism style.
Soft purple-to-blue gradient background. Frosted glass panels with blur effect and semi-transparent white borders.
Left sidebar, header, and code/comment split panels all look like floating glass cards.
Clean modern typography (Inter font). Subtle shadows, light and airy feel.
Code panel with syntax highlighting, comment panel with Korean text.
macOS Big Sur / Raycast inspired, elegant and minimal, desktop web app, 16:9.
```

---

## 3. Bold Editorial — 타이포 + 컬러 강조

### 한 줄 요약
큰 제목, 강한 색 대비, 잡지/에디토리얼 레이아웃. Notion + Medium + 컬러풀 태그.

### 핵심 디자인 토큰

| 항목 | 값 |
|------|-----|
| 배경 | 크림 `#faf8f5` (라이트) / `#1c1917` (다크) |
| Accent | 오렌지 `#f97316`, 민트 `#14b8a6`, 코랄 `#fb7185` |
| 제목 | 32px+, bold, `-0.03em` letter-spacing |
| 태그/칩 | pill형, 각기 다른 pastel 배경색 |
| 패널 | 흰 카드 + 두꺼운 shadow, 둥근 모서리 16px |
| 폰트 | Space Grotesk (제목), Source Serif (본문) |

### ASCII 미리보기

```
┌─────────────────────────────────────────────────────────────┐
│  SNIPPETNOTE                                    [편집]      │  ← 대형 bold
│  ─────────────────────────────────────────────────────────  │
│  JavaScript                                                 │  ← accent color label
│                                                             │
│  await 한 줄 규칙                                            │  ← 32px headline
│                                                             │
│  (await 규칙)  (이벤트 루프)  (setState)                     │  ← colorful pills
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │                         │  │  await는 async 함수     │ │
│  │   const x = await ...   │  │  안에서만...            │ │
│  │                         │  │                         │ │
│  └─────────────────────────┘  └─────────────────────────┘ │
│     ↑ white card, big shadow                                │
└─────────────────────────────────────────────────────────────┘
```

### AI 이미지 생성 프롬프트 (복사용)

```
UI mockup of a code notebook web app "SnippetNote", bold editorial design.
Warm cream background (#faf8f5). Large bold typography for page title "await 한 줄 규칙" (32px+).
Colorful pill-shaped tags for page navigation (orange, mint, coral pastel colors).
White content cards with strong drop shadows and 16px rounded corners.
Split layout: code block left, Korean explanation right. Category label "JavaScript" in accent orange.
Magazine/editorial aesthetic, Notion meets Medium, high typographic hierarchy.
Desktop web app, light mode, 16:9 aspect ratio.
```

---

## 4. 섞기 — Neon 배경 + Glass 패널

### 한 줄 요약
1번(Neon IDE)의 어두운 네온 배경 + 2번(Glass)의 반투명 유리 패널을 결합. 가장 화려하고 현대적.

### 핵심 디자인 토큰

| 항목 | 값 |
|------|-----|
| 배경 | 다크 그라데이션 + 은은한 네온 orb (`radial-gradient` blob) |
| 패널 | Glass (`blur 20px`, `rgba(255,255,255,0.06)`) |
| Accent | Neon cyan `#22d3ee` — border + glow만, 배경은 glass |
| 활성 | glass 패널 + cyan neon outline glow |
| 코드 | 어두운 glass 안에서 syntax highlight |
| 느낌 | Discord Nitro / Linear / Vercel 대시보드 |

### ASCII 미리보기

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓  (dark bg + purple/cyan glow orbs in corners)               ▓
▓  ╭─ glass ─────────────────────────────────────────────╮   ▓
▓  │ SnippetNote ✦                          [편집]     │   ▓  ← frosted on neon
▓  ╰─────────────────────────────────────────────────────╯   ▓
▓  ╭glass╮  ╭─ glass main ──────────────────────────────╮   ▓
▓  │ JS 4 │  │ await 한 줄 규칙                         │   ▓
▓  │React2│  │ ╭ code ╮ cyan glow border  ╭ comment ╮   │   ▓
▓  │ ▌    │  │ │await │                    │ 설명... │   │   ▓
▓  ╰──────╯  │ ╰──────╯                    ╰─────────╯   │   ▓
▓            ╰───────────────────────────────────────────╯   ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

### AI 이미지 생성 프롬프트 (복사용)

```
UI mockup of a code notebook web app "SnippetNote", hybrid neon + glassmorphism style.
Dark background with subtle purple and cyan glowing orbs/blobs in corners.
All UI panels (sidebar, header, code panel, comment panel) are frosted glass with backdrop blur and thin cyan neon glow borders.
Syntax-highlighted JavaScript code inside a dark glass code block. Korean comment text in adjacent glass panel.
Active sidebar item has cyan neon left accent bar. Modern developer tool aesthetic like Linear or Vercel dashboard.
High-end, flashy but readable, desktop web app, 16:9 aspect ratio.
```

---

## 스타일 비교표

| | Neon IDE | Glass | Bold Editorial | Neon + Glass |
|---|:---:|:---:|:---:|:---:|
| 화려함 | ★★★★★ | ★★★☆☆ | ★★★★☆ | ★★★★★ |
| 가독성 (코드) | ★★★★☆ | ★★★★☆ | ★★★★★ | ★★★★☆ |
| 개발자 감성 | ★★★★★ | ★★★☆☆ | ★★☆☆☆ | ★★★★★ |
| 세련됨 | ★★★☆☆ | ★★★★★ | ★★★★☆ | ★★★★★ |
| 다크모드 적합 | ★★★★★ | ★★★★☆ | ★★☆☆☆ | ★★★★★ |
| 구현 난이도 | 중 | 중 | 하 | 중~상 |

---

## AI에게 한 번에 4장 비교 요청하기

아래 프롬프트 하나로 4가지 변형을 나란히 생성할 수 있습니다.

```
Create a 2x2 grid comparison of the same "SnippetNote" code notebook web app UI in 4 different design styles:

Top-left: Neon IDE — dark background, cyan/purple neon glow, terminal-style code panel with syntax colors, cyberpunk developer aesthetic.

Top-right: Glassmorphism — purple gradient background, frosted glass panels with blur, macOS-inspired elegant minimal design.

Bottom-left: Bold Editorial — cream background, large bold typography, colorful pill tags, white cards with strong shadows, magazine layout.

Bottom-right: Neon + Glass hybrid — dark background with glow orbs, frosted glass panels with cyan neon borders, modern premium developer dashboard like Linear/Vercel.

All four show the same layout: left sidebar with categories, main area with page title "await 한 줄 규칙", code panel and Korean comment panel side by side.
Desktop web app mockup, clean UI design, no phone frames.
```

---

## 선택 후 다음 단계

1. AI로 4가지 이미지 생성 → 마음에 드는 스타일 번호 선택
2. Agent 모드에서 `"N번 스타일 적용해줘"` 요청
3. 적용 대상 파일: `index.css`(색/폰트), `App.css`(컴포넌트), `index.html`(Google Fonts)

---

*생성일: 2026-06-06 · SnippetNote UI 리디자인 참고용*
