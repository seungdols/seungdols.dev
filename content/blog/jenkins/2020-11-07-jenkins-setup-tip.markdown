---
layout: post
title: 'Jenkins 셋팅 전 확인 하면 좋은 정보'
description: '젠킨스와 친해지고 싶다.'
date: 2020-11-07 16:15:00
category: jenkins
tags: [jenkins, tip]
comments: true
draft: false
---

## Jenkins version 선택하기

jenkins download url : [http://mirrors.jenkins-ci.org/](http://mirrors.jenkins-ci.org/)

위 주소에서 war-stable에 있는 리스트에 있는 버전을 선택하는 것이 가장 탁월한 선택이다. 허나, jenkins는 매주 업데이트 하는 것으로 알려져 있고, Stable version은 3개월 단위의 버전 업데이트 집합이라고 할 수 있다.

고로, stable version이라고 해서 다 안전한 버전인 것은 아니다.

[https://jenkins.io/changelog-stable/](https://jenkins.io/changelog-stable/) 이 주소에서는 stable 버전에 대한 업데이트 내용과 함께 괜찮은지에 대한 투표를 할 수 있다. 여기에서 참고하는 편이 stable 버전 선택에 도움을 준다.

## Jenkins download

wget 명령어를 이용해 .war 파일을 다운 받는다.

```bash
wget http://mirrors.jenkins-ci.org/war-stable-rc/2.32.3/jenkins.war
```

## **Command**

### **URL**

```bash
http://<jenkins.server>/restart
http://<jenkins.server>/safeRestart
http://<jenkins.server>/exit
http://<jenkins.server>/safeExit
http://<jenkins.server>/quietDown
http://<jenkins.server>/cancelQuietDown
```

### **Remote API**

URL can be invoked by a Remote API.

Using wget:

```bash
$ wget --user=<user> --password=<password> http://<jenkins.server>/restart
$ wget --user=<user> --password=<password> http://<jenkins.server>/safeRestart
$ wget --user=<user> --password=<password> http://<jenkins.server>/exit
$ wget --user=<user> --password=<password> http://<jenkins.server>/safeExit
$ wget --user=<user> --password=<password> http://<jenkins.server>/quietDown
$ wget --user=<user> --password=<password> http://<jenkins.server>/cancelQuietDown
```

Using cURL:

```bash
$ curl -X POST -u <user>:<password> http://<jenkins.server>/restart
$ curl -X POST -u <user>:<password> http://<jenkins.server>/safeRestart
$ curl -X POST -u <user>:<password> http://<jenkins.server>/exit
$ curl -X POST -u <user>:<password> http://<jenkins.server>/safeExit
$ curl -X POST -u <user>:<password> http://<jenkins.server>/quietDown
$ curl -X POST -u <user>:<password> http://<jenkins.server>/cancelQuietDown
```

### **Jenkins CLI**

```bash
$ java -jar jenkins-cli.jar -s http://<jenkins-server>/ restart
$ java -jar jenkins-cli.jar -s http://<jenkins-server>/ safe-restart
$ java -jar jenkins-cli.jar -s http://<jenkins-server>/ shutdown
$ java -jar jenkins-cli.jar -s http://<jenkins-server>/ safe-shutdown
$ java -jar jenkins-cli.jar -s http://<jenkins-server>/ quiet-down
$ java -jar jenkins-cli.jar -s http://<jenkins-server>/ cancel-quiet-down
```

### **Unix-based**

```bash
$ sudo service jenkins restart
$ sudo service jenkins stop
$ sudo service jenkins start
```

```bash
$ sudo /etc/init.d/jenkins start
$ sudo /etc/init.d/jenkins stop
$ sudo /etc/init.d/jenkins restart
# Or in the latest distribution of Linux:
$ sudo systemctl start jenkins.service
$ sudo systemctl stop jenkins.service
$ sudo systemctl restart jenkins.service
```

### **Tomcat**

```bash
# Tomcat as a Unix service:
$ service tomcat7 start
$ service tomcat7 stop
$ service tomcat7 restart

# Tomcat as a Windows service:
$ <tomcat.home>/bin/Tomcat.exe start
$ <tomcat.home>/bin/Tomcat.exe stop

# Tomcat running Mac/Linux/Unix binaries:
$ $CATALINA_HOME/bin/startup.sh
$ $CATALINA_HOME/bin/shutdown.sh

# Tomcat running Windows binaries:
$ %CATALINA_HOME%\bin\startup.bat
$ %CATALINA_HOME%\bin\shutdown.bat

# Tomcat 7+:
http://<tomcat-server>:8080/manager/text/stop?path=/jenkins
http://<tomcat-server>:8080/manager/text/start?path=/jenkins
http://<tomcat-server>:8080/manager/text/reload?path=/jenkins
```

### **Stand-Alone**

```bash
$ java -cp $JENKINS_HOME/war/winstone.jar winstone.tools.WinstoneControl reload: --host=localhost --port=8001
$ java -cp $JENKINS_HOME/war/winstone.jar winstone.tools.WinstoneControl shutdown: --host=localhost --port=8001

# start jenkins with control port
$ java -DJENKINS_HOME=/path/to/home -jar jenkins.war --controlPort=8001
```
