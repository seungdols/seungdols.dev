---
layout: post
title: "코드스피츠 77 - ES6+ 2회"
description: "자바스크립트를 깊이 배워보자."
date: 2021-02-13 21:06:00
category: javascript
tags: [javascript, programming]
comments: true
---

## 코드스피츠 77 - ES6+ 1/2회차

인사이드 자바스크립트, 자바스크립트를 말하다. 

좋은 책이나, 3.1버전의 자바스크립트 엔진 기반으로 설명 되어있다. 

현대 ES5이후의 자바스크립트 엔진이 달라졌다. 해마다 엔진 스펙이 달라진다.

엔진 스펙을 공부한다고해서 그게 장점이 되지 않는다. 

그러면 뭘 배우냐? 

작동원리 보다는 자바스크립트 자체의 추상적인 의미나, 체계를 배우는 게 훨씬 이득이다.

자바스크립트 엔진은 statement를 record로 바꿔주고, Record를 처리 하고, 그 다음 Record를 처리 하는 방식으로 동작한다. statement와 record는 대응 된다.

Flow control statement들은 Completion Record로 바뀐다. 

그리고 Record를 뭘 선택할지 결정하는데 사용 된다. 

  ## Direct Flow Control

ABC언어들은 if, while, for를 제공하고, 다른 언어들이 이런 개념을 지원 한다면 ABC언어의 자손 언어라고 생각 할 수 있다. 



### Label

### Identifier

* `$`로 시작 할 수 없는 특징 제외하고는 자바스크립트 변수 선언과 동일하다. 
* `:`을 붙이면 label로 인식한다.
* label은 브라우저가 해석하기에 Record로 해석 되지 않는다. 즉, statement로 볼 수 없다.

### Scope

* label은 같은 스코프안에 2개가 존재 할 수 없다. (static parsing에서 결정 됨.)

* 함수로 범위가 제한 됨.

* label scope가 따로 있음. 

  * `{}`로 감싸면 스코프가 제한적으로 생성 됨.
  * label shadow도 발생할 수 있음. 
    * 외부 label, 내부 label 간의 label scope로 인해서 외부 label이 가려지는 현상이 발생 함.

* ```js
  const test = () => {
  
  abc: { 
    console.log('start')
    if (true) {
      break abc;
    }
  }
  console.log('end')
  }
  test()
  ```

### label range & label set

```js
const label_test = () => {
console.log('0')
abc: 
  if (true) {
    break abc;
  }
  console.log('1')
bbb: 
  console.log('2')
}
label_test()
```

go to처럼 건너 뛰려면, 세가지 방법 밖에 없다. 

* label scope를 선언 한다.
* iteration label
* switch label
* 예외적으로 loop의 continue

그리고 label이 ABC언어에서의 if, loop를 도입하기 전 원하는 곳으로 흐름을 이동시키기 위한 방법으로 고안한 것이었다. 

현대 label과 과거의 goto와 차이점은 직접 이동 하는 것은 불가능하고, break, continue로 아래로 이동하는 것만 가능하다. 

label이 위에 있으면 위로 갈 수는 없다. 그리고 왔다 갔다 할 수 없게 만들어져 있다.

loop에서는 왜 label name없이 break에서 쓸 수 있을까? 

* JS engine에서 암묵적으로 label name을 정해준다. 
* 이게 바로 auto label이라고 부르며, undefined named label이라고도 한다. 
* while, for문에서 주로 발생 됨.

앞주석을 쓰는 경우도 있음. 

```js
console.log('end') // a
console.log('00000000000') // a
console.log('000000000000000000') // a
A: console.log('end') 
B: console.log('00000000000') 
C: console.log('000000000000000000')
```

label구문은 블럭의 마지막부분으로 보내는 ABC언어의 예외라는 특징을 가지고 있다. 

Java의 label 스펙을 그대로 JavaScript에서 그대로 가져 왔다. 



## Switch

* Special label block만 쓸 수 있다.

  * `case []:`, `default:`

* Fall through

  * break를 안 쓰면 default label까지 동작하는 현상

* runtime evaluation switch vs non-runtime evaluation switch의 차이

  * ```js
    switch(true) {
      default: console.log('c')
      case true: console.log('a')
      case false: console.log('b')
    }
    
    // a
    // b
    
    switch(true) {
      default: console.log('c')
      case 1: console.log('a')
      case false: console.log('b')
    }
    
    // c
    // a
    // b
    ```

* ```js
  // 값에 대한 라우팅 테이블 방식
  
  const a = true
  temp17: 
   switch(a) {
     default: console.log('c')
     case f1(a): console.log('a') break temp17;
     case f2(a): console.log('b')
   }
  console.log('end')
  ```

  * 값에 의한 라우팅(분기) 개념이므로 case에 대한 값이 확정적일 필요는 없다. 어차피 Runtime에 평가되기 때문에 값 자체가 확정적일 필요 없음. 

* ```js
  // chain of responsiblity
  
  switch (true) {
    case f3(): 
    case f4():
  }
  
  // example
  switch (true) {
    case network() === 'online':
  	case network() === 'wifi':
    case network() === 'offline':
    case localCache(): 
    default: 
  }
  ```

  * https://refactoring.guru/design-patterns/chain-of-responsibility 패턴과 유사하다.

Switch가 Runtime에서 실행 된다는 말은 곧 한 줄씩 순차적으로 해석 실행 된다는 말이다. 아래 다음에 영향을 주게 된다.

```js
let c = 2;
switch (true) {
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
  case c++ > 5: console.log(c); break;
}

// 7
```

---

## 코드스피츠 77 - ES6+ 2/2회차

77 - 2/2회차는 오디오가 녹음이 안되어서 73 - ES6 2회차 2/2로 시청 했다.

* https://www.youtube.com/watch?v=U6dmAT8KImY

```js
if (식) 옵셔널 
if (식) 
else 
  
if (c === 1) {
  
} else if (c === 2) {
  
} else if (c === 3) {
  
} else {
  
}

// 위의 코드와 같음.
if (c === 1) {
  
} else { 
  if (c === 2) {
  
  } else { 
    if (c === 3) {

    } else {

    }
  }
}
```

제어문에서는 if와 else문만 있다. 즉, 중문, 단문이 if else의 식으로 들어오는 형태다. 

```js
if (c < 5) {
  
} else switch (c) {
    
}

if (c > 5) {
  
} else for () {}
```

`if / else`가 익숙하면, 위의 코드도 이상할 것이 없다.

```js
if (c === 1) {
  
} else if (c === 2) {
  
} else {
  
}

if (c === 1) {
  
} else {
  if (c === 2) {
  
  } else {

  }
} 
// 위와 같음
```

`else`는 후방 결합을 하게 된다. 그렇기 때문에 그에 대해 이해하지 못하면 버그가 생기게 된다. 이를 방지 하기 위해서는 중괄호로 바꿔서 쓰면 된다. (``else if`를 쓸 필요가 없다.)

if 중첩은 부분적인 집합의 경우에만 써야 된다. 분기가 모두 동등하면, switch를 쓰면 된다. 

```js
if (c === 1) {
  
} else {
  if (c === 2) {
  
  } // else가 없는 경우, 코드를 다 확인 해야 된다. else에 온 이상, else로 끝나야 한다.
} 
```

개발의 지향점은 결국, 수정 해야 할 영역만 수정 하게끔 하는 것이 목적이고, 목표이다. 결국, **코드는 의도를 담아야 한다.**

if문은 결국, 중첩된 구조를 기술하거나 단일 if else문을 이용해서 mandatory optional을 기술 할때 쓰고 병행 조건에 대해서 switch를 쓰는게 당연한데, switch는 병행 조건을 기술함으로써 예외가 발생하거나 나머지가 발생 할 수 있어서, 반드시 default를 써야 된다.

코드가 mandatory로 시작하면 mandatory로 끝나던지? optional이면, optional으로 끝내야 된다. 

코드의 기본은 정리다. ([프로그래밍의 도](https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D%EC%9D%98_%EB%8F%84) 같은 책도 찾아 보니 있었다.)

## for 

```js
for (expression; expression; expression) {
  
}

// '', false, 0, undefined, null, NaN -> falsy
for (var i = 0; truthy; ex) {
  
}
```

for는 정말 특이한 녀석에 속한다. 

for문의 truthy로 평가 되어야 하는 곳에 공문 (비어있는 식)이 오면, 무한 루프로 동작 하게끔 언어 상에서 예외로 두고 있다.

### while

```js
while(thuthy) {
  
}

let a = -1;
while(a > 2) {
  a++;
}

// 가정: 이런식으로 작성 된 코드가 있을 수 있음. 굉장히 어렵다.

while(act.method().c) {
  other.action();
}

let a = act.method().c
while(a) {
  other.action();
  a = act.method().c;
}

```

무조건 while문의 조건식이 while body안에 다시 등장하도록 만들어야 버그가 없다.

```js
let a = act.method().c
while(a) {
  let r = other.action();
  a = act.method().c;
  if (r === 'abc') a = fasle;
}
```

while문 안에 if문으로 무한루프에 빠지지 않게 방어로직을 넣어주는 것도 좋다.

while문은 중문이 오는게 정상이다.

### do-while

```js
do {
  
} while (thuthy);

do a++; while(a); // 정상 문법
```

