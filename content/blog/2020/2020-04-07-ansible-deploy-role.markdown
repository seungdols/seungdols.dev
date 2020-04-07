---
layout: post
title: "Ansible로 config 파일을 선택적으로 배포하자."
description: "앤서블로 설정 파일을 선택적 배포 하기."
date: 2020-04-07 10:36:00
category: ansible
tags: [ansible, infra]
comments: true
---
  
  
`ansible`의 기초 지식이 있다는 전제 하에 설명을 진행 합니다.

우선 아래와 같은 구조가 있다고 생각하자. 

```
ansible-playbooks
  - group_vars
  - host_vars
  - inventory
  - roles
    - deploy_config
    - pc
    - api
    - mobile
```

role기반의 playbooks를 모아두기 위한 구조이다. 내가 속한 팀에서 위와 같은 디렉토리 구조를 잘 쓰고 있다. (더 좋은 방법이 있다면, 알려주시면 좋겠습니다.)

`tomcat, apache, nginx, logstash, elasticsearch, kafka`등과 같은 모든 툴들에는 설정 파일이 필요하다. 그리고 관리 해야 하는데, 나는 주로 해당 서버에 쓰이는 설정은 같은 디렉토리에 넣어둔다. 

pc에 관련한 `tomcat, nginx, logstash`등 하나의 디렉토리에서 셋업에 필요한 모든 설정을 넣어둔다. 그리고 디렉토리 구조는 동일 하게 맞춰 준다. 

특별하게 상이 하게 구성을 하게 되면, 해당 role을 통합하여 사용하기가 어렵다.

*우선 위와 같은 구조에서 톰캣 설정 파일인 server.xml을 서버별로 배포를 해야 한다고 생각해보자.* 

```
  - roles
    - deploy_config
      - tasks/main.yml
    - pc
      - files/tomcat/server.xml
    - api
       - files/tomcat/server.xml
    - mobile
       - files/tomcat/server.xml
   deploy_config.yml -> deploy_config role 실행 파일
```

```yaml
---
- hosts: "{{ host }}"
  vars_files:
    - "group_vars/main.yml"
  roles:
    - deploy_webconfig
  serial:
    - "10%" 
```

위 파일은 최상위 디렉토리에 있는 `deploy_config.yml 파일의 내용이다. 특정 role을 실행 시킨다.` 

우리는 동일한 tomcat 설정이지만 mobile, pc, api 서버의 tomcat 설정은 다르다. 각 서버에 맞는 tomcat/server.xml을 배포 해야한다.

deploy_config의 task를 어떻게 구성 할 것인가? 

```yaml
---

-  include_vars: "roles/{{ host }}/vars/main.yml"
   tags:
    - default
- name: Stop webapps.sh
  shell: nohup /seungdols/scripts/stop_webapps.sh
  tags:
    - stop_webapps
- name: deploy httpd.conf
  template:
    src: "roles/{{ host }}/templates/conf/httpd.conf.j2"
    dest: /seungdols/apps/apache/conf/httpd.conf
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  tags:
    - deploy_httpd_template

- name: deploy httpd.conf
  copy:
    src: "roles/{{ host }}/files/conf/httpd.conf"
    dest: /seungdols/apps/apache/conf/httpd.conf
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  tags:
    - deploy_httpd_copy
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/tomcat-server.xml.j2"
    dest: "/seungdols/apps/tomcat/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  tags:
    - deploy_tomcat_config
- name: Start webapps.sh
  shell: nohup /seungdols/scripts/start_webapps.sh
  tags:
    - start_webapps
```

위와 같이 어플리케이션을 동작 시킨다. 

1. stop apache httpd | nginx
2. stop tomcat
3. deploy config
4. start tomcat
5. start httpd | nginx 

왜 이렇게 하는지는 자유롭게 구성하면 된다. 내가 중요하게 생각하는 것은 `template`과 `copy`를 tags로 구분 해두었다. 

이는, 특정 서버 마다, 특수하게 변수 처리를 하여 쓰는 것도 있고, 그냥 단순 파일만 복사해도 되는 경우가 생기기 마련이었다. 

위와 같이 써도 문제는 없다. 그런데, 문제는 서버 한대에 톰캣 인스턴스를 하나만 운용하지는 않는다. 그렇게 되면 어떻게 해야 할까? 

물론, 이 글에서는 tomcat instance load balancing에 대해서는 설명 하진 않는다. 

톰캣 설정을 복사 하는 부분을 수정 하면 된다. 

```
  - roles
    - deploy_config
      - tasks/main.yml
    - pc
      - files/tomcat1-server.xml.j2
      - files/tomcat2-server.xml.j2
    - api
      - files/tomcat1-server.xml.j2
      - files/tomcat2-server.xml.j2
    - mobile
      - files/tomcat1-server.xml.j2
      - files/tomcat2-server.xml.j2
```

파일 구성이 위와 같이 달라질 것이다. 그렇게 되면, 반복을 통해 아래와 같이 deploy_config/tasks/main.yml의 내용 중 일부를 아래와 같이 수정 하면 된다. 

```
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - tomcat1
    - tomcat2
  tags:
    - deploy_tomcat_config
```

그런데, 이렇게 할 경우에는 api서버만 tomcat3의 인스턴스 설정이 있다고 하면 어떻게 할까? 그럴떄는 그냥 편리하게, task를 분리 했다. 

```
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - tomcat1
    - tomcat2
  when: host != 'api' 
  tags:
    - deploy_tomcat_config
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - tomcat1
    - tomcat2
    - tomcat3
  when: host == 'api' 
  tags:
    - deploy_tomcat_config
```

위와 같이 구성하면, host가 api가 아닌 서버만 tomcat1,tomcat2 설정 파일을 배포 할 것이며, api서버인 경우 tomcat1, tomcat2, tomcat3 설정 파일을 배포하는 task를 실행 하게 된다. 

task에 있는 host는 플레이북을 실행 시킬 때, 외부에서 인자로 넘겨주는 외부 변수 값이다. 실행시 결국 host=api | mobile | pc의 값을 넣어주게 된다.

실제 실행은, 아래와 같은 명령을 입력 하면 된다. 

```
ansible-playbook deploy_config.yml -i inventory/hosts -e "host=pc"
```

나는 되도록, 설정 파일 배포시 role별로 배포를 하는 것을 좋아한다. 총 3번의 배포를 해야 하는데, 배포는 같은 `role`인 `deploy_condig role`을 이용한다.

한번에, 배포 하는 것은 실수를 야기한다. 특히, 잘못 배포시, 배포 영향도를 줄이는 것이다.

물론, 자동화도 가능하다. `deploy role`하나로 3번의 반복이니, 외부 실행 스크립트에서 분기 해주면 된다.


만약, 디렉토리 이름도 달라져야 한다면, 아래와 같이 `task`를 구성 할 수도 있다. 

```yaml
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item.config }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item.dir }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - { config: tomcat1, dir: alpha }
    - { config: tomcat2, dir: alpha1 }
    - { config: tomcat3, dir: beta }
  when: host == 'pc-test'
  tags:
    - deploy_tomcat_config
```

실제 파일 이름과 디렉토리 이름이 상이할 경우 위와 같은 방법도 가능하다. 물론, 당연히 같은 행위를 하는 task가 3개가 되지만, 각 영역이 다르므로 `when`의 조건문을 잘 넣어 주어야 한다.  

```yaml
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - tomcat1
    - tomcat2
  when: host != 'api' and host != 'pc-test'
  tags:
    - deploy_tomcat_config
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - tomcat1
    - tomcat2
    - tomcat3
  when: host == 'api' 
  tags:
    - deploy_tomcat_config
- name: deploy server.xml of tomcat
  template:
    src: "roles/{{ host }}/templates/{{ item.config }}-server.xml.j2"
    dest: "/seungdols/apps/{{ item.dir }}/conf/server.xml"
    owner: irteam
    group: irteam
    mode: 0644
    backup: yes
  with_items:
    - { config: tomcat1, dir: alpha }
    - { config: tomcat2, dir: alpha1 }
    - { config: tomcat3, dir: beta }
  when: host == 'pc-test'
  tags:
    - deploy_tomcat_config
```

`when`만 잘 지키면, 각 영역에 맞게 설정 파일 배포하는 role을 손쉽게 쓸 수 있다. 이렇게 하지 않고, 공통적인 task를 분리해서 `include_task`로 불러서 task 파일 자체를 분리해도 된다. (가변적인 부분만 따로 분리하고, 하나의 task로 만들어도 무방하다.)
