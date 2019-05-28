---
layout: post
title: "merge two git repositories"
description: "Git repositories를 합쳐보자"
date: "2017-05-28 22:50"
tags: [git, github]
category: "git"
comments: true
---

# Merge Two Repositories

github를 하다보니 쓸데 없이 저장소를 나누어 놓고 쓰고 있더라..

그러다보니 이게 여기다 올려야 하는지 아닌지도 모르겠고...

일명 **대환장파티** 레포지토리라고 해야 할까..

그래서 시도를 해보았다. (스프링 공부나 할 것이지)

1. [저장소 병합](http://gypark.pe.kr/wiki/Git/%EC%A0%80%EC%9E%A5%EC%86%8C%EB%B3%91%ED%95%A9) (서브 트리 이용) -- 별로다..
2. [요우님 블로그 (cherry-pick 이용)](http://luckyyowu.tistory.com/352) --이게 맞는건가 싶었다.
3. 스택오버플로우 형님들 (걍 머지 때려라)

처음에는 그냥 머지를 해보았다.

참고 : [merging two git repositories](http://blog.caplin.com/2013/09/18/merging-two-git-repositories/)

실패했다.

```bash
$ g merge practice_js/master
fatal: refusing to merge unrelated histories
```
다른 히스토리를 가졌으니 안된다고 한다.

그 다음으로 요우님 방법으로 시도를 했다. (그냥 머지는 안된다고 알려주셨다..😊😊)

요우님 블로그 발췌

```bash
git checkout merge/PP
git log #에서 가장 최근의 Commit SHA값을 복사해둔다.
git checkout master
git cherry-pick 9ede61845d75411e8cef35303b6eeaa5d7c26bdb
```

그런데 생각보다 블로그에 나와 있는 글에는 마지막 해시 값만 넣으면 된다는 뉘앙스로 써져 있었으나, 그게 아니라 커밋 자체를 모두 체리픽으로 가져오는 것인 것 같았다. (이해를 잘 못 했을 수도 있다.)

나의 경우 마지막 해시 값을 가져오니 딱 그 해시 값만 가져오더라..
(방법을 잘못 따라한 것 같다.) 😂😂😂

그래서 검색했다... 무언가 방법이 있을 것만 같다.

찾았다..👍👍👍 스택오버 플로우 누님/형님들은 대단하다.

참고 : [how do you merge two git repogitories](https://stackoverflow.com/questions/1425892/how-do-you-merge-two-git-repositories)

방법은 이렇다..그냥 머지 하면 된다.

**단, 다른 히스토리인 것도 허용한다는 옵션을 준다.**

```bash
cd path/to/project-b
git remote add project-a path/to/project-a
git fetch project-a
git merge --allow-unrelated-histories project-a/master  #or whichever branch you want to merge
git remote remove project-a
```

위처럼 옵션을 준 결과

```bash
git merge --allow-unrelated-histories practice_js/master
Auto-merging README.md
CONFLICT (add/add): Merge conflict in README.md
```

바로 이렇게 `README.md`에서만 conflict가 난다.
이것만 해결해주면 된다. ^^ (찡긋😉)👍👍
