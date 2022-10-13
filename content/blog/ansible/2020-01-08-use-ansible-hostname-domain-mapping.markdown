---
layout: post
title: 'hostname과 nginx server domain mapping 삽질(찬조출연: ansible)'
description: 'ansible 짠내팁 - hostname과 nginx server domain mapping 삽질'
date: 2020-01-08 22:45:00
category: ansible
tags: [ansible, programming]
comments: true
draft: false
---

### 왜 이런 삽질을 시도 했나?

회사에서 개발 서버들은 모두 VM(Virtual Machine)을 사용하고 있다.

그런데, 이것도 사실 비용이기 때문에, 여러 개발 서버를 모두 띄우기 쉽지 않다. (물론, 요즘은 도커를 이용하는 방법이 있다.) 다만, 배보다 배꼽이 더 큰 환경 설정이 필요로 하다.

그럴때는 그냥 가상 머신이 제일 간편한데, 보통은 서버수는 적게 받아 가상 호스트를 이용해 개발 서버를 여러대인 것 처럼 사용한다.

대다수의 서버들을 환경 설정 자동화를 하곤 했는데, 서버가 몇 없는 개발 서버만 유독 수작업을 해줘야 했다. (사실 찾아보기 귀찮았다.)

그래서 가상 호스트 도메인과 호스트 네임을 이용해 `nginx server`의 `server_name`을 설정 하는 방법을 찾았다.

(예전에는 왜 이런 단순한 방법을 생각 못했는지 모르겠지만, 점점 `ansible`의 야매기술이 늘어난다.)

`ansible`에서 `template`으로 처리하기가 어려운데, `jinja2`의 문법을 통해 얼추 하드 코딩하여 처리 했다.

`nginx.conf.j2` 파일을 다 보여줄 순 없지만, 아래 처럼 도메인을 셋팅 했다. (하나의 도메인을 고정 시켰다.)

#### nginx.conf.j2 (기존)

```text
server_name  dev5.seungdols.com;
```

만약에, 다른 서버의 경우 서버 네임을 바꿔주어야 했는데, 해당 서버 이름은 직접 접속해서 수정 해주고, `nginx` 재시작 하곤 했다.

물론, `ansible server`에서 일반 `ansible -m command -a`를 이용해 파일의 서버 이름 찾고, `command sed` 같은 걸로 굳이 접속 하지 않고도 바꾸고, 서버 설정 반영(`nginx -s reload`)도 가능하다. 물론, 그 타자 치는 것보다 서버 접속 해서 수정하고 설정 반영 하는게 더 빠르다.

그래서 현재는 아래와 같은 방식으로 한다.

#### nginx.conf.j2 (현재)

```text
{% if '001' in ansible_hostname %}
server_name  dev.seungdols.com;
{% endif %}
{% if '002' in ansible_hostname %}
server_name  dev1.seungdols.com;
{% endif %}
{% if '003' in ansible_hostname %}
server_name  dev2.seungdols.com;
{% endif %}
{% if '004' in ansible_hostname %}
server_name  dev3.seungdols.com;
{% endif %}
{% if '005' in ansible_hostname %}
server_name  dev4.seungdols.com;
{% endif %}
{% if '006' in ansible_hostname %}
server_name  dev5.seungdols.com;
{% endif %}
```

위와 같이 해도 되고, 배열 변수 하나에 넣고 `loop`를 돌려도 된다. 사실 그게 제일 깔끔한데, 안타까운 점은 우리는 도메인 이름이 `dev - dev5`까지 총 6개를 쓰는데, 1번부터 6번이 아니다. 그래서 1번 서버의 경우 서버 이름에 1을 넣으면 안되는데, 그 처리 하기가 너무 귀찮았다. 그거 처리 하는 시간에 아래를 복사해서 `vi`에디터로 복사 해서 숫자값만 바꿔주면 쉽게 끝난다.

결국, 아래의 값만 바꿔주면, `VM`에 여러 호스트를 태워서 쓰는 분들이라면 나름의 꿀팁이 될지도 모르겠다.

```text
{% if 'hostname 구분 할 수 있는 숫자' in ansible_hostname %}
server_name  dev.seungdols.com;
{% endif %}
```

당연히 해당 템플릿을 실행하는 `task`의 `playbook`은 `gather_facts`의 옵션을 참 값으로 셋팅해야 한다. 그래야 상위에서 참조할 `ansible_hostname`변수의 값을 활용 할 수 있다.

그럼, 역시 짠내나는 `ansible` 깨알 팁 끝. :)
