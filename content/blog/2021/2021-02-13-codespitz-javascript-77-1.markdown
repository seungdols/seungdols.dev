---
layout: post
title: "코드스피츠 77 - ES6+ 1회"
description: "자바스크립트를 깊이 배워보자."
date: 2021-02-13 21:06:00
category: javascript
tags: [javascript, programming]
comments: true
---

* 어떤 언어나 프레임워크와 같이 떠내려가지 않게 근본에 대해 공부해야 한다. 

프로그램에도 합리주의, 상대주의 철학이 내포되어 있다. 켄트 벡이 말한 프로그램을 작성하는데 3가지를 내포하고 있어야 한다. 

1. 가치
   1. 의사소통
   2. 단순함
   3. 유연함
2. 원칙
   1. 지역화
   2. 중복제거
   3. 대칭성
3. 패턴
   1. 개발론
   2. 설계론
   3. 각종 적용 패턴
4. 동기
   1. 돈
   2. 시간

위에 대해서 켄트벡의 구현 패턴에서 설명하고 있다. 

**프로그램을 짰을때, 왜 이렇게 했는지? 설명할 수 있어야 한다.**

프로그램이 뭔데? 컴퓨터가 뭔데?를 물어보면 그 사람의 기본 지식을 알 수 있다.



## Program & Timing

1. Language code - Lint Time
2. Machine language - Compile Time
3. File
4. Load 
   1. 파일이 컴퓨터 메모리에 적재
   2. 메모리에 적재 된 것만 프로그램
   3. 프로그래머의 영역의 마지막
5. Run - Run Time
6. Terminate

---

Run Time 에러는 기본적으로 잡기 어렵다. 

* 계속 발생하면, 프로그램을 싹 다 바꿔야함.
* 기본적으로 잘못 만들어서 발생함.

Context Error도 있음. 

* 커뮤니케이션이 안되어서 그럴 수도 있음.
* 개발자끼리 코드 스타일이 달라서 이해를 못해서 발생.

## Script Program

1. Language Code
2. File
3. Load
4. Machine Language
5. Run
6. Terminate

## Run Time

Memory (Program)

* 명령 
* 값 

CPU (Consumer)

* 외부버스
* 제어유닛
* 연산유닛
* 데이터유닛

처리 순서 

* Loading
* Instruction Fetch & Decoding
* Execution

실제 시나리오 (Complie Language)

* Essential Definition Loading

* VTable(Virtual Memory Table) Mapping 

* Run

* Runtime Definition Loading
* Run



Run (Static Time)

- Declare Base function, class ... 

---

(Run Time)

* Delare extended function, class ...

(Static Time)

----

(Run Time)

* Use function, class

프로그램 하나에도 각 레이어별로 상대적인 관계가 이루어진다. 



## Memory, Address, Pointer, Variables, Dispatch



### Memory

* 고유한 번호를 주소로 갖는 주소체계를 갖고 있다.

ex) 

* A = "TEST", &A= 11

* B = &A *B = "TEST"

참조의 참조일때 직접 참조를 쓰면 문제가 생긴다. 

* 함수형 패러다임은 참조를 사용 안함. 값만 사용.

* 객체지향 패러다임은 직접 참조 하는 것을 안함. 

Double Dispatch

* 두번의 참조를 거치고 나서 값을 얻는 경우를 말함.

## Lexical Grammar 

* Control Character
* White Space
* Line Terminators
* Comments
* Keyword
* Literals



## Language Element

* Statements 

  * (실행기가 어떻게 실행 할지에 대한 방법을 제공)

  * 공문

    * `for (let i = 0; i < 10; i++);`
    * `;;;;;;`

  * 식문

  * 제어문

  * 선언문

    * 메모리상에 변수 할당

  * 단문

    * `if(true);`

  * 중문

    * `if(true){;;}`

    * ```js
      var a,b 
      if (true) { a = 3; b = 5 }
      ```

    * ```js
      if (true) a = 3; else b = 5
      if (true) a = 3; else if (a > 2) b=3; else b=5;
      if (true) a = 3; else { if (a > 2) b=3; else b=5; }
      ```

* Expression

  * 값식
    * `3;5;6;`
    * `if(true)3`
  * 연산식
  * **호출식**
    * JS는 return이 없는 함수를 호출해도 return이 있다.

* Identifier

  * 기본형/참조형
    * 변수
    * 상수

변수란, "메모리 주소의 별명이다"라고 말 할 수 있다. 그리고 총 3가지의 정보를 담고 있다. 

* 메모리 주소 위치
* 어떤 타입인지?
* 어디까지 크기를 갖는지? 알고 있음.

이 정보들을 VTable에 넣어 놓는다.

## Sync Flow

* 폰 노이만 머신은 CPU에서 명령어가 끝날 때까지 중단이나 개입이 불가능함. 

## Flow Control

* 흐름 제어를 할 수 있도록 해주는 역할

### Sub Flow

* 공통된 부분을 뽑아서 흐름을 바꿈
  * ex) 함수, 클래스를 이용한다.
