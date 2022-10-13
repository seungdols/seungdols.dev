---
layout: post
title: 'Volta?! (JavaScript command line tool)'
description: 'nvm만 쓸거늬!'
date: 2022-01-13 22:56:00
category: tool
tags: [tool, programming]
comments: true
draft: false
---

## volta (JavaScript command line tool)

원래 node 버전 매니저로 [nvm](https://github.com/nvm-sh/nvm)을 제일 많이 썼다. 실제 실무에서도 물리서버에서 쓰거나, jenkins(유물 같지만, 실무에서도 짱짱하게 잘 썼다. 현재는 github action을 쓰고 있다.)에서도 nvm을 설치해서 쓰곤 했는데, 이제 로컬에서는 [volta](https://docs.volta.sh/guide/)를 쓴다. 쓴지는 좀 됐다.

volta를 쓰는 이유는 nvm보다 훨씬 빠르다. 인터랙션이 훨씬 빨라서 쓰게 되었고, nvm 보다 더 가벼운 느낌의 Node 버전 매니저는 [n](https://github.com/tj/n)이라는 것도 있는데, 잠시 쓰다가 바로 volta로 왔다.

### volta install

```bash
# install Volta
curl https://get.volta.sh | bash

# install Node
volta install node

# start using Node
node
```

위처럼 설치를 해도 되고, MacOS 유저라면 homebrew로도 설치가 가능하다.

```bash
brew install volta
```

volta는 Rust라는 언어로 작성되어 굉장히 빠르다.

### 내가 생각하는 장단점

volta는 사실 버전 관리 매니저 툴이 아닌 어떤 종합적인 JavaScript command line tool이고, 실제 사용 하는 방법도 조금은 다르다.

우선, nvm도 가진 장점은 `NodeJS` 버전 변환이 용이하다. 이는 volta도 마찬가지인데, volta의 더 큰 장점은 프로젝트 별로 버전을 고정 시킬 수 있다.

```bash
volta pin node@12.20
volta pin yarn@1.19
```

Ref. https://docs.volta.sh/guide/understanding#managing-your-project

물론, nvm도 alias를 지정 할 수 있기 때문에, project 버전 별로 node 버전을 설치 후에 해당 project 이름과 버전을 설정 해두면, 명령어 하나로 버전을 바꿀 수 있다.

nvm은 전역 디렉토리에 node버전별로 디렉토리가 분리 되어 설치 되기 때문에, alias를 설정 한다고 해서, 모듈간 문제가 생길 일이 없다.

다만, 로컬에서 터미널을 실행 시킬 때, nvm 관련 커맨드를 같이 실행 해줘야 되는 문제 때문인지?! 어느 순간부터인가 굉장히 느려졌다.

그래서 `volta`로 이주하게 되었다.

### volta usage

예를 들어 [tsdx](https://tsdx.io/) 라는 툴로 프로젝트를 하나 만든다고 가정 해보자.

```bash
volta install tsdx
# volta run [sub-command]
volta run tsdx create test
```

`tsdx create`는 `tsdx` 툴의 명령어이고, `test`는 만들어질 디렉토리 이름이다.

결과적으로 `volta`를 이용해 tool을 실행 시킬 때는 `volta run`을 쓰면 된다.

사실 사용법은 굉장히 쉽다.

### volta commands

```text
SUBCOMMANDS:
    fetch          Fetches a tool to the local machine
    install        Installs a tool in your toolchain
    uninstall      Uninstalls a tool from your toolchain
    pin            Pins your project's runtime or package manager
    list           Displays the current toolchain
    completions    Generates Volta completions
    which          Locates the actual binary that will be called by Volta
    setup          Enables Volta for the current user / shell
    help           Prints this message or the help of the given subcommand(s)
```

위와 같이 쓸 수 있는 명령어를 터미널에서 `volta`만 입력해도 볼 수 있다.

https://docs.volta.sh/reference/

자세한 부분은 위의 페이지에서 확인이 가능하고, 실제로 자주 쓰는 명령어는 `install, pin, run` 정도 밖에 없을 것 같다.
