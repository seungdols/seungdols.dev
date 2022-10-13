---
layout: post
title: 'Apache httpd core dump 이야기 (Tomcat AJP연동시 깨알팁)'
description: 'Apache는 너무 어려워!'
date: 2020-09-09 23:00:00
category: httpd
tags: [server, apache, httpd]
comments: true
draft: false
---

> 위 내용은 상당히 오래 전에 발생 했었습니다. 현재는 nginx를 사용하고 있습니다.

## 😱 어느 날 이슈가 발생했다!

```

[Fri Oct 27 20:12:49 2017] [notice] Apache/2.2.31 (Unix) mod_jk/1.2.41 configured -- resuming normal operations
[Fri Oct 27 20:12:49 2017] [notice] child pid 87300 exit signal Segmentation fault (11)
[Fri Oct 27 20:12:55 2017] [notice] child pid 87301 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:00 2017] [notice] child pid 87302 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:05 2017] [notice] child pid 87303 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:10 2017] [notice] child pid 87304 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:15 2017] [notice] child pid 87305 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:20 2017] [notice] child pid 87306 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:25 2017] [notice] child pid 87307 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:30 2017] [notice] child pid 87313 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:35 2017] [notice] child pid 87314 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:40 2017] [notice] child pid 87315 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:45 2017] [notice] child pid 87316 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:50 2017] [notice] child pid 87317 exit signal Segmentation fault (11)
[Fri Oct 27 20:13:55 2017] [notice] child pid 87319 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:00 2017] [notice] child pid 87320 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:05 2017] [notice] child pid 87321 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:10 2017] [notice] child pid 87322 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:15 2017] [notice] child pid 87323 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:20 2017] [notice] child pid 87324 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:25 2017] [notice] child pid 87325 exit signal Segmentation fault (11)
[Fri Oct 27 20:14:30 2017] [notice] child pid 87331 exit signal Segmentation fault (11)
```

원인은 모르지만, `apache process`가 정상적으로 로드 된 이후 `child process`를 만든 뒤에 `child process`가 어떤 이유인지 모르게 자꾸 죽어 버리는 현상이 발생한다.

## apache core dump 설정

참고

[Apache Software Foundation](https://cwiki.apache.org/confluence/display/HTTPD/CoreDump)

[Apache CoreDump](https://idchowto.com/?p=45672)

[How to get a core dump from apache when segfaulting](https://serverfault.com/questions/470407/how-to-get-a-core-dump-from-apache-when-segfaulting)

```
# 루트 권한 계정
$ cat /proc/sys/kernel/core_pattern
core
$ sudo /sbin/sysctl -w fs.suid_dumpable=2
$ sudo /sbin/sysctl -w kernel.core_pattern=/var/tmp/core-%e.%p
kernel.core_pattern = /var/tmp/core-%e.%p
$ cat /proc/sys/kernel/core_pattern
/var/tmp/core-%e.%p

# 일반 계정
$ ulimit -c unlimited
$ ulimit -c
unlimited
```

`gbd`라는 툴이 필요로 한데, 해당 툴을 설치하는 방법은 리눅스 OS마다 상이합니다.

[http://www.gdbtutorial.com/tutorial/how-install-gdb](http://www.gdbtutorial.com/tutorial/how-install-gdb)

## 🛠 코어 덤프 파일을 gbd로 분석

```
#0  0x00007f03cd74bf04 in jk_shm_check_maintain () from /seungdols/apache/modules/mod_jk.so
Missing separate debuginfos, use: debuginfo-install apr-1.4.8-3.el7.x86_64 apr-util-1.5.2-6.el7.x86_64 cyrus-sasl-lib-2.1.26-20.el7_2.x86_64 expat-2.1.0-10.el7_3.x86_64 glibc-2.17-196.el7.x86_64 libcom_err-1.42.9-9.el7.x86_64 libdb-5.3.21-19.el7.x86_64 libgcc-4.8.5-11.el7.x86_64 libidn-1.28-4.el7.x86_64 libselinux-2.5-6.el7.x86_64 libssh2-1.4.3-10.el7_2.1.x86_64 libstdc++-4.8.5-11.el7.x86_64 libuuid-2.23.2-33.el7_3.2.x86_64 ~~ 일부 생략 ~~ openssl-libs-1.0.2k-8.el7.x86_64 openssl098e-0.9.8e-29.el7.centos.3.x86_64 pcre-8.32-15.el7_2.1.x86_64 zlib-1.2.7-17.el7.x86_64
(gdb) bt
#0  0x00007f03cd74bf04 in jk_shm_check_maintain () from /seungdols/apache/modules/mod_jk.so
#1  0x00007f03cd735d30 in wc_maintain () from /seungdols/apache/modules/mod_jk.so
#2  0x00007f03cd724560 in jk_handler () from /seungdols/apache/modules/mod_jk.so
#3  0x000000000043fc50 in ap_run_handler ()
#4  0x00000000004405a7 in ap_invoke_handler ()
#5  0x00000000004510d6 in ap_process_request ()
#6  0x000000000044df8d in ap_process_http_connection ()
#7  0x00000000004491dc in ap_run_process_connection ()
#8  0x0000000000449678 in ap_process_connection ()
#9  0x0000000000458126 in child_main ()
#10 0x00000000004582e4 in make_child ()
#11 0x0000000000458355 in startup_children ()
#12 0x0000000000458829 in ap_mpm_run ()
#13 0x0000000000425d77 in main ()
```

정확하게 분석을 한건 아니지만, `back trace`를 통해 어디서 문제가 발생했는지는 알 수 있었습니다.

즉, 부모 프로세스가 정상적으로 로딩은 되었고, **httpd.conf 파일에 명시된 초기 mpm을 실행하는데, 초기 갯수는 httpd.conf 설정한 값의 수 만큼 child process가 생성 됩니다.**

이로 인하여 어떤 문제인지 추적 할 수 있게 됩니다. 그런데, 쉽지는 않기 때문에 기왕이면 이렇게 분석할 일이 없는게 정말 좋습니다.

## 깨알 Tip

### 1. Apache - Tomcat instance load balancer 설정시 host ip를 꼭 넣어주자.

추가적으로 팁을 하나 넣자면, 같은 서버 내에서 **Apache - Tomcat instance**를 `Load Balancing` 할때, 설정 파일에 **worker process의 host ip를 명시적으로 넣어 주는 게 좋습니다.**

특히, mod_ssl을 사용 하지 않고, **Apache - Tomcat instance load balancer**를 설정 하려면, `workers-lb.properties` 파일 내에 `worker.tomcat1.host=127.0.0.1`로 설정을 해주어야 한다. tomcat2가 있다면, 똑같이 설정 해야 한다. (만약 다른 서버에 있다면, 다른 서버 ip를 기입해야 한다.)

이유는 `mod_jk` 쪽에서 메모리를 해제하고 다시 생성하는 때에 host정보를 얻어 오는 데에 대한 Crash가 발생하면서 일어나는 문제가 발생 할 가능성이 있다.

### 2. AJP 보안 이슈

최근 Apache Tomcat의 원격코드실행 취약점(CVE-2020-1938)을 악용할 수 있는 개념증명코드(Proof of concept code, PoC)가 인터넷상에 공개되어 사용자의 보안 강화 필요하다.

참고 - [https://www.krcert.or.kr/data/secNoticeView.do?bulletin_writing_sequence=35292](https://www.krcert.or.kr/data/secNoticeView.do?bulletin_writing_sequence=35292)

1. 버전 업데이트를 해서 처리 할 수 있다.
2. Tomcat 설정인 server.xml에 Connector 설정에서 `requiredSecret` 혹은 `secret`을 설정 하여 해결 하는 방법도 있다.

   [https://tomcat.apache.org/tomcat-8.5-doc/config/ajp.html](https://tomcat.apache.org/tomcat-8.5-doc/config/ajp.html)

3. AJP 기능이 불필요한 경우 Connector 비활성화 주석 처리 하면 된다.
