---
layout: post
title: '서초루비 10월 밋업'
description: '서초루비 10월 세미나 - Elixir, Ruby 2.6'
date: 2019-10-10 20:00:00
category: seminar
tags: [meetup, ruby, elixir, programming]
comments: true
draft: false
---

## Why What Elixir - JSON ?

엘릭서 창시자가 얼랭을 보고 개념은 좋아 했지만, 문법이 마음에 들지 않았다.
`Erlang + Ruby = Elixir`가 되었다.

대다수 개발자들이 `Rails`를 쓰다가 요즘은 `Elixir`를 쓰게 되었다.

### Phoenix Framework

- 사용하기 편하지만, 속도, 유지보수성에서 좋다.
- 슬랙, 핀터레스트, 디스코드등등 회사에서 사용 한다.
- 금일 오픈한 달빛 조각사 게임이 엘릭서로 개발 되었다.

### Elixir

- Concurrency
  - Actor model (erlang으로 부터 기원됨)
  - No mutable data
  - No Lock
  - No Blocking
- Efficiency
  - pinterest 30대의 Java -> 15대의 Elixir
  - paperduty -> rails -> phoenix framework로 변경하는데, 1주일정도 소요됨.
- Scalability
- Reliability

- `Functional / Concurrency / Fault Tolerance / Metaprogramming`의 언어이다.
- 엘릭서의 메타프로그래밍 방식이 루비보다 훨씬 좋다.
- 메타 정보를 엘릭서 언어로 만들기 때문에 엘릭서 자체에서 사용이 가능하다. (클로저의 매크로랑 비슷한 것 같다.)

- 엘릭서 현재 버전이 1.9인데, 이미 세부적인 모든 기능 개발은 거의 끝났다. (이미 얼랭에 필요한 기능을 거의 문법을 바꾼 느낌??? 문법적인 포팅한 수준으로 이해하면 될듯..?)

### syntax

- pattern matching
- module
- namespace
- railway oriented programming
- tuple
- pipe operator

- [elixir school](https://elixirschool.com/ko/)
- [phoenix](https://phoenixframework.org/)

### 기타

- `document`가 정말 잘 되어 있다.
- 커뮤니티가 좀 작긴 해서, 필요한 모듈들이 모두 있는가?에 대해서는 좀 ... 부족한 느낌
- `ecto`라는 데이터를 처리 하는 툴이 있는데, `ORM`은 아니지만, `ORM`처럼 데이터를 처리 하는 툴이 있다.
  - https://hexdocs.pm/ecto/Ecto.html
  - 해커톤을 했는데, 16살 된 개발자가 만들어냈다고 한다.

## 서비스 중단 없이 루비 버전 2.6 업그레이드 하기 - 정창훈

### History

2017년 - 루비 2.2 -> 2.3

2019년 - 루비 2.3 -> 2.6

### 왜 업데이트를 해야 하는가?

- Capistrano 배포가 점점 잘 안됨.
- Ruby 버전 업도 너무 어려움.
- 잘 안되니까 하기 싫어짐

### Docker 도입

- 1대만 배포해서 테스트 하기 쉬움. (그 전은 어려웠....)
- 1대만 적용해보고, 장애나면, 빼면 되니까....

### Change log를 체크

- 2.4
- 2.5
- 2.6

각 버전에 별거 없어서 .... 업데이트 해보자.

### bundle update

- 하는 순간 버전 업데이트 폭망의 지름길

### bundle update rails --conservative

- 최소한의 업데이트를 하도록 설정

### 테스트

- 진정한 테스트는 프로덕션에서 .....
  - (이 말은 진리이다.)
- 개발 서버에서 해봤자 다 잡히지 않는다.
- 이전 대비 CPU 10%의 절감을 보게 되었다.

### rails error 정보에 stack trace가 안됨.

- `binding_of_caller version`도 `rails`와 같이 올려주어야 한다.

### rails 4.x -> 5.x 버전 업 도전

- `Bigquery gem`이 반환하는 데이터 형식이 바뀜.
- `Rails 5.2`에서 암호화 알고리즘 변경
- `Rails 4`부터 쿠키도 암호화...
- `Sidekiq` 설정 하는 위치 변경
- 레일즈 5.2에서는 사이드 킥 없이 웹 서버 하나로 액티브잡 처리가 된다.
- `Rails 6`에서 멀티 데이터 베이스 지원 ....

### 기타

- 채팅 기능 같은걸 굳이 레일즈에서 개발 해야 하나?
  - 그래서 고랭으로 새로 개발.
- 새로운 기능이나 사업은 새로운 레일즈 프로젝트로 생성...
- `MSA`를 위한게 아니라, 어쩔 수 없이 쪼개어 만들게 되어 가는 것 같다.

### 질문

- 전체 배포 얼마나 걸리는지?
  - 지금은 8분 정도 소요
- 다른 젬 업데이트 했던 경험이 있는지?
  - 따로 특수하게 꼭 필요 했던 젬 업데이트는 없었다.
