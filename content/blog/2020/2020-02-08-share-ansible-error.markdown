---
layout: post
title: "Ansible Error 경험을 털어 놓아 보자."
description: "Ansible Error의 향연을 정리하자."
date: 2020-02-08 23:22:00
category: weekly-news
tags: [ansible, programming]
comments: true
---

### 예약어를 변수명으로 썼을때 이슈

예약어가 존재하는데, 예약어를 변수명으로 쓰면 arguemtns를 넘겨줘도 값 대입이 안된다. 
```
ex) 
host_vars/main.yml
role: “{{ role_name}}”
```
해주고, `-e “role_name=test”` 했더니 값에 role에 해당하는 이름이 계속 들어가서 알게 됨. 

### ansible -m shell 모듈 관련 (help)

`ansible -m shell`로 tomcat을 실행하는 쉘 스크립트를 동작하게 모듈을 실행 하고 난 뒤에, 끝나면 꺼지는데, nohup을 같이 줘야 하는 이유는 왜일까…?

`shell script file`자체가 deamon 구동으로 실행 하도록 `&`를 주었는데도 막상 앤서블로 실행 하면 모듈 실행 이후 process가 꺼지고 만다. 

이 부분은 검색을 해야봐야 할 것 같은데, 막상 문의를 해보아도 뚜렷한 답을 잘 모르겠다. 이 부분때문에 logstash를 모두 서비스로 등록 해서 써야 할 위치에 놓여있다. 큰일이다. 쉬운 방법 없을까? 

### roles 하위 role에 remote_user 지정 경고 

```
[DEPRECATION WARNING]: Using 'remote_user' as a role param has been deprecated. In the future, these values should be entered in the `vars:` section for roles, but for now we'll store it as both a param and an attribute..
This feature will be removed in a future
release. Deprecation warnings can be disabled by setting deprecation_warnings=False in ansible.cfg.
```

단, ansible_user로 셋팅하면 동일하다. 그리고 ansible core 소스를 까봐도 동일하다. 

ansible 요약 

* https://gist.github.com/andreicristianpetcu/b892338de279af9dac067891579cad7d

### typo error

단순하지만, 삽질을 오랜 시간 만드는 예약어 오타 이슈이다.

```bash
{"msg": "The conditional check 'setup is defiend' failed. The error was: template error while templating string: no test named 'defiend
```

도대체 에러가 왜 나는 것인가? 계속 찾아 봤는데, 에러 메세지 속에 힌트가 있다. 
오타였다. 

`when`에 들어 갈 수 있는 예약 키워드를 잘 기억 해두자. 

ref. https://docs.ansible.com/ansible/latest/user_guide/playbooks_conditionals.html

* is not defined
* is defined
* is undefined
* is succeeded
* is skipped
* is failed

헷갈리지 말자. 
