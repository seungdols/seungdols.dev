---
layout: post
title: 'BFF가 뭘까?'
description: '나도 모르는데, 설명하는 BFF의 세계'
date: 2020-09-09 22:00:00
category: architecture
tags: [bff, architecture, pattern]
comments: true
draft: false
---

> 본문 내의 이미지는 모두 참고 출처의 이미지를 사용하였습니다.

`Backend for Front-end`의 약자로, 일종의 아키텍처 패턴입니다.

환경적, 시스템적인 `Monolithic` 구조를 쓰다 이제는 `SPA`, `MSA` 시대에 도래 했다.

**Back-End와 Front-End의 통합된 단일 구조**를 쓰다가, 이제는 두 영역이 분리 되어 서버가 각각 올라가기도 하고, 분리의 시대가 되었다.

통합된 API를 쓰다가 영역별로 쪼개어진 API를 사용 하는 시대가 되었기도 하다. 결국 통합에서 분리의 미학으로 관심사가 이동되었다.

다수의 페이지를 보던 환경에서 단일 페이지내에서 다중 컨텐츠의 영역으로 바뀌었다. (이는 아무래도 모바일의 영향이 아닐까 한다.)

![https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-monolith-1.png](https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-monolith-1.png)

![https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/consumer-apps-2.png](https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/consumer-apps-2.png)

위와 같은 구조를 쓰다보니 문제가 생겼는데, **API를 어떻게 관리 해야 할지 애매한 부분이 생겼다. 각 End-point에서 사용하는 API를 관리하기가 어려워졌다.**

![https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-next.png](https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-next.png)

위와 같은 구조를 또 만들게 되었다. **그런데, 웹만 있는게 아니고 다른 기기도 있다.** **쉽게 말해 EndPoint가 다양하다.**

![https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-next-and-mobile.png](https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-next-and-mobile.png)

위처럼 하다보니 생각보다 통합한 API를 쓰는게 불편한 문제가 발생한다. API 배포가 중요해진다. **Public API 영역이 단일 장애 포인트가 된다.** 위와 같은 경우를 `API Gateway`라고도 부르기도 한다.

![https://tsh.io/wp-content/uploads/2019/09/api-gateway-design-pattern.png](https://tsh.io/wp-content/uploads/2019/09/api-gateway-design-pattern.png)

![https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-bff-1.png](https://philcalcado.com/img/2015-09-back-end-for-front-end-pattern/sc-bff-1.png)

그리하여 각각의 End-point를 위한 Backend가 중간 매개 서버로 등장하게 되었다.

참고 문서를 보면 여러가지 다양한 용어와 구조가 나오는데, **사실 용어 차이이기도 하고, 어떤 구조가 정답이라고는 애매하다.**

![https://akfpartners.com//uploads/blog/BFF_-_Fanout.jpg](https://akfpartners.com//uploads/blog/BFF_-_Fanout.jpg)

![https://akfpartners.com//uploads/blog/BFF_Fuse.jpg](https://akfpartners.com//uploads/blog/BFF_Fuse.jpg)

![https://akfpartners.com//uploads/blog/BFF_Fan_Out_Solution.jpg](https://akfpartners.com//uploads/blog/BFF_Fan_Out_Solution.jpg)

사실 환경에 맞는 시스템 구조를 만들어가는 게 중요하지, 그림이 중요한게 아니다.

위의 그림도 정답이라고는 할 수 없다. 어떠한 아키텍처든지 자신의 서비스, 환경에 따라 이렇게도 저렇게도 하는것이지 **사실, BFF패턴의 주요 관심사는 EndPoint를 위한 중간 서버 혹은 시스템의 개념으로 이해하면 좋겠다.**

ref.

- [https://philcalcado.com/2015/09/18/the_back_end_for_front_end_pattern_bff.html](https://philcalcado.com/2015/09/18/the_back_end_for_front_end_pattern_bff.html)
- [https://akfpartners.com/growth-blog/backend-for-frontend](https://akfpartners.com/growth-blog/backend-for-frontend)
- [https://tsh.io/blog/design-patterns-in-microservices-api-gateway-bff-and-more/](https://tsh.io/blog/design-patterns-in-microservices-api-gateway-bff-and-more/)
