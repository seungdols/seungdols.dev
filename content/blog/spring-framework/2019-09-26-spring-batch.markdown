---
layout: post
title: '우아한 형제들 9월 세미나 - 우아한 스프링 배치'
description: '우아한 스프링 배치'
date: 2019-09-26 19:30:00
category: spring-framework
tags: [spring-batch, programming]
comments: true
draft: false
---

## 기본편

### 배치 애플리케이션 ?

- 배치 애플리케이션은 도대체 무엇인지? 질문을 많이 받는다.

  - 위키 페이지 용어 설명을 참고 해보면, 배치 애플리케이션은 결국 사용자와 상호 작용하는 애플리케이션이 아니다. **결국, 요청이 한 번 이루어지고, 모든 처리가 배치 애플리케이션에서 처리 되고 끝난다.**

- 일반적인 웹과 무슨 차이가 있는가?

  - 후속처리가 주로 이루어지고, 절대적인 속도로 이루어진다.
  - `QA`가 어렵다.
  - 테스트 코드를 무조건 작성 해야 한다.

#### Spring batch vs Quartz

- `Quartz`는 스케쥴링 프레임워크이다.
- `Spring Batch`는 `Batch` 프레임워크이다.

> 당연히 둘의 차이가 있다. 비교 대상 하는 것 자체가 다른 역할을 하는 프레임워크이기에 어렵다.

#### 배치가 필요한 상황

- **일정 주기**로 실행 되어야 하고, 실시간 처리가 어려운 **대량의 데이터**를 처리 할 때
- 대용량의 데이터 처리가 절대적인 요구사항

#### 메모리에 올려서 ?

- Paging 혹은 Cursor로 `pagesize`만큼 읽어오고, `chunkSize`만큼 `commit`한다.

#### Job / Step / Tasklet

- Job > Step > Tasklet > Chunk
- wrtier/reader가 따로 움직이는 개념은 아니고, `ChunkOrientedTasklet`의 위주로 움직인다.

#### @JobScope / @JobParameter

- step에서는 **@JobScope**를 줘야 JobParameter를 받을 수 있다.
- tasklet에서는 **@StepScope**를 줘야 한다.
- `Enum/Date(LocalDate)/LocalDateTime`와 같은 경우는 형변환(String)을 해주어야 한다.
- 이러한 제약을 해결하기 위해 `JobParameter` 순수 클래스를 만들어주고, `@Value`로 넣어줄 수 있도록 `@Bean`으로 만들어주고 해당 값을 실제 스텝에서 호출해서 사용하기만 함.
- `@JobScope, @StepScope`는 **Lazy loading**(Late Binding으로 설명해주심)이다.
  > Lazy Loading으로 쓴 이유는 결국 해당 스코프가 늦게 로딩 되는 걸로 이해하면 편할듯..

## 활용편

### 관리 도구

- Cron
- Spring MVC + API Call
- Spring Batch Admin (Deprecated)
- Quartz + Admin
- CI Tools(Jenkins/Teamcity etc)
- Spring Cloud Data Flow

여러가지 중에서 어느 정도 인지도도 있고, 노하우를 쉽게 얻을 수 있는 **Jenkins**를 선택 한다.
(혹은 Spring Cloud Data Flow를 쓰는 방식이 좋을 수 있다.)

#### Jenkins 공통 설정 관리

- GC 설정
- 어플리케이션 이름
- 어플리케이션 Profile

위 정보들이 배치마다 설정을 입력 해주어야 한다.

`Environment variables`를 설정 할 수 있기에 해당 정보를 입력을 해주면, 모든 Job에서 사용할 수 있다.

#### 무중단 배포

- AWS를 쓴다면, 테스트 및 빌드 후 `S3`에 업로드 한 뒤에, `CodeDeploy`로 요청을 넣어서, 스프링 배치를 배포 하게 된다.
  - 혹은 `CodeDeploy`를 안쓰면, SCP를 활용한다.
- `readlink`를 활용하여, `app.jar -> v1.jar / v2.jar`을 보도록 한다. (배치에서는 실제 v1.jar를 보고 Batch job을 실행한다.)
- 이미 돌던 `Batch job`은 `v1.jar`에서 수행을 하고, 원본 파일이 새로 배포 되면, 새로운 `Batch Job`은 `v2.jar`에서 새로운 Job이 실행 된다.
- `Jenkins Environment variables`에서 설정을 하되 실행을 하는 `$()`는 변수로 뺄 수 없다.

#### 파이프 라인

- 순차적으로 연결 되어 `Batch Job`이 실행 되어야 하는 경우
- 테스트 - 빌드 - 개발 서버 배포 - 스테이지 배포 - 운영 배포를 각 각 분리 되어 있는데, 순차적으로 실행 하거나 병렬로 실행하여 자동화 하고 싶은 경우
- 여러 작업이 순차적으로 실행 되어야 하는 경우 `Step`으로 쪼개지 말고, 각 각 분리 시킨다.
  - 스텝으로 쪼개고, 순차적으로 실행 되어야 한다면, 파이프 라인으로 연결 지으면 된다.

#### 멱등성

- `new Scanner / LocalDate.noe()`와 같은 경우 멱등성이 깨진다.

  - 어제 실행 하거나 오늘 실행 하거나 주어진 파라미터가 같으면, 멱등성을 지켜야 한다.
  - 변경 가능한 값인 경우는 모두 `JobParameter`로 올려서 해당 배치를 실행할 시점의 값으로 실행 할 수 있도록 한다.

그럼 어떻게 오늘 일자를 `yyyy-MM-dd`형식으로 배치 실행에 파라미터로 넣어 줄 수 있을까? 고민

- 그래서 `Plugin(Date Parameter)`을 만듬.

### 테스트 코드

- `@ConditionalOnProperty`를 활용 한다.
- `@TestPropertySource`를 활용하면, Jenkins처럼 테스트를 돌릴 수 있다.
- 테스트 코드가 1200개인데, 그 중 370개가 정산 시스템 테스트 그런데, 배치 테스트 속도가 너무 느리다.
- 원인은 `@ConditionalOnProperty`가 범인인데, 스프링은 전체 테스트가 수행 될 때마다, Environment가 변화 하면, `Spring Context`를 재시작 한다.

#### Environment변화 하는 이유

- `@MockBean`, `@SpyBean` 사용
- `@TestPropertySource`로 환경변수 변경할 때
- `@ConditionalOnProperty`로 테스트 마다 Config가 다를때

#### `@ConditionalOnProperty`, `@TestPropertySource`를 제거 하자.

- 모든 Config를 Loading 한 뒤, 원하는 배치 Job Bean을 실행 한다.
- `genBean()`으로 Job name으로 조회 한 뒤에, 테스트 대상에 포함 시킨다.
- 위와 같은 작업을 할 수 있는 `JobTestUtils`로 미리 `launcher`를 만들어 둔 뒤에, Job Test 코드에서 해당 유틸에 Job 이름을 넣어주고 테스트를 실행 한다.

### JPA & Spring Batch

#### JPA N+1

- `@oneToMany`관계에서 하위 엔티티들을 Lazy Loading으로 가져 오면, 조회 쿼리가 계속 발생
  - `Join Fetch` 사용하되 일시적인 해결 (하위 엔티티 2개 종류 이상에서 걸게 되면, Exception 발생)
    - `default_batch_fetch_size`로 해결 (하이버네이트 설정)
    - 위 옵션은 `JpaPagingItemReader`에서는 작동 하지 않고, `HibernateCursorItemReader`에서는 가능하다.
    - `JpaRepository`에서도 사용할 수 있는 기능이다.
    - 현재는 `PR`이 리뷰 대기 상태라고 한다.

#### JPA Persist Writer

- entityManager.merge에서 처음 데이터가 저장 될 때도, `update` 쿼리가 항상 실행 됨.
  - 그래서 `persist`만 하는 JpaItemWrite를 똑같이 만들어서 쓰는데, 4.2에서 릴리즈 되면 수정된 버전이 나온다.

## 추가 정보

- The Definitive Guide to Spring Batch 출간
- 2020년 상반기 정상혁님, 이동욱님 공동저서 출간 예정
