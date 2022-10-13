---
layout: post
title: "Google I/O '19 - puppeteer 관련 영상 정리"
description: 'Modern web testing and automcation with Puppeteer 영상 정리'
date: 2020-09-14 22:09:62
category: puppeteer
tags: [puppeteer, test, programming]
comments: true
draft: false
---

[Modern Web Testing and Automation with Puppeteer (Google I/O '19)](https://www.youtube.com/watch?v=MbnATLCuKI4)

### puppeteer 성능 높이기

```jsx
cosnt browser = await puppeteer.launch()

it ('', async() => {
  const context = await browser.createIncognitoBrowserContext();
  // ...
  await context.close()
})
```

브라우저의 새로운 시크릿 컨텍스트를 생성해서 테스팅 하는 것이 더 빠르다.

렌더링이 되기 전에 테스트를 돌리다 보면, 테스트가 실패하는 이슈가 발생하는데, 기본적인 해결책은 sleep을 넣어준다.

```jsx
await page.waitFor(1000)
```

그런데, 이 방식은 좋지 않다.

```jsx
page.waitForSelector()
page.waitForReqeust()
page.waitForResponse()
page.waitForFunction()
page.waitForNavigation()
```

`page.waitForXX API`를 사용하자.

위의 예시에서 `page.waitForSelector()`를 사용하면, DOM 요소가 나타날 때까지 기다리게 된다.

### Geolocation 설정

```jsx
page.setGeolocation({})
```

### 서비스 워커 체크도 가능하다.

```jsx
await context.waitForTarget(target => {
  return target.type() === 'service_worker'
})
```

### 네트워크 모니터링

```jsx
page.on('request', reqeust => {
  console.log(request.method())
})
page.on('response', response => {
  console.log(response.method())
})
```

그 밖에 다양한 API를 제공 한다.

- Headers
- POST data
- Content
- From cache, From service-worker

### 네트워크 요청 가로채기

```jsx
await page.setRequestInterception(true)
page.on('request', reqeust => {
  if (request.resourceType() === 'image') {
    request.respond({ body: randomCatImage() })
  } else {
    request.continue()
  }
})
```

### 키보드/마우스

```jsx
await page.keyboard.press()
```

### 성능 테스트

```jsx
const metrics = await page.metrics()
```

```jsx
await page.tracing.start({ path: './trace.json' })
// something doing
await page.tracing.stop()
```

### 코드 커버리지

- `page.coverage.startCSSCoverage()`
- `page.coverage.stopCSSCoverage()`
- `page.coverage.startJSCoverage()`
- `page.coverage.stopJSCoverage()`

### Accessibility

```jsx
const snapshot = await page accessiblity.snapshot()
```

### 그 밖의 툴 (use puppeteer)

- https://github.com/ai/size-limit
- https://github.com/pocketjoso/penthouse
