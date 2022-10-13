---
layout: post
title: 'alfred workflow 동작 오류 - python을 못찾을 경우'
description: 'Monterey에서 오류'
date: 2022-03-19 21:25:00
category: tool
tags: [tool, macos]
comments: true
draft: false
---

언제부터인가, alfred workflow가 동작을 안하는 걸 보니 python2 환경이라 그렇고, monterey 업데이트 좀 하다보니 아예 맥 기본 path에 python3만 존재하면서 오류가 발생 했다.

https://www.alfredapp.com/help/kb/python-2-monterey/

위 페이지를 참고해보면, 된다.

```bash
export PATH="/opt/homebrew/bin:/usr/local/bin:${PATH}"
eval "$(brew shellenv)"
brew install pyenv
pyenv install 2.7.18
ln -s "${HOME}/.pyenv/versions/2.7.18/bin/python2.7" "${HOMEBREW_PREFIX}/bin/python"
```
