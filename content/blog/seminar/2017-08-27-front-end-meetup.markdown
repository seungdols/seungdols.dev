---
layout: post
title: 'GDG Front-End 세미나-React, Vue, Angular'
description: 'Front-End의 기술을 알아보자!'
date: '2017-08-27 16:10'
tags: [programming, front-end, vue, react, angular]
category: 'seminar'
comments: true
draft: false
---

# 프론트엔드 세미나

## #1 이건희 - 다우기술 (목적에 Angular, Vue, React 맞게)

### 프론트 배경과 선택

요즘 프론트는?

- 브라우저 성능이 높아짐
- 프론트엔드에서 비즈니스 로직이 복잡해짐

통합 개발

- 서버
- 프론트

두 가지를 하나의 서버상에서 구현하고 운용함.

분리개발

- 서버 사이드 서버
- 클라이언트 사이드 서버

모놀리틱 vs 마이크로 웹 서비스

#### 프론트선택 요소

1. 클라이언트 / 서버 사이드 렌더링
2. 프레임워크/ 라이브러리
3. 언어
4. 유지보수

#### 클라이언트 사이드

검색엔진이 검색하는데에 제약이 있음

- 고로, SEO에 대한 최적화가 좀 까다롭긴 함.
- SEO에 대한 고려가 필요
- 네트워크 비용이 적다.
- 빠른 인터랙션
- 초기 로딩이 느림.

#### 서버사이드 렌더링

- 빠른 초기 로딩
- SEO 적용이 쉽다.
- 프론트, 백엔드 코드 통일 하기가 쉽다.
- 느린 인터랙션
- 네트워크 비용이 높다.

### 언어

#### JSX

react에서 주력으로 사용함.

#### TypeScript

앵귤러2에서 굉장히 미는 언어. 정적 타이핑 자바스크립트 언어라고 생각하면 된다.

#### ES6

vue.js에서 사용하는데, 사실 vue.js는 순수 자바스크립트를 주로 사용한다.

---

### React

ES5, Es6 문법을 혼용하여 사용할 수 있음.

스타일, 함수, 렌더링 하는 부분이 같이 있음. (팀내의 코드 컨벤션이 필요로 하다.)

- Redux, Flux

* 이벤트가 많은 작업이라면 리액트가 유리하다. ( Event-driven ?)

### VUE

사실 순수한 모듈의 특징을 가지는 듯...

템플릿, 스크립트, 스타일등 영역이 나누어져 있다.

앵귤러처럼 컴포넌트 호출로 묶을 수 있는데, 뷰에서는 하나의 파일안에 스타일, 로직등 모두 한군데에 있는 것이 응집력을 높여준다.

- 타입 체크 가능 -> 앵귤러
- 양방향 바인딩 -> 앵귤러
- 디렉티브 -> 앵귤러
- 코드 구조 -> 앵귤러, 리액트
- 코어와 컴페니언의 분리 -> 리액트
- VIrtual DOM구조 -> 리액트

### AngularJS

템플릿, 스타일이 외부 파일로 정의해서 사용함.

비즈니스로직만 나타낼수 있음.

---

### 백오피스 개발 경험

- 앵귤러가 더 나을 것 같다는 생각
- 타입 체크가 중요하므로, TypeScript 사용

### SNS (판킹, 정치플랫폼)

- 안드로이드, IOS 개발을 동시에 해야함.
- 이벤트 동작이 주요 기능
- React Native , React가 서비스 성격에 맞았음.

## #2 엔터프라이즈 프로젝트와 리액트 (김훈민, 네이버 스마트에디터)

참여하신분들이 리액트를 깊이 아시는 분도 아니고, 싫어하시는 분도 있으실것 같아서 편하게 이야기 할 예정.\

React + Flux -> React + Redux -> React + Mobx

스마트 에디터 3.0이 오픈 되었고, 현재는 기본형 모드를 완전히 뜯어 고치고 있는 중이다.

### 에디터 개발 초기

초기에는 JQeury + Underscore로 개발했다.

요구사항은 복잡하고, 변경도 잦은……..서비스

- 수동 의존성 관리
- 수동 데이터 동기화
- 설계 일관성 부족
- 테스트 커버리지 부족

### 에디터 - 카드형 개발

결론적으로 뭔가 대안이 없었고, 그 당시에는 리액트 밖에 없었다. (카드형 개발)

React + Flux 를 이용해 개발 하게 되었다.

뭔가 좋긴 좋음?

- 비교적 낮은 학습 비용
- UI 상태 동기화
- 애플리케이션 구조화 문제 해결

다른 문제가 생김

- 난잡해진 컴포넌트
- Jquery와 불편한 동거
- 예측하기 힘든 데이터 흐름
- 뚱뚱한 스토어

마크업 개발자와 개발자간의 프로퍼티명의 통일화가 안됨. 용어가 다름.

점점 컴포넌트 계층이 복잡해지고 깊어지기 시작함.

### 모바일 에디터 개발

개발 프로세스를 다지자.

- 스터디
- 설계 논의
- 코드 리뷰
- 단위 테스트 작성도 빡세게

스토어가 너무 비대해지니 Redux로 개발하는게 더 좋을것 같다!

Redux를 바라보는 2가지의 시선이 존재함.

단순한 동작도 4가지의 코드를 작성해주어야 하는 문제가 생김.

비동기 처리 하기가 좀 어렵드라.

그래서 Redux-thunk를 쉽고 단순하더라.

그런데 막쓰기가 쉽다. 이것은 문제가 된다. 그리고 테스트가 어려워진다.

### 리팩토링 시작

플랫폼화를 해보자!

그렇다면, 플러그인 형태로 레이어를 다 찢어서 개발하고 하나의 코어에서 플러그인을 조합하는 에디터로 만들자!

문제는 플러그인끼리 상태가 엮이는 케이스가 있을때 어떻게 해결을 할까?

플러그인을 리액티브하게 바인딩 할 수 있을까?

-> MobX를 채택하게 됨.

또 공부하는 시기가 필요로하고, 노하우를 쌓아야 하는 문제가 있다.

상태가 변경하면, 렌더링이 다시 한다. 바인딩하는 단위가 Redux보다 작은 사이즈다. (이 것을 몰랐음)

결론으로는 마냥 쓰기에는 어렵다.

### React에 대한 몇 가지 생각 정리

1. 한 가지를 잘한다는 그것밖에 못한다의 다른말.
   1. 리액트만 가지고 뭘 만들 수 있는가?
   2. 실무에서는 뷰만 가지고는 할 수 있는 영향이 적다.
   3. 비용이 발생함. (스터디, 프로토타이핑 등)
   4. 도구들이 흥함
      1. create-react-app - 공식 CLI 도구
      2. next.js - 서버 사이드 렌더링 프레임워크
      3. 추상화의 함정
2. 가져다 쓴다? 참여한다!
   1. 홍익인간들의 참 세상 (우왕굳)
   2. why-did-you-update
3. 장점과 단점은 동전의 앞과 뒤
   1. 완전 귀찮은 부모-자식 관계에 대한 프로그래밍이 필요.
   2. redux는 4단계의 코딩이 필요
   3. 단방향 데이터 플로우의 제약
   4. 끊임없는 코드 정리 (Redux의 철학)
4. 기술과 개발자 사이의 경계
   1. 문제에 대한 팀내에 공유 되어야함.
   2. 기술에 대한 이해도는 비슷하게 유지해야 하는 작업이 필요.
   3. 어떤 기술을 선택하는 문제는 실은 개발 전체에서 보면 아주 작은 일부에 불과함.
5. React Way를 이해하되, 기술에 기대지 말것.

---

## #3 Angular 기본 개념 잡기 (한장현)

Angular는 angularJS와 다르다.

- Angular 2.0 -> Angular
- Angular 1.0 -> AngularJS

명칭부터 이름이 다르다.

- TypeScript를 도입하면서 프레임워크 이름을 변경 했다.
- 철학도 비슷, 개발 방법도 비슷

* 버전 정책은 Semver

- 숫자는 무관함. (이미 5.0)

종합 프레임워크

- 전체를 아우르는 구조
- 뷰, 데이터, 풀, 폼, HTTP, 애니메이션, 서버 사이드 렌더링, CLI, 테스트

### SPA를 만든다.

페이지 내부에서 라우터로 뷰를 전환

- 전통적인 HTML 페이지 전환 방식과는 다름.

해당 주소 일 때 동작하는 컴포넌트를 등록

- 딥링크도 사용가능.

### TypeScript

- Javascript의 상위 집합

* 정적 타입, 제네릭, 인터페이스, TSLint

- @Annotaion === function

개발 생산성에는 정적 타입이 생겨나므로 좋은 것은 아니다.

- 유지보수 측면에서는 좋다.

### 컴포넌트 기반

- 추상화된 DOM 엘리먼트
  - 템플릿 + 클래스 코드
  - DOM에 직접 접근 하는 것은 지양함
- 어노테이션을 Angular 컴포넌트 등록
  - 객체 생성, 주입은 Angular에서 관리
  - LifeCycle 관리

### 데이터 바인딩 지원

- 성능 향상을 위해 단방향이 기본
- 양방향 바인딩도 지원

* 프로퍼티 바인딩
  - 어트리뷰트 바인딩
* 이벤트 바인딩
* 양방향 바인딩

### 옵저버블

Callback chain - Promise chain - Async chain - Observable chain

RxJS 내장

- 기본 패키지에 포함

데이터 스트림에 사용

- 키보드 입력 이벤트, 서비스 상태 전달에 적합
- HTTP는 좀 아님.
- WebSocket에 적합함

### 서비스를 의존성으로 주입한다.

DI의 개념

- 생각보다 어렵진 않다.
- 쉽게 생각하면 내가 주입 하는게 아니라 어떤놈이 대신 해준다.
- (나는 What을 정의해주면 How는 알아서 해줌)

컴포넌트를 연결

- 전역 데이터 풀로 활용

의존성 주입기가 인스턴스를 생성하고 주입

- 생성 방법을 등록하고 사용하면 됨
- 인스턴스 생성 방법은 알 필요 없음.
- 컴포넌트처럼 의존성 구성 가능
- 더미 객체를 사용하는 테스트 코드에서 유리함. (왜냐면 Mocking 하기가 유리해짐)

### 모듈화 지원

ES6 모듈의 연장, 대체는 아님

- export, import 사용
- import로 불러오고 @NgModule에 등록

### CLI지원

- 프로젝트 기본 생성
- 구성 요소 추가
- 서버 실행
- TSLint
- Test
- Build
- Deploy

### 최신 트렌드를 반영

- 웹 컴포넌트
- PWA
- 크로스 플랫폼
- 리액티브
- 서버 사이드 렌더링
- 머티리얼 디자인
- CLI
- Augury

### 지금 공부해야 할 것

- TypeScript
- Angualr framework
- Architect besed on Component
- Reactive Programming

### 앞으로 공부 해야 할 것

- Webpack Optimization
- Server side Rendering & SEO
- Meterial & Animation

---

## 원모먼트 vue.js 적용하기 (원모먼트 - 김우현)

원모먼트 - 온라인 당일 꽃배달 서비스

### vue.js

장점

- 단일 컴포넌트
- template + script + style
- 한국어 문서 지원
- 친절한 커뮤니티

사용하기

1. 직접 script에 추가
2. npm
3. CLI
   - scaffolding 지원 (멋진데?👍)

### 레거시

- 메인 페이지
  - SQL 문제
- 결제 오류
  - order sheets > PG > Status change : 정상 결제
  - PG > Order sheets > Status Change : 비정상 결제

결제가 되었는데, 관리지 페이지에 정보가 안됨 -> 크리티컬 이슈

#### 해결

1. 백엔드는 Restful API
2. vue.js를 도입

### 오픈 소스 만들기 - 경험 공유

[GITHUB - vue-lunar-calender](https://github.com/KimWooHyun/vue-lunar-calendar)

1. 음력 달력이 필요해
   - 중국 개발자가 만든 것 밖에 없더라.
2. webpack을 이용함
   - yarn을 사용함

- awsome-vue관련 프로젝트에 소개 merge.
- 이탈리아어에 대한 PR이 날라옴
