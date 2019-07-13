---
layout: post
title: "TypeScript에 뒷통수 맞은썰(Promise.all)"
description: "TypeScript의 Promise.xxx는 최대 10개의 인자만 허용한다."
date: 2019-07-13 09:41:00
category: typescript
tags: [typescript, programming]
comments: true

# Promise.xxx는 인자의 수 제한이 있다? 

JS에서의 `Promise.xxx`는 `iterable`로 처리하기 때문에 실질적인 인자 개수의 제한이 없습니다. 

[MDN-Promise.all](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

```javascript
Promise.all(iterable);
```

그런데, `TypeScript`를 사용하게 되면, 이야기는 달라집니다. 


[TypeScript lib.es2015.promise.d.ts](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es2015.promise.d.ts#L41)를 보시면 알 수 있습니다. 

```typescript
all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>
all<T1, T2, T3, T4, T5, T6, T7, T8, T9>
all<T1, T2, T3, T4, T5, T6, T7, T8>
all<T1, T2, T3, T4, T5, T6, T7>
all<T1, T2, T3, T4, T5, T6>
all<T1, T2, T3, T4, T5>
all<T1, T2, T3, T4>
all<T1, T2, T3>
all<T1, T2>
all<T1>
```

위와 같이 총 10개의 all type이 있습니다. 

그래서 TS에서의 `Promise.all`에 인자로 10개이상 전달 할 수 없습니다. 

이 부분을 제가 망각 하고, 프로그래밍 하다보니 문제가 생겼는데, 전 당연히?! 인자 개수때문은 아닐거라 판단 했습니다.
그런데, 인자 개수 제한이 맞았습니다. 

그런데, 찾다보니 [Blubird](http://bluebirdjs.com/docs/getting-started.html)라는 라이브러리에서는 `iterable`로 구현을 하고 있습니다. 

[@types/bluebird](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bluebird/index.d.ts#L570)

위 링크의 라인을 보시면, 알 수 있듯이 `iterable`로 구현하고 있습니다. 

생각해보면, 왜 10개로 제한 했는지는 알 수 없다. 이건 MS에서 TS 개발자들이 생각하기에 성능 이슈를 판단해 10개로 제한 한 것인지는 모르지만, 표준 JS 스택을 지키지 않는건 문제가 있다고 생각한다.
