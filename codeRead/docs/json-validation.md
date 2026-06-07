# SnippetNote 백업 JSON 검증 — 개념·원리 (AI 질문용)

> 이 문서는 `codeRead` 앱의 **가져오기(import)** 시 JSON 파일을 검증하는 로직을 설명합니다.  
> AI에게 “이 개념을 더 깊게 설명해줘”, “개선 방법은?”, “다른 방식과 비교해줘” 등으로 질문할 때 사용하세요.

---

## 1. 왜 JSON 검증이 필요한가?

백업 **내보내기**는 앱이 만든 JSON을 파일로 저장합니다.  
**가져오기**는 사용자가 **임의의 `.json` 파일**을 선택합니다.

가져올 수 있는 파일 예:

- 옛날에 내보낸 정상 백업
- 메모장으로 손상·편집된 JSON
- JSON이 아닌 파일 (`.txt`, 잘못된 확장자)
- 구조는 JSON이지만 필드가 빠진/타입이 다른 파일
- 다른 앱/버전에서 만든 비슷하지만 다른 스키마

검증 없이 `localStorage`에 그대로 넣으면:

- 앱이 **크래시**하거나
- **빈 화면**, **undefined** 표시
- **데이터 전체 손실** (덮어쓰기 후 복구 불가)

→ **“파싱 가능한 JSON” ≠ “앱이 쓸 수 있는 데이터”**  
→ 그래서 **2단계 검증**이 필요합니다.

---

## 2. 검증 파이프라인 (3단계)

```
파일 선택
  → ① 파일 읽기
  → ② JSON.parse (문법 검증)
  → ③ validateNotebook (스키마/구조 검증)
  → ok면 confirm 후 state 교체 / fail이면 alert
```

| 단계 | 검사 내용 | 실패 시 메시지 (예) |
|------|-----------|---------------------|
| ① | `file.text()` | 파일을 읽을 수 없습니다. |
| ② | `JSON.parse(text)` | JSON 형식이 올바르지 않습니다. |
| ③ | `validateNotebook(parsed)` | categories 없음 / 비어 있음 / 필드 형식 오류 |

**핵심 원리:**

- **② = 문법(syntax)** — 괄호·쉼표·따옴표가 맞는가
- **③ = 의미(schema / structure)** — 앱이 기대하는 **객체 모양**인가

---

## 3. 앱이 기대하는 데이터 스키마

`localStorage` 키 `coderead-notebook`에 저장되는 형태:

```json
{
  "categories": [
    {
      "id": "cat-js",
      "name": "JS",
      "pages": [
        {
          "id": "page-1",
          "title": "제목",
          "text": "설명",
          "code": "console.log(1)",
          "language": "js"
        }
      ]
    }
  ]
}
```

### 필드 규칙 (현재 구현)

**루트**

- `categories`: **배열**, **길이 ≥ 1**

**category**

- `id`: 문자열, **비어 있지 않음**
- `name`: 문자열, **비어 있지 않음**
- `pages`: **배열** (빈 배열은 허용)

**page**

- `id`: 문자열, **비어 있지 않음**
- `title`, `text`, `code`: **문자열** (빈 문자열 `""` 허용)
- `language`: 문자열, **비어 있지 않음**

### 검증하지 **않는** 것 (현재)

- `id` 중복 여부
- `language` 값이 `js` / `react` 등 **허용 목록**인지
- 추가 필드(`foo`, `version` 등) — 통과 후 **제거(whitelist)**

---

## 4. 구현 패턴: Result 객체

함수는 예외(throw) 대신 **`{ ok, error?, data? }`** 반환:

```js
// 성공
{ ok: true, data: { categories: [...] } }

// 실패
{ ok: false, error: 'categories 배열이 없습니다.' }
{ ok: false, cancelled: true }  // import confirm 취소 (별도)
```

**장점**

- UI에서 `alert(result.error)` 처리가 단순
- try/catch와 비즈니스 오류를 분리

---

## 5. Sanitize(정규화) 원리

검증 통과 후 **필요한 필드만** 새 객체로 복사:

```js
{
  categories: data.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    pages: cat.pages.map(page => ({
      id, title, text, code, language
    }))
  }))
}
```

**목적**

- JSON에 **불필요·악의적·실수로 추가된 필드** 제거
- 앱 state가 **예측 가능한 형태**만 유지

→ “느슨한 입력, 엄격한 출력” (permissive parse, strict output)

---

## 6. 계층적 검증 (recursive validation)

```
validateNotebook
  └── categories.every(validateCategory)
        └── pages.every(validatePage)
```

**원리:** 큰 구조부터 → 작은 단위로 내려가며 **모든 노드**가 규칙을 만족해야 통과.

---

## 7. JSON.parse vs 스키마 검증 — 비교

| | JSON.parse | validateNotebook |
|---|------------|------------------|
| 검사 | 문법 | 앱 도메인 구조 |
| 실패 예 | `{categories:` | `{ "categories": "문자열" }` |
| 도구 예 | — | Zod, Yup, JSON Schema, io-ts |

현재 프로젝트는 **수동 if/typeof** — 의존성 없음, 스키마 작을 때 충분.

---

## 8. AI에게 물어볼 수 있는 질문 예시

1. **개념:** “JSON syntax validation과 schema validation 차이를 이 백업 예시로 설명해줘.”
2. **보안:** “localStorage import 시 prototype pollution 같은 JSON 위험은? whitelist 복사로 충분한가?”
3. **개선:** “Zod로 이 스키마를 옮기면 어떤 코드가 되나?”
4. **UX:** “검증 실패 시 alert 대신 더 나은 UX는?”
5. **버전:** “백업 JSON에 `version: 1` 필드를 넣고 마이그레이션하려면?”
6. **엣지 케이스:** “categories는 있는데 pages가 null이면? id 중복이면?”
7. **테스트:** “validateNotebook 단위 테스트 케이스 목록을 만들어줘.”

---

## 9. 관련 소스 파일 (codeRead)

- `src/utils/notebookBackup.js` — `validateNotebook`, `readNotebookFile`, `downloadNotebook`
- `src/hooks/useNotebook.js` — `importNotebook` (confirm 후 state 교체)
- `src/App.jsx` — 내보내기/가져오기 버튼, 실패 시 `alert`

---

## 10. 한 줄 요약

> **가져오기 JSON 검증 = “파일을 읽을 수 있는가 → JSON 문법이 맞는가 → 우리 앱 수첩 구조와 같은가 → 필요한 필드만 골라 넣는가”**
