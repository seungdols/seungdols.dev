---
layout: post
title: 'Ansible 사용하면서 삽질 경험, 약간의 팁'
description: '앤서블을 써도 써도 어렵구나.'
date: 2020-11-07 16:20:00
category: ansible
tags: [ansible, infra]
comments: true
draft: false
---

- 예약어를 변수명으로 썼을때 이슈

예약어가 존재하는데, 예약어를 변수명으로 쓰면 arguments를 넘겨줘도 값 대입이 안된다.

```
ex)

host_vars/main.yml

role: “{{ role_name }}”
```

-e “role_name=test” 했더니 값에 role에 해당하는 이름이 계속 들어가서 알게 됨.

- ansible -m shell 모듈 관련

ansible -m shell로 tomcat을 실행시켜도 모듈 실행이 끝나면 꺼지는데, nohup을 같이 줘야 하는 이유는 왜일까…

shell script file자체가 daemon으로 실행하는데도…?

이 부분은 검색을 해야봐야 할듯.

- roles 하위 role에 remote_user 지정 경고

```
[DEPRECATION WARNING]: Using 'remote_user' as a role param has been deprecated. In the future, these values should be entered in the `vars:` section for roles, but for now we'll store it as both a param and an attribute..

This feature will be removed in a future

release. Deprecation warnings can be disabled by setting deprecation_warnings=False in ansible.cfg.
```

단, ansible_user로 셋팅하면 동일하다. 그리고 ansible core 소스를 까봐도 동일하다.

- ansible 요약
  - [https://gist.github.com/andreicristianpetcu/b892338de279af9dac067891579cad7d](https://gist.github.com/andreicristianpetcu/b892338de279af9dac067891579cad7d)

### **host os / host os version 가져오기**

- gather facts가 true 여야 한다.

```bash
- name: Set ansible host os version
  set_fact:
    host_os_version: "{{ hostvars[inventory_hostname]['ansible_distribution_major_version'] }}"
    host_os: "{{ hostvars[inventory_hostname]['ansible_distribution'] }}"
  tags:
    - apache
```

원래 위와 같이 가져오곤 했는데, 굳이 위와 같이 가져오지 않아도 된다.

```bash
ansible_distribution_major_version
```

위와 같이 사용해도 hostvar이라는 magic variable을 가져올 수 있게 된듯하다.

### get_url 파일명 지정 하기

wget 명령어에는 `--content-disposition`명령어로 업로드된 파일 명으로 다운로드 할 수 있다.

그리고, 파일명을 바꿔서 다운로드 할 수도 있다.

그런데, ansible에서 어떻게 처리를 해야 할까 고민스러웠다.

찾아보니 해당 PR이 있었다.

[Modified the get_url module to respect the content-disposition header if... by Tinche · Pull Request #4785 · ansible/ansible](https://github.com/ansible/ansible/pull/4785)

**사용법**

```yaml
- name: Down file install something
  get_url:
    url: 'https://test-something.seungdols.com/0a7056be-648d-1539-8164-93453fad7d6a'
    dest: /home/seungdols/dev/test-some_module.tar.gz
```

dest 경로 마지막에 내가 원하는 파일명으로 셋팅 해주면 된다.

docs에도 나와 있다.

[get_url - Downloads files from HTTP, HTTPS, or FTP to node - Ansible Documentation](https://docs.ansible.com/ansible/latest/modules/get_url_module.html#examples)

## 앤서블 정리

### **플레이북 실행 속도를 높이기 위한 tip**

**파이프라이닝으로 SSH 처리 수 줄이기**

일반적으로 앤서블은 task 실행마다 SSH명령을 여러번 실행(임시 디렉토리 생성, 모듈 스크립트 전송, 모듈에 실행 권한 부여, 모듈 실행 + 삭제)하지만, 파이프라이닝 설정을 활성화화면, 모듈 스크립트의 전송을 처리할 필요가 없어진다. 곧, SSH처리 수가 감소하여 (모듈 실행만으로 완료) 성능 개선으로 연결될 수 있다. 즉, 이 설정을 SSH를 통해 모듈을 실행하는 모든 경우에 유효하여 항상 활성화 해두는 것이 좋다.

```yaml
[ssh_connection]
  pipelining = True
```

파이프라이닝이 기본적으로 비활성화 된 이유는 sudo를 이용해 관리자 권한으로 실행할 때, sudoers 설정 파일에서 requiretty를 비활성화해야 한다는 제약이 있어서 그렇다. 그리고 앤서블 자체가 모든 시스템에 기본 설정만으로 문제 없이 동작해야 한다는 철학을 가지고 있어서 기본 설정에 파이프라이닝 설정 하는 것을 권장 하지는 않는다.

requiretty가 활성 상태인 호스트를 작업 할 때도 playbook을 이용해 파이프라이닝 대응 처리 자체를 ansible에서 처리가 가능하다.

```yaml
- name: pipleining 대응
    hosts: all
    become: yes
    vars:
      ansible_ssh_pipelining: no
    tasks:
      - name: ansible_user에 대한 requiretty 설정을 비활성화
        lineinfile:
          dest: /etc/sudoers
          regexp: '^Defauls:{{ ansible_user }}\srequiretty'
          line: 'Defaults:{{ ansible_user}} requiretty'
          validate: 'visudo -cf %s'
          backup: yes
```

### **forks로 동시 병렬 배포 수 제어**

여러 대에 동시에 배포시 먼저 조정 해야 하는 것이 호스트에 최대 동시 접속 수를 표시하는 forks입니다. 기본 설정은 ansible 방침에 따라 5개로 설정 되어 있어, 이 값을 늘려주면 됩니다.

단, MacOS 에서는 20으로 줘도 에러가 발생하는데, 이를 위해서는 파일 오픈 갯수를 늘려주어야 합니다.

### **암호화 관련**

- ansible-vault라는 명령으로 키 파일등을 암호화 할 수 있음.
- [https://www.vaultproject.io/](https://www.vaultproject.io/)
- vault 프로젝트또한 모듈로써 완벽하게 지원해줌.

### **앤서블 동작 순서**

- Variable loading
- Fact gathering
- The pre_tasks execution
- Handlers notified from the pre_tasks execution
- Roles execution
- Tasks execution
- Handlers notified from roles or tasks execution
- The post_tasks execution
- Handlers notified from post_tasks execution
