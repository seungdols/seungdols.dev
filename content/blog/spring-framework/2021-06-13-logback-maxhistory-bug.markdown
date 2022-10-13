---
layout: post
title: 'Logback maxHistory가 동작을 안한다?'
description: 'logback과 친해지기'
date: 2021-06-13 22:00:00
category: spring-framework
tags: [spring, programming]
comments: true
draft: false
---

## Logback maxHistory bug

logback의 rolling 정책중 하나인 `SizeAndTimeBasedRollingPolicy` 를 사용하는데, `maxHistory`가 동작을 하지 않는 이슈가 있는데, 이게 `1.2.3`버전에 있는 버그였다.

https://stackoverflow.com/questions/47752955/logback-sizeandtimebasedrollingpolicy-applies-totalsizecap-to-each-day-in-maxhi

https://jira.qos.ch/browse/LOGBACK-1361

그런데, 아직 1.3.0이 릴리즈가 되진 않았다. (https://mvnrepository.com/artifact/ch.qos.logback/logback-classic) 계속 alpha버전만 업데이트가 되고 있다.

`spring-boot-starter-web` 모듈은 기본적으로 `spring-boot-starter-logging` 을 참조하는데, 이 모듈에서 `logback`을 release버전을 참조 하고 있다.

조치 방법은 아래와 같다.

1. `spring-boot`에서 `spring-boot-stater-logging` 의존성을 제거 후 `logback-alpha5` 를 사용하는 방법
2. log4j2로 교체
   - https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-log4j2
3. cron으로 스크립트를 돌려서 로그를 정리 해주는 방법
   - docker환경인 경우 tinycron으로 스크립트를 동작 시키는 방법이 있다.
