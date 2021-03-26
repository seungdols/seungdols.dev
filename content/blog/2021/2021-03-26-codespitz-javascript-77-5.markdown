---
layout: post
title: "코드스피츠 77 - ES6+ 5회"
description: "자바스크립트를 깊이 배워보자."
date: 2021-03-26 15:29:00
category: javascript
tags: [javascript, programming]
comments: true
---

# 코드스피츠 77 - ES6+ 5회차 (Block, Non-Block & Sync, Async)

## Block, Non-Block

Flow를 막고 있는 것을 Block이라고 하고, 그런 상태를 blocking(상태)로 표현 한다.

업계 표준이 존재함. 그 표준 시간 동안 멈춰 있으면, Blocking/Non-Blocking으로도 볼 수 있다. 

### Flow is blocking

```js
for(const i of (function*() {
  let i = 0;
  while(true) yield i++;
})()) console.log(i);

// script timeout
// 플랫폼의 안정성을 위해 블록 되는 시간이 길면 강제 종료 시킴.
```

### Blocking function

점유하는 시간만큼 블록을 일으키는 함수

```js
const f = v -> {
  let i = 0;
  while(i++ < v);
return i;
}
f(10);
f(1000000000000000000); // blocking function
```

인자에 따라서 빨리 실행 될 수도 있고, 배열의 원소가 1억개 이상이면, blocking function이라 부르고, 이런 함수는 인자에 따라서 blocking 의 범위가 늘어나고 좁아든다. 

[Java의 HashSet](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/HashSet.html)과 [JavaScript의 WeakSet](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)과 유사하다. 이 두 객체는 blocking function이 아닌데, 이유는 인자에 따라서 blocking이 정해지지 않고, Hash에 따라서 값을 찾을 수 있다. (비용이 항상 정해져 있음)

그리고 우리는 뭔지 모르게 Blocking Function으로 작성을 한다. 인자에 따라서 정해져있는지 체크를 하진 않는다. 

함수 한 두개가 Blocking Function이라면, 어플리케이션 전체가 기저의 영향을 받게 되어 운. 안좋으면 강제 종료 될 수 있다. 

그래서 코드를 잘 짜야 한다. 

#### Blocking Function의 종류

* 배열 순회, 정렬
* DOM 순회
* 이미지 프로세싱

### Blocking Evasion

* 독점적인 cpu점유로 인해 모든 동작이 정지됨 
* 타임아웃체크에 의해 프로그램이 강제 중단됨

제어 받는 코드로 어플리케이션으로 작성하면, OS가 제어권이 훨씬 높고, 어플리케이션이 중단 됨. (어플리케이션이 아무리 돌아도 전화 오면 모바일은 전화 우선권이 높다. 예시를 들어주심.)

블록킹의 조합을 예측할 수 없다. 

```js
const f = v -> other(some(v), v * 2);
f(10);
```

#### 순차실행 

1 2 3

#### 시분할 운영체제의 동시 실행 

1 2 1 2 3 1 2 1 같은 순서로 실행 

왜 시분할로 실행 하는가? 멀티태스킹 지원이 필수이기 때문..

### 자바스크립트 쓰레드 

* Main UI Thread 1 (얘가 흔히 아는 싱글 쓰레드)
* BackGround Thread N
* Web Worker Thread (HTML5에서 나오게 됨.)

#### Main UI Thread 

자신의 시간큐를 무한 루프 돌리면서 프레임을 실행 시킴.

Frame - 명령큐 

* 프레임마다 타임스탬프를 포함하고 있다. 

이를 Suspension Pattern이라고 부른다. 공급자, 소비자 모델이다. 

기본적으로 JavaScript는 Blocking Evasion을 frame내의 시간을 잘라서 실행 시킴으로 해결함. 

### Time slicing

```js
const looper = (n, f) => {
  for(let i = 0; i < n; i++) f(i);
}
looper(10, console.log);
looper(10000, console.log);
```



#### Time Slicing (Manual)

```js
const looper = (n, f, slice = 3) => {
  let limit = 0, i = 0;
  const runner =_=> {
    while(i < n) {
      if (limit++ < slice) f(i++);
      else {
        limit = 0;
        requestAnimationFrame(runner);
        break;
      }
    }
  };
  requestAnimationFrame(runner);
}
```

위 함수는 n보다 slice에 의해 제어가 다음으로 계속 넘어가게 된다. 

```js
looper(12, console.log)
```



#### Time Slicing (Auto)

```js
const looper = (n, f, ms=5000, i = 0) => {
  let old = performance.now(), curr;
  const runner =curr=> {
    while(i < n) {
      if (cur - old < ms) f(i++);
      else {
        old = performance.now();
        requestAnimationFrame(runner);
        break;
      }
    }
  };
  requestAnimationFrame(runner);
}
```

5초마다 다음 프레임으로 넘어 가게 된다. 

## Sync, Async

Sync - 서브루틴이 즉시 값을 반환

```js
const double = v => v * 2
console.log(double(2))
```



Async - 서브루틴이 콜백을 통해 값을 반환

```js
const double = (v, f) => f(v*2)
double(2, console.log)
```

### Sync 예시

Block - 즉시 플로우 제어권을 반환하지 않음.

```js
const sum = n => {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
}
sum(100)
```

Non Block - 즉시 플로우 제어권을 반환함

```js
const sum = n => {
  const result = {isComplete: false}
  requestAnimationFrame(_=> {
    let sum = 0; 
    for (let i = 1; i <= n; i++) sum += i;
    result.isComplete = true;
    result.value = sum
  });
  return result;
}
const result = sum(100);
const id = setInterval(() => {
  if (result.isComplete) {
    clearInterval(id);
    console.log(result.value);
  }
}, 10); // Java에는 Future
```

JavaScript에 [img태그](https://www.w3schools.com/jsref/prop_img_complete.asp)에서 이렇게 예전에 썼었다. Sync-Non-blocking방식을 쓴다. 요즘에도 이런 방식을 쓰는 경우가 있다. 

### Async 예시

Block 

```js
const sum = (n, f) => { // Blocking이 걸린다. 
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return f(sum); // Async의 조건 
}
sum(10, console.log)
```

Non-Block

```js
const sum = (n, f) => {
  reqeustAnimationFrame(_=> {
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += i;
    f(sum);
  });
};

sum(10, console.log);
```

### Sync 

- Block
  - normal API
  - legacy API
- Non-Block
  - old API
    - IOCP
    - Future
    - Img.complete

### Async

* Block
  * Trap (이 경우는 제일 잘못된 방식)
* Non-Block
  * Modern API

### Similar Async Block

```js
const sum = (n, f) => {
  reqeustAnimationFrame(_=> {
    let sum = 0;
    for(let i = 1; i <= n; i++) sum += i;
    f(sum);
  })
}
sum(1000000000, console.log);
console.log(123);
// 이런 경우에는 프레임마다 죽을 수도 안죽을 수도 있음.
```

> Math.random은 속도가 느리고, 차라리 배열 1000개 만들고 그걸 돌리는게 훨씬 성능이 좋다. 

위와 같은 경우도 무조건 비동기이지만, 블로킹이 되기 때문에 이런 방식의 코드를 작성 하면 안된다.

```js
const backRun = (f, end, ...arg) => {
  const blob = new Blob([`onmessage = e=> postMessage((${f})(e.data));`], {type: 'text/javascript'});
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  worker.onmessage = e => end(e.data);
  worker.onerror = e=> end(null);
  worker.postMessage(arg);
}

const f = v => {
  let sum = 0;
  for(let i = 1; i <= v[0]; i++) {
    sum += i;
  }
  return sum;
}

let i = 1000
while(i--) backRun(f, console.log, 100000);
```

 워커 함수를 쓰는건 백그라운드 쓰레드를 쓰는 것인데, CPU 코어수의 2배정도만 해야지 그 이상 하게 되면 OS의 시분할 작업으로 동작하기 때문에 굉장히 느리다. 

위와 같이 작성 하면 안된다. 

