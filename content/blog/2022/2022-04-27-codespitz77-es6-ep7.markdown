---
layout: post
title: '코드스피츠 77 - ES6+ 기초편 6회차  (Generator, Promise, Async/Await)'
description: 'ES6와 generator'
date: 2022-04-27 23:59:00
category: javascript
tags: [javascript, programming]
comments: true
---

## Generator
```js
const infinity = (function*() {
	let i = 0;
	while(true) yield i++;
})

console.log(infinity.next())
```

yield를 이용하면 블록을 중간에 끊어주는 효과가 발생 => JS에서는 하나의 문들을 Record로 만들어 주고, 해당 레코드를 실행 할지 말지를 결정 하게 됨. 

suspension, generator, command pattern등 여러 가지 개념들이 설명 되어 나오는데, 각각을 잘 이해하는게 중요하다. 

## gererator + async + executor
generator => 흐름을 멈춰준다. 

```js
const profile = function*(end, next, r) {
	const userid = yield $.post('member.php', {r}, next);
	let added = yield $.post('detail.php', {userid}, next);
	added = added.split(",");
	end({userid, nick: added[0], thumb:added[1]});
};

const executor = (end, gene, ...arg) => {
	const next = v => iter.next(v);
	const iter = gene(end, next, ...arg);
	iter.next();
};

executor(console.log, profile, 123);
```

위 코드 이해하는 것... 어렵.. 

`executor()` 함수가 호출 될 경우 -> next가 선언 되고, 해당 iter에서 실행 되면, profile 제너레이터의 첫번째에서 흐름이 중단 됨. 

그게 바로 `const userid = yield $.post('member.php', {r}, next);` 이 부분이다. 

그리고, `const next = v=> iter.next(v);` 이 코드에서 member.php 비동기 호출에서 응답 값인 id가 const userid = 값으로 전달 되고, 멈춰졌던 흐름이 다음 라인으로 이동 됨.

즉, executor 함수를 분리 해놓음으로써 profile 함수만 관리하면 됨.. 이와 유사하게 ko library라는게 있다고 한다. 

위와 같은 방식을 generator의 coroutine pattern이라고 부른다고 함. 

## passive async controll

콜백을 보낼 수는 있지만, 언제 올지는 모른다. 

```js
$.post(url, data, e => {
	// ? 언제 오는가?
})
```

```js
let result; 
$.post(url1, data1, v => {
	 result = v; 
})

$.post(url2, data2, v => {
	result.nick = v.nick
	report(result)
})

```

## active async controll

promise는 then을 호출해야 결과를 얻는다. 

```js
let result;
const promise = new Promise(r => $.post(url1, data1, r))
promise.then(v => {
	result = v;
})

const promise1 = new Promise(r=>$.post(url1, data1, r));
const promise2 = new Promise(r=>$.post(url2, data2, r));
promise1.then(result => {
	promise2.then(v=> {
	result.nick = v.nick;
	report(result);
	});
});
```


### generator + promise
```js
const profile = function*(end, r) {
	const userid = yield new Promise(res => $.post('member.php', {r}, res));
	let added = yield new Promise(res => $.post('detail.php', {userid}, res));
	added = added.split(",");
	end({userid, nick: added[0], thumb:added[1]});
};

const executor = (end, gene, ...arg) => {
	const iter = gene(end, ...arg);
	const next = ({value, done}) => {
		if (!done) value.then(v=> next(iter.next(v)));
	}
	next(iter.next());
};

executor(console.log, profile, 123);
```

## async / await 

C#에서 JS로 넘어온 패러다임 

```js
const profile = async function(end, r) {
	const userid = await new Promise(res => $.post('member.php', {r}, res));
	let added = await new Promise(res => $.post('detail.php', {userid}, res));
	added = added.split(",");
	end({userid, nick: added[0], thumb:added[1]});
};

profile(console.log, 123);
```

결국에 코드를 보면, 위에서 generator + promise 방식이나 async/await 방식이나 같다. 다만, 단점은 위 코드는 async에서만 yield가 된다. 응? 즉, 비동기일때만 위 코드에서 흐름이 suspension이 된다는 말이고, 동기인 경우 이를테면, while문에서는 안됨... 

그럼 사실 generator + promise 방식의 코드가 더 낫다. 동기 비동기 모두 yield가 가능하다. 그런데, es8에서부터 async generator가 생겼다. 

ref. https://ko.javascript.info/async-iterators-generators#ref-1893

위 페이지 끝장나게 번역 잘되어 있다. 
