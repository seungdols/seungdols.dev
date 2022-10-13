---
layout: post
title: 'TypeScript에 뒷통수 맞은썰(Promise.all)'
description: 'TypeScript의 Promise.xxx는 최대 10개의 인자만 허용한다.'
date: 2019-07-13 09:41:00
category: typescript
tags: [typescript, programming]
comments: true
draft: false
---

# Promise.xxx는 인자의 수 제한이 있다?

이 글이 갑자기 순간적으로 리트윗이 되면서 이야기가 많이 오고 갔네요! 잘못된 부분과 설명의 차이를 인지 하는 게 중요하다고 생각합니다.

JS에서의 `Promise.xxx`는 `iterable`로 처리하기 때문에 실질적인 인자 개수의 제한이 없습니다.

[MDN-Promise.all](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

```
Promise.all(iterable);
```

그런데, `TypeScript`를 사용하게 되면, 이야기는 달라집니다. (이 설명은 아래에 수정이 있습니다.)

[TypeScript lib.es2015.promise.d.ts](https://github.com/microsoft/TypeScript/blob/master/lib/lib.es2015.promise.d.ts#L41)를 보시면 알 수 있습니다.

```
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

그래서 TS에서의 `Promise.all`에 인자로 10개이상 전달 할 수 없습니다. (이 부분에 대해서는 우리가 아무것도 할 수 없이 10개 이상은 전달 할 수 없다는 것은 아닙니다. seulgi.kim님이 남겨주신 글에서 참조 하여 10개 이상을 위해서는 직접 정의해서 사용하면 됩니다. )

이 부분을 제가 망각 하고, 프로그래밍 하다보니 문제가 생겼는데, 전 당연히?! 인자 개수때문은 아닐거라 판단 했습니다.  
그런데, 인자 개수 제한이 맞았습니다.

위에 대한 부분은 반은 맞고, 반은 틀린 설명이었네요! https://blog.seulgi.kim/2019/07/promise-all-tuple.html

링크에서 설명 해주신 것처럼 iterable 타입의 Promise.all도 있다고 설명을 해주셨습니다. (**@seulgi.kim님** 조언 감사합니다.)

그런데, 실질적으로 코드 확장이나, 타입 가드를 사용하지 않고, `--lib`옵션으로 따로 주지 않을 경우에는 `es2015.promise.d.ts`에 있는 `T1...T10`에 해당하는 all function의 오버로딩을 볼 수 있습니다. (이에 대한 부분에 제가 뒷통수를 맞았다고 글을 썼습니다.)

`누군가는 이 글을 보고 이상하다고 할 수도 있겠고`, `누군가는 오! 나도 이런 일을 겪었는데!` 라고 말 할 수 있을 것 같아서 제 생각에는 나름 황당한 경험이었기에 글을 썼습니다.

왜냐하면, JS 언어의 iterable인데, 이를 라이브러리의 의존성을 분리하기 위해서 promise.d.ts에는 최대 10개의 function overload를 , iterable.d.ts에는 iterable로 넣어둔다는게 아직은 쪼렙이라 잘 모르겠더군요. 누군가는 삽질 할 수 있는 포인트이기에 글을 써두었습니다.

참, 물론 10개 이상의 Promise를 묶는 것은 좋지 않은 Anti-pattern 일 수 있습니다. 그러나, 세상사 내 맘대로 되는 일 업고, 서비스 개발도 내 맘대로 되지 않습니다. 물론, 초고수가 와서 나에게 방법을 알려주면 좋겠군요. (우리팀으로 와서 저를 혼내셔도 됩니다. 코드로 보여주세요.)

물론 아래에 써둔 것처럼 블루버드를 마냥 찬양하는 것은 아닙니다. 우연히 보았을 뿐...(물론 iterable.d.ts를 못봤다.)

### 그 밖에

그런데, 찾다보니 [Blubird](http://bluebirdjs.com/docs/getting-started.html)라는 라이브러리에서는 `iterable`로 구현을 하고 있습니다.

BlueBird에서는 API doc에서도 확인 할 수 있듯이 iterable입니다.

[http://bluebirdjs.com/docs/api/promise.all.html](http://bluebirdjs.com/docs/api/promise.all.html)

[Promise.all | bluebird](http://bluebirdjs.com/docs/api/promise.all.html)

그러나, TypeScript에서 iterable인지는 직접 돌려봐야 알 것 같습니다.

[https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bluebird/index.d.ts#L857](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bluebird/index.d.ts#L857)

위의 부분이 정확한 실제 링크입니다. 다섯개까지는 동일한 구현이네요. 하지만, Types에도 아래와 같이 명시 되어 있습니다.

```
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

~~생각해보면, 왜 10개로 제한 했는지는 알 수 없다. 이건 MS에서 TS 개발자들이 생각하기에 성능 이슈를 판단해 10개로 제한 한 것인지는 모르지만, 표준 JS 스택을 지키지 않는건 문제가 있다고 생각한다.~~

반대로, 왜 promise.d.ts에는 10개의 overload를 지정해두었을까? 궁금하다. iterable.d.ts에는 iterable이라면... 왜 굳이..MS 형아들에게 물어보고 싶구나.
