---
layout: post
title: "코드스피츠 77 - ES6+ 3회"
description: "자바스크립트를 깊이 배워보자."
date: 2021-02-14 22:56:00
category: javascript
tags: [javascript, programming]
comments: true
---

## interface

* 인터페이스란 사양에 맞는 값과 연결된 속성키의 셋트
* 어떤 Object라도 인터페이스의 정의를 충족시킬 수 있다.
* 하나의 Object는 여러개의 인터페이스를 충족시킬 수 있다.

interface test

* test라는 키를 갖고
* 값으로 문자열인자를 1개 받아 불린 결과를 반환하는 함수가 온다.

```js
{
  test(str) { return true; }
}
```

### interator interface

1. next라는 키를 갖는다.
2. 값으로 인자를 받지 않고, IteratorResultObject를 반환하는 함수가 온다.
3. IteratorResultObject는 value와 done이라는 키를 갖고 있다.
4. 이 중 done은 계속 반복할 수 있을지 없을지에 따라 불린값을 반환한다. 

```js
{
  next() {
    return {value: 1, done: false}
  }
}

// 
{
  data: [1,2,3,4],
  next() {
    return {
      done: this.data.length == 0,
      value: this.data.pop()
    };
  }
}
```

### iterable interface

1. Symbol.iterator라는 키를 갖고
2. 값으로 인자를 받지 않고 iterator Object를 반환하는 함수가 온다.

```js
{
  [Symbol.iterator]() {
    return {
      next() {
        return { value: 1, done: false; };
      };
    }
  }
}
```

iterator만 존재하게 되면 루프를 한 번 돌면, 원본 데이터의 소비가 다 끝나기 때문에, 재실행이 불가능하다. 고로, iterable이 사본을 넘겨주면, iterator에서 루프를 도는 개념으로 이해하면 된다. (내가 이해한 걸로는 그렇다. 맞을까?)

iterable을 이용해서 iterator를 얻는 구조로 설계가 되어 있다. (패턴으로도 정립이 되어 있다.)

## Loop to iterator

현대 언어는 추세가 문을 식으로 바꾸고 싶어 한다. 이유는 flow에 한번 동작하면, 재소비가 불가능하고, 내가 원하는 곳에 넣고 실행하기가 불가능하다. 그래서 statement를 expression으로 바꾸고 있다.

```js
let arr = [1,2,3,4];
while(arr.length > 0) {
  console.log(arr.pop())
}
```

```
while(계속 반복할지 판단) {
  반복시 처리
}

{
  data: [1,2,3,4],
  next() {
    return {
      done: this.data.length == 0, // 반복 판단
      value: this.data.pop() // 반복시 처리 
    };
  }
}
```

iterator interface는 자기 자신의 대한 정보를 다 갖고 있다. (Self-description)

1. 반복자체를 하지 않지만
2. 외부에서 반복을 하려고 할때
3. 반복에 필요한 조건과 실행을
4. 미리 준비해둔 객체

반복 행위와 반복을 위한 준비를 분리 함. 

1. 미리 반복에 대한 준비를 해두고
2. 필요할 때 필요한만큼 반복
3. 반복을 재현할 수 있음

그래서 statement로 loop를 돌리지 않고, iterator로 loop를 돌리게 된다. 

## ES6+ Loop

약식으로 직접 iterator 반복처리기를 구현

```js
const loop = (iter, f) => {
  
  // iterable이라면, iterator를 얻는다.
  if (typeof iter[Symbol.iterator] == 'function') {
    iter = iter[Symbol.iterator]();
  } else return; 
  
  // IteratorObject가 아니라면 건너 뜀
  if (typeof iter.next != 'function') return; 
  
  do {
    const v = iter.next();
    if (v.done) return; // 종료처리
    f(v.value) // 현재 값을 전달함.
  } while(true);
  
};

const iter = {
  arr: [1,2,3,4],
  [Symbol.iterator]() { return this; },
  next() {
    return {
      done: this.arr.length == 0,
      value: this.arr.pop()
    };
  }
}

loop(iter, console.log);
```

### 내장반복처리기 구현 

#### Array destructuring

```js
const iter = {
  [Symbol.iterator]() { return this; },
  arr: [1,2,3,4],
  next() { 
  	return {
		  done: this.arr.length == 0,
  		value: this.arr.pop()
		};
  }
};

const [a, ...b] = iter;
console.log(a, b);


```

언어 스펙을 준수하면 언어의 지원을 받을 수 있다.

#### Spread

```js
const iter = {
  [Symbol.iterator]() { return this; },
  arr: [1,2,3,4],
  next() { 
  	return {
		  done: this.arr.length == 0,
  		value: this.arr.pop()
		};
  }
};

const a = [...iter];
console.log(a);
```

array의 스펙에 따라 지원 되는게 아니라 iterable을 구현했기 때문에 언어의 지원을 받을 수 있는 부분이다. (착각 하지 말 것.)

#### Rest Parameter

```js
const iter = {
  [Symbol.iterator]() { return this; },
  arr: [1,2,3,4],
  next() { 
  	return {
		  done: this.arr.length == 0,
  		value: this.arr.pop()
		};
  }
};

const test = (...arg) => console.log(arg);
test(...iter)
```

#### for of

```js
const iter = {
  [Symbol.iterator]() { return this; },
  arr: [1,2,3,4],
  next() { 
  	return {
		  done: this.arr.length == 0,
  		value: this.arr.pop()
		};
  }
};

for (const v of iter) {
  console.log(v);
}
```

iterable을 구현한게 Array도 있지만, String도 있기 때문에, 바로 문자열을 해체 할 수 있음. 

## Practice

제곱을 요소로 갖는 가상 컬렉션

```js
const N2 = class {
  constructor(max) {
    this.max = max;
  }
  [Symbol.iterator]() {
    let cursor = 0, max = this.max; // next 함수 입장에서 free variable
    return {
      done: false,
      next() {
        // free variable 관점에서는 이 영역이 closure area이다.
        if (cursor > max) {
          this.done = true;
        } else {
          this.value = cursor * cursor
          cursor++;
        }
        return this; 
        // iterable interface, itrable interface의 요구조건을 충족한다.
      }
    }
  }
}

console.log([...new N2(5)]);

for (const v of new N2(5)) {
  console.log(v);
}
```

폰 노이만 머신에서 메모리에 적재 되면, 쉴틈 없이 처리 된다는 사실을 기억 해야 함. 

쉴 틈 없이 적재된 명령어가 처리 되는 동안 꼼작도 못하는 상태를 뭐라고 부를까? 

이를 동기 명령이라고 부른다. 적재된 명령이 한번에 쭉 실행 되는 것을 말한다.

이 동기 명령이 실행 되는 것을 관찰하는 게 Flow이다. 동기 명령이 실행 되는 동안 우리는 cpu를 간섭할 수 없다.

cpu를 간섭할 수 없는 현상을 blocking이라고 한다. 

## Generator 

#### Iterator의 구현을 돕는 generator

```js
const generator = function*(max) {
  let cursor = 0;
  while(cursor < max) { // 시작과 종료에 대한 제어권을 다 가지고 있음.
    yield cursor * cursor;
    cursor++;
  }
} // 위의 N2 class와 역할을 같다.

console.log([...generator(5)]);

for (const v of generator(5)) {
  console.log(v);
}
```

부수적인 코드를 줄이고 위의 N2 class와 같은 역할을 할 수 있게 한다. (개인적으로 서비스 코드(실무)에서 써본적은 없다)

generator는 iterable이자 iterator를 반환 한다. (중요한 부분은 for of 구문에서는 generator를 쓸 수 없음. 하지만, 반환 된 건 for of에서 돌아간다. 왜냐면, iterable이자 iterator라서 돌아감...대혼란?!)

 yield 키워드는 generator 안에서만 쓸 수 있다. 그리고 yield는 suspend 기능을 가지고 있다. 

이 기능은 결국 while문 안에서 yield 위치에서 멈춘다. 즉, statement가 멈춘다. generator는 여러번 반복해서 돌기 때문에 co-routine(coroutine)이라고 부른다. ref. [코루틴](https://ko.wikipedia.org/wiki/코루틴)

generator는 문법적으로 축약을 많이 해주고 제어권을 많이 가져갈 수 있도록 해준다. 다만, es5로 변환될때 굉장한 오버헤드가 생긴다. generator를 iterable로 변환을 해줘야 하는데, 그 역할을 보통 babel이 해주는데 babel에서는 보통 generator를 번역해주긴 하지만, 금기시 함. ref. [Babel은 Generator를 어떻게 바꾸나](https://medium.com/@jooyunghan/babel은-generator를-어떻게-바꾸나-c78523645cd7) 를 보면, regeneratorRuntime를 이용해서 iterable interface를 충족하고 있다.

ref. https://babeljs.io/docs/en/learn/#generators 를 보면, 금기 한다는 말은 없는 것 같기도 하다. 내가 못찾는 것일 수도 있다. 

