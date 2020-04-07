---
layout: post
title: "apache httpd + tomcat + node 운용하기?"
description: "서버 한대에 대가족을 만들어보자."
date: 2020-04-07 10:36:00
category: ansible
tags: [apache httpd, web]
comments: true
---
  

### apache httpd + tomcat instance + node server 

서버 한대에 아파치 웹서버, 톰캣 인스턴스 그리고 노드 서버 까지 운용할 수 있을까? 

- 답은 가능하다. 


```
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_scgi_module modules/mod_proxy_scgi.so
LoadModule proxy_ajp_module modules/mod_proxy_ajp.so
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so
```

위의 모듈을 이용해, tomcat 서비스, node 서비스를 둘 다 동시에 서비스 할 수도 있고, tomcat 서비스는 로드 밸런싱도 할 수 있다. (proxy_http or proxy_ajp 이용 하면 된다.)

만약, apache httpd에서 tomcat을 proxy 형태로 로드 밸런싱 하고자 한다면, 아래와 같이 설정 하면 된다. 

```
    ProxyPassMatch ^/(.*[.](jsp))$ balancer://tomcat
    ProxyPassReverse ^/(.*[.](jsp))$ balancer://tomcat
    ProxyPass / http://localhost:{{ NODE_PORT }}/ Keepalive=On retry=0
    ProxyPassReverse / http://localhost:{{ NODE_PORT }}/
    <Proxy balancer://tomcat>
        BalancerMember ajp://localhost:{{ tomcat1_ajp_port }} loadfactor=1 route=tomcat1 Keepalive=On
        BalancerMember ajp://localhost:{{ tomcat2_ajp_port }} loadfactor=1 route=tomcat2 Keepalive=On
        ProxySet lbmethod=bytraffic
    </Proxy>
```

로드 밸런싱 메소드는 httpd 문서를 보면 된다.

물론, 굳이 이런 상황이라면, apache httpd를 고집하지 말고, nginx로 가면 된다.

### 참조

[mod_proxy_balancer - Apache HTTP Server Version 2.4](https://httpd.apache.org/docs/2.2/mod/mod_proxy_balancer.html)

[Apache mod_proxy를 이용한 reverse proxy와 로드밸런싱](https://khlee03.tistory.com/entry/Apache-modproxy%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-reverse-proxy%EC%99%80-load-balancing)

[httpd mod_proxy 와 tomcat lb 설정에 따른 load balancer 구현](https://jjeong.tistory.com/581)
