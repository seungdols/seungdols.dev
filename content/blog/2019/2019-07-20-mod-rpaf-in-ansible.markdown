---
layout: post
title: "mod_rpaf 모듈을 ansible로 설치 하기"
description: "apache mod_rpaf 모듈을 설치하는 시나리오 구성하기(ansible)"
date: 2019-07-20 20:06:00
category: weekly-news
tags: [ansible, mod_rpaf, apache]
comments: true
---

# mod_rpaf 모듈이 필요한 경우 

`apache 2.2.x`를 사용하는데, proxy server를 거치는 경우 client-ip가 바뀐다. 그럴때, 해당 모듈을 사용하면 되는데, **apache 2.4.x**에서는 `mod_remoteip.so`가 아마 있어서 해당 모듈을 사용하면 된다. 

## apache httpd 2.2.x를 사용하는 경우 설치 (with ansible)

`ansible-playbook`을 기준으로 하는데, 보통 `role`을 구성해서 사용하는 편이다. 

그러나, 해당 작업은 apache setting과의 의존이 있기 때문에 하나의 task로 분리해서 만들었다. 원래는 role을 구성하는 것이 더 좋다. 

`ansible-playbook`을 어떤 것인지 모르겠다면, [ansible document](https://docs.ansible.com/ansible/latest/user_guide/playbooks_intro.html)를 참고 하면 된다. 

간략하게 설명 하자면, 하나의 디렉토리를 구성하고, `inventory/`,`group_vars/`, `host_vars/`, `role/`등을 구성 한 뒤에 각 영역에 맞게 정보를 `yaml`형태로 파일을 만들어서 넣어주면 된다.   

`tasks/setup_mod_rpaf.yml`이라고 하나 만든다. 

```yaml
---

- name: download package of mod_rpaf
  unarchive:
    src: "https://github.com/gnif/mod_rpaf/archive/v{{ rpaf_version }}-rc1.tar.gz"
    dest: /home/seungdols/apps/
    owner: seungdols
    group: seungdols
    remote_src: yes
  tags:
    - mod_rpaf
    - download

- name: make install mod_rpaf
  make:
    chdir: "/home/seungdols/apps/mod_rpaf-{{ rpaf_version }}-rc1"
    target: install
  tags:
    - mod_rpaf
    - make_module

- name: finish libtool
  command: libtool --finish /home/seungdols/apps/apache/modules/
  args: 
    chdir: "/home/seungdols/apps/mod_rpaf-{{ rpaf_version }}-rc1"
  tags:
    - mod_rpaf
    - libtool
```

`vars/main.yml`에는 `rpaf_version`을 넣어주면 된다. 

```yaml
---

rpaf_version: 0.8.5
```

원래는 `role`을 이용해 새로 구성하는 것이 좋긴 하지만, `apache httpd` 셋팅 구성과 함께 해주는 것이 좋기 때문에, 하나의 `task`로 구성 했다. 

그런데, 위의 경로 같은 부분들은 아무래도 각자 상황에 맞게 입력 해주어야 한다. 위의 예시는 회사에서 만든 파일에서 회사 서버들의 경로를 노출 하기가 좀 꺼림칙하여 변경했으므로, 해당 경로는 각자 서버 디렉토리에 맞게 설정을 해야 한다. 
