---
layout: post
title: 'jenkins tip을 정리하자.'
description: 'jenkins와 친해지기'
date: 2021-08-05 22:47:00
category: jenkins
tags: [jenkins, programming, tip]
comments: true
draft: false
---

### Job이 안 죽고 Zombie 상태로 계속 돌 때

Go to "Manage Jenkins" > "Script Console" and run a script:

```groovy
 Jenkins.instance.getItemByFullName("JobName")
        .getBuildByNumber(JobNumber)
        .finish(hudson.model.Result.ABORTED, new java.io.IOException("Aborting build"));
```

ref. https://stackoverflow.com/questions/14456592/how-to-stop-an-unstoppable-zombie-job-on-jenkins-without-restarting-the-server

### build queue가 꽉 차서 해소가 안될 때

Go to "Manage Jenkins" > "Script Console" and run a script:

```groovy
Jenkins.instance.queue.clear()
```

ref. https://support.cloudbees.com/hc/en-us/articles/360051376772-How-can-I-purge-clean-the-build-queue-?page=3

### 실행 중인 Job을 한번에 중지 시키고 싶다면?

```groovy
Jenkins.instance.getAllItems(AbstractProject.class).each {it ->
  it.getBuilds().each {
    if (it.isBuilding()) {
      if(it.getDisplayName().contains("JobName")) {
          println(it.getFullDisplayName());
          it.doStop()
      }
    }
  }
}
```

ref. https://sites.google.com/site/xiangyangsite/home/technical-tips/software-development/jenkins/cancel-all-jobs-in-the-queue/stop-running-jobs

### JENKINS-48300: if on an extremely laggy filesystem error

wrapper script does not seem to be touching the log file ~~

(JENKINS-48300: if on an extremely laggy filesystem, consider -Dorg.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL=86400)

위와 같은 에러가 발생 할때, 아래 방법을 사용.

#### 파이프라인에 추가

```groovy
script {
  System.setProperty("org.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL", "3800");
}
pipeline {
 // todo
}
```

#### Go to "Manage Jenkins" > "Script Console" and run a script:

```groovy
System.setProperty("org.jenkinsci.plugins.durabletask.BourneShellScript.HEARTBEAT_CHECK_INTERVAL", "3800");
```

ref. https://pythonq.com/so/jenkins/382418
