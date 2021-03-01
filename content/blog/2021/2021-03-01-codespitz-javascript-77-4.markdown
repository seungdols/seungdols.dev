---
layout: post
title: "코드스피츠 77 - ES6+ 4회"
description: "자바스크립트를 깊이 배워보자."
date: 2021-03-01 20:02:00
category: javascript
tags: [javascript, programming]
comments: true
---


## Complex recursion

단순한 배열을 루프인 경우는 간단히 이터레이션을 작성할 수 있음.

```js
{
  [Symbol.iterator]() { return this; },
  data: [1,2,3,4],
  next() {
    return {
        done: this.data.length == 0,
        value: this.data.shift()
    }
  }
}
```



문제는 다층형 그래프는 어떻게 이터레이션을 할 것인가?

```js
{
  [Symbol.iterator]() { return this; },
  data: [{ a: [1,2,3,4], b: '-'}, [5,6,7], 8, 9],
  next() {
    return /// 어떻게 작성 해야 할까?????
  }
}
```

```js
{
  [Symbol.iterator]() { return this; },
  data: [{ a: [1,2,3,4], b: '-'}, [5,6,7], 8, 9],
  next() {
    let v;
    while (v = this.data.shift()) {
      switch (true) {
        case Array.isArray(v): 
          this.data.unshift(...v);
          break;
        case v && typeof v == 'object': 
          for(var k in v) this.data.unshift(v[k]); // hasOwnProperty 써줘야 함. 
          break;
        default: 
         	return { value: v, done: false };
      }
    }
    return { done: true };
  }
}
```

컨테이너가  아니면 잘라서 계속 넣는 방법을  이용하면 쉽게 해결, 실제 위 코드에서는 런타임 평가이기 때문에 카운트 변수로 100번이나 만번으로 최대 동작 회수를 넣어주는게 좋다. 

위 코드는 오류가 있다. data쪽에 a에 값 아무걸로 바꾸면 문제가 생긴다. 

아래 코드로 바꿀 수 있다.

```js
{
[Symbol.iterator]() { return this; },
  data: [{ a: [1,2,3,4], b: '-'}, [5,6,7], 8, 9],
  next() {
    let v;
    while (v = this.data.shift()) {
      if (!(v instanceof Object)) return { value: v}; // null인 경우 조건을 넣어줘야 함.
      if (!Array.isArray(v)) v = Object.values(v);
      this.data.unshift(...v);
    }
    return { done: true };
  }
}
```



```js
const Compx = class {
  constructor(data) { this.data = data; }
  [Symbol.iterator]() { 
    const data = JSON.parse(JSON.stringify(this.data)); // 여기에 대괄호를 붙이면 더 안전하다. 데이터가 무엇이 오든 배열 형태로 받게 됨.
    return {
      next() { // es6 문법임 (function 작성)
        let v;
        while (v = data.shift()) {
          if (!(v instanceof Object)) return { value: v}; // null인 경우 조건을 넣어줘야 함.
          if (!Array.isArray(v)) v = Object.values(v);
          data.unshift(...v);
    		}
   		 return { done: true };
      }
    };
  }
};

const a = new Compx([{a: [1,2,3,4], b: '-'}, [5,6,7], 8, 9])
console.log([...a])
```

이런 코드의 문제를 발견하려면, 단위 테스트를 작성하는게 중요하고 단위 테스트는 커버리지가 중요하다. 

```js
const Compx = class {
  constructor(data) { this.data = data; }
  *gene() { 
    const data = JSON.parse(JSON.stringify(this.data)); // 여기에 대괄호를 붙이면 더 안전하다. 데이터가 무엇이 오든 배열 형태로 받게 됨.
    let v; 
    while(v = data.shift()) {
        if(!(v instanceof Object)) yield v;
        else {
          if(!Array.isArray(v)) v = Object.values(v);
          data.unshift(...v);
         }
       }
    }
};

const a = new Compx([{a: [1,2,3,4], b: '-'}, [5,6,7], 8, 9])
console.log([...a.gene()])
```

아까 보다 직관적으로 코드를 작성 했다. if - else로 확실하게 명확하게 케이스를 분리 해준다. 주석에 의존하지 말고 코드를 먼저 명확하게 작성 하면 코드에 주석을 넣을 이유가 없다.  

## Abstract Loop

다양한 구조의 루프와 무관하게 해당 값이나 상황의 개입만 하고 싶은 경우

```js
(data, f) => {
  let v; 
    while(v = data.shift()) {
        if(!(v instanceof Object)) f(v);
        else {
          if(!Array.isArray(v)) v = Object.values(v);
          data.unshift(...v);
         }
       }
    }
}
```

statement로 확정 되어 있어서 재활용이 불가능하다. 

결국 제어문을 직접 사용할 수는 없고 구조 객체를 이용해 루프실행기를 별도로 구현

```js
 if(!(v instanceof Object)) {}
   
 else {
          if(!Array.isArray(v)) v = Object.values(v);
          data.unshift(...v);
 }
```

위 코드에서 if - else 부분이 개별구조 객체 부분이므로 뺄 수 있음. 대신 외부에서 if를 제거 하려면, 외부에서 객체 하나씩 분리해내면 된다. 

팩토리 패턴과 컴포지트 패턴으로 이용한다. 

```js
const Operator = class {
  static factory(v) {
    if (v instanceof Object) {
      if(!Array.isArray(v)) v = Object.values(v);
      return new ArrayOp(v.map(v => Operator.factory(v)));
    } else return new PrimaOp(v);
  }
  constructor(v) { this.v = v;}
  operation(f) { throw 'override'; }
}

const PrimaOp = class extends Operator {
  constructor(v) { super(v); }
  operation(f) { f(this.v); }
}

const ArrayOp = class extends Operator {
  constructor(v) { super(v); }
  operation(f) { for(const v of this.v) v.operation(f); }
}

Operator.factory([1,2,3, {a: 4, b:5}, 6,7]).operation(console.log)
```

 객체의 분기를 통해서 루프 실행기의 분기를 제거 함.

```js
const Operator = class {
  static factory(v) {
    if (v instanceof Object) {
      if(!Array.isArray(v)) v = Object.values(v);
      return new ArrayOp(v.map(v => Operator.factory(v)));
    } else return typeof v == 'string' ? new StringOp(v) : new PrimaOp(v);
  }
  constructor(v) { this.v = v;}
  operation(f) { throw 'override'; }
}
const StringOp = class extends Operator {
  constructor(v) { super(v); }
  operation(f) { for(const ch of this.v) f(ch); }
}
const PrimaOp = class extends Operator {
  constructor(v) { super(v); }
  operation(f) { f(this.v); }
}

const ArrayOp = class extends Operator {
  constructor(v) { super(v); }
  operation(f) { for(const v of this.v) v.operation(f); }
}

Operator.factory([1,2,3, {a: 'abc', b:5}, 6,7]).operation(console.log)
```

구글 크롬에서 스크립트 창에서 실행할 때, const는 재할당이 안되니까 불편한데, 모든 코드를 `if(1)` 로 감싸면 계속 재실행이 된다. 이것 팁이다.

### ES6 Iterable

```js
const Operator = class {
  static factory(v) {
    if (v instanceof Object) {
      if(!Array.isArray(v)) v = Object.values(v);
      return new ArrayOp(v.map(v => Operator.factory(v)));
    } else return new PrimaOp(v);
  }
  constructor(v) { this.v = v;}
  *gene(f) { throw 'override'; }
}

const PrimaOp = class extends Operator {
  constructor(v) { super(v); }
  *gene(f) {  yield this.v; }
}

const ArrayOp = class extends Operator {
  constructor(v) { super(v); }
  *gene(f) { for(const v of this.v) yield * v.gene(); }
}

for (const v of Operator.factory([1,2,3, {a: 4, b:5}, 6,7]).gene()) operation(console.log(v))
```

## Lazy Execution

최적화 영역은 사실 3%정도에 속한다. 결국에 내가 최적화 하는 것보다는 엔진이 최적화하는게 훨씬 이득. 표준 함수가 있으면 표준 함수가 유리하다. 내가 최적화 하는게 별 의미가 읍..슴 

사실 최대의 최적화는 렌더링이 97%이다. DOM 얼마나 적게 건드리는건지가 중요하다. 그리고 구조적으로 복잡성을 줄이는게 제일 좋다. 알고리즘 관점으로는 표준함수를 쓰는게 제일 좋다. 

```js
const odd = function*(data) {
  for (const v of data) {
    console.log("odd", odd.cnt++)
    if (v % 2) yield v;
  }
}
odd.cnt = 0;
for(const v of odd([1,2,3,4])) console.log(v);
```

나머지 연산자의 경우 양의 정수에만 동작 한다. (예외처리 해주려면, 음수인걸 반전 시켜주도록 처리 하는게 좋음.)

```js
const take = function*(data, n) {
  for (const v of data) {
    console.log("take", take.cnt++)
    if (n--) yield v; else break;
  }
};

take.cnt = 0;
for(const v of take([1,2,3,4], 2)) console.log(v);
```

```js
for(const v of take(odd([1,2,3,4]), 2)) console.log(v);
```

coroutine의 suspension을 이용하는 방법이다. 제어문이 실행 되다가 멈출 수 있는 걸 이용할 수 있다. 반복이 굉장히 효율적으로 동작하게 된다.

```js
const Stream = class {
  static get(v) { return new Stream(v); }
  constructor(v) {
    this.v = v;
    this.filters = [];
  }
  add(gene, ...arg) {
    this.filters.push(v => gene(v, ...arg))
    return this;
  }
  *gene() {
    let v = this.v;
    for(const f of this.filters) v = f(v);
    yield* v;
  }
}
```

위의 개념이 Java 8의 Stream 개념과 같고, 일반적인 함수형 언어 Stream이라고 하는 개념이다. 

```js
const odd = function*(data) {
  for (const v of data) if(v % 2) yield v;
}

const take = function*(data, n) {
  for (const v of data) if (n--) yield v; else break;
}

for(const v of Stream.get([1,2,3,4]).add(odd).add(take, 2).gene())
  console.log(v)
```

지연 실행을 이용해서 중복을 제거하고 추상 루프를 만들 수 있다. 정확하게 필요한 반복 횟수만 실행하는 함수를 만들 수 있다는 장점이 있다.

```js
add(take, 2) 
```

위 코드에서 커링으로 보면 된다. Stream 클래스의 add 함수에서 `...arg`로 풀어서 인자로 넣어준다. `v => gene(v, ...arg)`이 부분이 커링 함수이다. (...나만 커링을 또 까먹은 것인가...)

지금 까지는 동기적인 루프에 대해서 말 했는데, 비동기는 더 어렵다. 이정도까지는 괜찮다. 그리고 함수형으로 배우면 더 어렵고, JavaScript의 Generator 문법으로 배우는게 훨씬 이해가 쉽다. 그리고 코드가 간략해진다.

 그런데, 지금까지의 스펙이 2015년도 스펙이므로 구닥다리의 개념이다. (심지어 나는 이걸 2021년에 보고 있다..)

해마다 ECMA 스펙에 각 언어들의 최종 스펙들을 다 넣고 있음.. 그래서 배우기가 쉽지 않다. (이 말은 결국 깊하게 배워서 잘 쓰기가 어렵다.)

---

그러면, 결론적으로 JavaScript를 내가 쉽다고 생각하면 내가 그 언어를 잘 못쓰고 있을 가능성이 높다.
