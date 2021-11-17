---
layout: post
title: "Nginx HTTP Server 1장 정리"
description: "nginx HTTP server와 친해지기"
date: 2021-11-17 22:49:00
category: jenkins
tags: [nginx, tip]
comments: true
---


Nginx HTTP Server 책을 정리 하였습니다. 

### PCRE 라이브러리

엔진엑스를 컴파일 하는데 PCRE 라이브러리가 필요하다. 엔진엑스의 URL Rewrite 모듈, HTTP 모듈은 PCRE를 정규식 구문에 사용한다. pcre pcre-devel 두 가지 패키지를 설치하는게 기본적이다. 

### zlib 라이브러리

zlib 라이브러리는 압축 알고리즘을 개발자에게 제공하낟. 엔진엑스에서 gzip 압축을 하는데 필요하다. zlib zlib-devel 두 가지 패키지를 설치하는게 기본적이다. 

### openssl 라이브러리

강력한 범용 암호 라이브러리와 함께 보안 소켓 계층과 전송 계층 보안 프로토콜을 구현한다. openssl openssl-devel 패키지가 필요하다. 

### nginx 컴파일 옵션

- `--with-cc` C컴파일러 대체 위치를 지정 한다.
- `--with-cpp` C++ 컴파일러 대체 위치를 지정 한다.
- `--with-cc-opt` C 컴파일러 명령행에 전달할 부가 옵션을 정의한다.
- `--with-ld-opt` C 링커 명령행에 전달할 부가 옵션을 정의한다.
- `--with-cpu-opt` 대상 프로세서 아키텍처를 지정한다.

### 기본 활성 모듈 설명

- `--without-http_charset_module` 웹 페이지를 재인코딩하는 문자 세트(Charset) 모듈비활성화
- `--without-http_gzip_module` Gzip 압축 모듈 비활성화
- `--without-http_ssi_moduleSSI(Server Side Include)` 모듈 비활성화
- `--without-http_userid_module` 쿠키로 사용자를 식별하는 사용자 ID(User ID) 모듈비활성화
- `--without-http_access_moduleIP` 주소 범위의 접근을 제어하도록 구성할 수 있는 접근(Access) 모듈 비활성화
- `--without-http_auth_basic_module` 기본 인증(Basic Authentication) 모듈 비활성화
- `--without-http_autoindex_module` 자동 색인(Automatic Index) 모듈 비활성화
- `--without-http_geo_moduleIP` 주소 범위로 변수를 지정할 수 있는 지리(Geo) 모듈 비활성화
- `--without-http_map_module`키-값 형태의 자료 구조를 선언할 수 있는 맵(map)모듈 비활성화
- `--without-http_referer_module` 참조 제어(Referer control) 모듈 비활성화
- `--without-http_rewrite_module` 재작성(Rewrite) 모듈 비활성화
- `--without-http_proxy_module` 다른 서버에 요청을 전달하는 프록시(Proxy) 모듈비활성화
- `--without-http_fastcgi_module`
- `--without-http_uwsgi_module`
- `--without-http_scgi_module` 각각 FastCGI, uWSGI, SCGI 프로세스와 상호작용하는 FasICGI, uWSGI, SCGI 모듈을 비활성화
- `--without-http_grpc_module` GRPC 서버로 요청을 넘기는 ERPC 모듈을 비활성화
- `--without-http_memcached_module` 멤캐시디 데몬(Memcached daemon)에 연동되는멤캐시디 (Memcached) 모듈 비활성화
- `--without-http_limit_conn_module` 정의된 구역(zone)에 따라 자원 사용량을 제약하는연결 제한(Limit Connections) 모듈 비활성화
- `--without-http_limit_req_module` 사용자당 요청 횟수를 제한하는 요청 제한(LimitRequests) 모듈 비활성화
- `--without-http_mirror_module` 배후에서 원래 요청을 복제해서 부가 요청을 만드는요청 복제(Mirror) 모듈 비활성화
- `--without-http_empty_gif_module` 메모리에서 공백 Gif 이미지를 제공하는 빈 GM(EmptyGIF) 모듈 비활성화
- `--without-http_browser_module` 사용자 에이전트(User Agent) 문자열을 해석하는브라우저(Browser) 모듈 비활성화
- `--without-http_upstream_hash_module` 업스트림 구역에서 hash 지시어를 제공하는 업스트림 해시(upstream Hash) 모듈 비활성화
- `--without-http_upstream_ip_hash_module` 업스트림 구역에서 ip_hash 지시어를 제공하는 업스트림 IP 해시(Upstream IP Hash) 모듈 비활성화
- `--without-http_upstream_least_conn_module` 업스트림 구역에서 least_conn 지시어를 제공하는최소 업스트림 연결(Upstream Least Conn) 모듈 비활성화
- `--without-http_upstream_keepalive_module` 업스트림 구역에서 keepalive 지시어를 제공해 업스트림 연결을 캐시하는 업스트림 연결 유지(UpstreamKeepalive) 모듈 비활성화
- `--without-http_upstream_zone_module` 업스트림 구역에서 zone 지시어를 제공해 공유 상태보관 구역을 설정할 수 있는 업스트림 구역(UpstreamZone) 모듈 비활성화
- `--without-http_split_clients_module` A/B 테스트에 사용할 변수를 만드는 고객 분할(SplitClients) 모듈 비활성화

주요 사전 구성 요소는 기본적으로 GCC, PCRE, zlib, Openssl 이다. 

- nginx master process: 해당 프로세스는 루트에서 실행 해야 한다. 루트로 실행 하지 않으면, 80 포트, 443 포트에 접근 할 수 없다.
- nginx worker process: 설정 파일에 서술한 user 지시어로 지정한 계정에 따라 주 프로세스가 자동 생성한다.

### nginx command

- `nginx -s stop` :  데몬을 강제로 종료한다. (TERM 시그널)
- `nginx -s quit` : 안전하게 데몬을 종료한다. (QUIT 시그널)
- `nginx -s reopen` : 로그 파일을 다시 연다.
- `nginx -s reload` :  구성 파일을 다시 읽는다.

### 설정 테스트

`sbin/nginx -t` 로 구성 파일이 정상적인지 테스트 할 수 있다. -t 옵션 자체가 test의 의미이다. 

운영 중인 설정 파일을 조작하는 건 위험하니, 임시 파일을 만들고, 해당 파일을 테스트 하는 것이 좋은데, 이때 쓸 수 있는 옵션이 `-c` 이다. 

```bash
$ sbin/nginx -t -c /home/seungdols/apps/nginx/conf/nginx-temp.conf
```

위와 같이 임시 파일을 테스트 할 수 있다. 

### 기타 명령어

`sbin/nginx -V` 를 입력하면 어떤 버전인지? 빌드시 전달 된 arguments는 무엇인지 알 수 있다. 

`-g` 을 이용하면, 구성 파일에 포함 되지 않은 추가 구성 지시어를 지정할 수 있다.
