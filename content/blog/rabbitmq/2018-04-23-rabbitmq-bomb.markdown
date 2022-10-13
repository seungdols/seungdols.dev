---
layout: post
title: 'rabbitmq 서버 터트리고 살리기 (akka. file discriptor가 문제다.)'
description: 'rabbitmq 터지고, 살리는 의술의 연속'
date: '2018-04-23 22:00'
tags: [linux, rabbitmq]
category: 'rabbitmq'
comments: true
draft: false
---

파일 디스크립터 갯수 올리려다가 rabbitmq 터진 사건
파일 디스크립터 갯수가 1024개로 되어 있으나, OS의 파일 디스크립터 갯수는 81920개까지 사용 가능하다.

```
$ ulimit -n #명령어로 갯수 확인이 가능하다.
```

rabbitmq를 처음 셋팅하게 되면, 기본적으로 file discriptor 갯수가 1024개로 셋팅이 되는 것 같다. 그런데, rabbitmq-server를 재시작하면, OS 커널에 대한 옵션을 자동으로 가져오는 것 같다. (혹은 아닐 수도 있습니다.)

그래서 노드 1번을 냅두고, 노드 2번부터 stop_app으로 어플리케이션을 중지시키고, rabbitmq-server를 중지시켰다가 다시 시작 시켰다. 바로 file discriptor 갯수가 증가했다.

그 후 노드 1번을 증가시키고자 노드 1번을 내린 후 재시작을 해도 file discriptor가 증가하지 않았다. 이유가 무엇일까? (이에 대한 이유를 잘 모른다.)

```
[root@server sbin]$ sudo /sbin/service rabbitmq-server start
Redirecting to /bin/systemctl start rabbitmq-server.service
Job for rabbitmq-server.service failed because the control process exited with error code. See "systemctl status rabbitmq-server.service" and "journalctl -xe" for details.
```

위와 같은 에러가 나면, 일단 두려워 해야한다.

그렇게 파일 디스크립터를 위한 시작 > 재시작을 하다가 급 에러를 내뿜기 시작했다.

```

BOOT FAILED
===========
​
Error description:
   init:do_boot/3
   init:start_em/1
   rabbit:start_it/1 line 454
   rabbit:broker_start/0 line 330
   rabbit_plugins:setup/0 line 124
throw:{error,
         {cannot_delete_plugins_expand_dir,
             ["/var/lib/rabbitmq/mnesia/rabbit@hostname-plugins-expand",
               {cannot_delete,
                   "/var/lib/rabbitmq/mnesia/rabbit@hostname-plugins-expand/rabbitmq_management-3.7.0/include/rabbit_mgmt.hrl",
                   eacces}]}}
Log file(s) (may contain more information):
   /var/log/rabbitmq/rabbit@hostname.log
   /var/log/rabbitmq/rabbit@hostname_upgrade.log
```

그런데, 이것의 문제점은 rabbitmq서비스가 떠있는데 서버 중지조차 되지 않는다.

#### 아래도 안먹힘

```
[root@hostname ~]$ sudo /sbin/rabbitmq-server stop
ERROR: node with name "rabbit" already running on "hostname"
$ sudo rabbitmqctl start_app #안먹힘
$ sudo rabbitmqctl stop_app #안먹힘
```

그런데 신기한 점은 `rabbitmq-server` 프로세스가 계속 떴다가 죽었다가 한다.
`/usr/lib64/erlang/erts-9.1.5/bin/epmd -daemon` 이런 프로세스가 계속 떠있다.

죽었다가 한다.

`/usr/lib64/erlang/erts-9.1.5/bin/beam.smp` 이런 프로세스도 떴다가 죽는다.

```
$ systemctl status rabbitmq-server.service
rabbitmq-server.service - RabbitMQ broker
   Loaded: loaded (/usr/lib/systemd/system/rabbitmq-server.service; disabled; vendor preset: disabled)
 ~~~
 Process: 11561 ExecStop=/usr/sbin/rabbitmqctl shutdown (code=exited, status=69)
 Process: 10413 ExecStart=/usr/sbin/rabbitmq-server (code=exited, status=1/FAILURE)
 Main PID: 10413 (code=exited, status=1/FAILURE)
```

추측, `epmd process`와 비정상적으로 종료된 `rabbitmq process`가 충돌나는게 아닐까?

`rabbitmq-server`는 구동이 안되는 상태, stop하려해도 이미 동작중이라거나, start하려고 하면, plugin 관련한 에러로 rabbitmq broker가 제대로 실행되지 않는다.

그러나, rabbitmq 프로세스는 떠있음.

`epmd -deamon`이 살았다가 죽었다가 하면서, rabbitmq 프로세스를 살리는 것 같다.

### 해결 방안

추측에 근거 `epmd -deamon`과 `rabbitmq-server process`를 kill...

`pkill -9 -ef process_name`을 통해 미친듯이 종료시켜도 계속 실행됨.

결론적으로 무언가가 계속 무한 프로세스 생성이 되게끔 하는 녀석이 존재함.

어떻게 하지?

`/var/lib/rabbitmq/mnesia/`이 디렉토리가 하는 역할을 모르겠다. 다만, 분명한건 에러로그에 나오고 해당 디렉토리 하위의 plugin 관련 문제가 발생했다.

### 참고

- https://gist.github.com/christopher-hopper/9755478

- https://www.google.co.kr/search?newwindow=1&ei=k7ndWv7gDIXt0ATj94fgDQ&q=rabbitmq+cannot+delete+plugins+expand_dir&oq=cannot_delete_plugins_expand_dir&gs_l=psy-ab.3.0.0i7i10i30i19k1.381077.383319.0.384951.3.3.0.0.0.0.216.452.0j2j1.3.0....0...1c.1j2.64.psy-ab..0.3.450...0i10i30i19k1.0.xxjhOrXtpJU

- https://stackoverflow.com/questions/8737754/node-with-name-rabbit-already-running-but-also-unable-to-connect-to-node?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa

- https://groups.google.com/forum/#!topic/rabbitmq-users/InyqmSlwSIM

- https://access.redhat.com/solutions/1596043

그러던 중 `rabbitmq-server fails to start on Red Hat Openstack Platform 7`의 문서에서 `Resolution`을 따라보기로 했다.

`rm -rf /var/lib/rabbitmq/mnesia/*`를 하고, `systemctl start rabbitmq-server`를 하면 된다고 나오나, 이렇게 해봐도 동작하지 않았다.

```
$ sudo cd /var/lib/rabbitmq
$ sudo rm -rf mnesia/ #directory 전체를 삭제
$ sudo /sbin/server rabbitmq-server stop #정상적으로 동작함.
```

위 처럼 아예 디렉토리 자체를 삭제했다. 그리고 사실 `rabbitmq server`를 복구하기 위해서 여러 명령어를 쳤었다.

사실 되살리고 보니 설정들이 전부 날아갔었다.

왜일까? 생각해보니 `reset`명령어를 쳤었는데, 그게 적용이 되었었나 보다.

그래서 `rabbitmq` 설정을 다시 하고, `definitions file`을 다시 `import` 시켜서 기존 설정을 복구 할 수 있었다.

그리고 다시 clustering을 셋팅 해주었다.

다시 복구하고 보니, `file discriptor` 갯수는 1024개로 롤백되었다...

다음에 다시 해보자.
