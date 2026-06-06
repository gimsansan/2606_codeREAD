export const defaultNotebook = {
  categories: [
    {
      id: 'cat-js-async',
      name: 'JS Async',
      pages: [
        {
          id: 'page-await-rule',
          title: 'await 한 줄 규칙',
          text: 'await 위 → 지금 당장 실행 (동기)\nawait 아래 → Promise 끝난 뒤 .then() 안 (VIP)\nasync 함수 호출 자체는 동기',
          code: 'await Promise.resolve()\nconsole.log("2")',
          language: 'js',
        },
        {
          id: 'page-event-loop',
          title: '이벤트 루프 순서',
          text: '동기 전부 → VIP 전부 → Task 1개 → 반복\nsetTimeout(fn, 0)은 Task\nPromise.then은 VIP',
          code: 'console.log("1")\nPromise.resolve().then(() => console.log("2"))\nsetTimeout(() => console.log("3"), 0)\nconsole.log("4")',
          language: 'js',
        },
      ],
    },
    {
      id: 'cat-react',
      name: 'React',
      pages: [
        {
          id: 'page-setstate',
          title: 'setState는 동기 호출',
          text: 'setN 호출은 즉시 실행\n렌더는 나중 (VIP/프레임)\n클릭 핸들러 안의 n은 아직 이전 값',
          code: 'const onClick = () => {\n  console.log("click", n)\n  setN(n + 1)\n  console.log("after set", n)\n}',
          language: 'react',
        },
        {
          id: 'page-useeffect',
          title: 'useEffect 타이밍',
          text: '렌더(commit) 후 실행\nuseLayoutEffect보다 늦음\n의존성 배열 변경 시 재실행',
          code: 'useEffect(() => {\n  console.log("effect", count)\n}, [count])',
          language: 'react',
        },
      ],
    },
 
  ],
}
