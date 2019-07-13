---
layout: post
title: "TypeScript에 뒷통수 맞은썰(Promise.all)"
description: "TypeScript의 Promise.xxx는 최대 10개의 인자만 허용한다."
date: 2019-07-13 09:41:00
category: typescript
tags: [typescript, programming]
comments: true
---

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
BlueBird에서는 API doc에서도 확인 할 수 있듯이 iterable입니다. 

[http://bluebirdjs.com/docs/api/promise.all.html](http://bluebirdjs.com/docs/api/promise.all.html)

[

Promise.all | bluebird

← Back To API Reference Promise.all Promise.all(Iterable |Promise > input) -> Promise > This method is useful for when you want to wait for more than one promise to complete. Given an Iterable(arrays are Iterable), or a promise of an Iterable, which produc

bluebirdjs.com



](http://bluebirdjs.com/docs/api/promise.all.html)

그러나, TypeScript에서 iterable인지는 직접 돌려봐야 알 것 같습니다. 

[https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bluebird/index.d.ts#L857](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bluebird/index.d.ts#L857)

위의 부분이 정확한 실제 링크입니다. 다섯개까지는 동일한 구현이네요. 하지만, Types에도 아래와 같이 명시 되어 있습니다. 

```typescript
  /**
   * Given an array, or a promise of an array, which contains promises (or a mix of promises and values) return a promise that is fulfilled when all the items in the array are fulfilled.
   * The promise's fulfillment value is an array with fulfillment values at respective positions to the original array.
   * If any promise in the array rejects, the returned promise is rejected with the rejection reason.
   */
  // TODO enable more overloads
  // array with promises of different types
  static all<T1, T2, T3, T4, T5>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>, Resolvable<T5>]): Bluebird<[T1, T2, T3, T4, T5]>;
  static all<T1, T2, T3, T4>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>, Resolvable<T4>]): Bluebird<[T1, T2, T3, T4]>;
  static all<T1, T2, T3>(values: [Resolvable<T1>, Resolvable<T2>, Resolvable<T3>]): Bluebird<[T1, T2, T3]>;
  static all<T1, T2>(values: [Resolvable<T1>, Resolvable<T2>]): Bluebird<[T1, T2]>;
  static all<T1>(values: [Resolvable<T1>]): Bluebird<[T1]>;
  // array with values
static all<R>(values: Resolvable<Iterable<Resolvable<R>>>): Bluebird<R[]>;
```

생각해보면, 왜 10개로 제한 했는지는 알 수 없다. 이건 MS에서 TS 개발자들이 생각하기에 성능 이슈를 판단해 10개로 제한 한 것인지는 모르지만, 표준 JS 스택을 지키지 않는건 문제가 있다고 생각한다.
