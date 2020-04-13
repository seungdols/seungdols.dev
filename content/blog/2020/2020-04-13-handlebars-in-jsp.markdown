---
layout: post
title: "handlebars의 삽질, JSP속에서"
description: "JSP와 handlebars 이야기"
date: 2020-04-13 22:00:00
category: programming
tags: [jsp, handlebars]
comments: true
---
  
`JSP` 상에서 `handlebars`를 사용할 때, `Controller`에서 `ModelAttribute` 넘겨줄 시에, 데이터로 사용 할 값은 그냥 오브젝트 넘겨줄 경우, 오브젝트 형태로 넘어가기 때문에, `handlebars`에서 데이터로 사용하기 어렵다. 

    [Category(id="asdfasdf", name="asdfasdf"), Category(id="asdfadf", name="asdfadf)]

위와 같이 오브젝트 타입까지 넘겨지게 된다. 그렇게 되면,`JSON.parse`를 통해 배열로 만들 수 없기 때문에, `JSON string`형태로 `controller`에서 넘겨주면 아래와 같이 사용할 수 있다. 

    modelMap.addAttribute("Categories", JsonUtils.write(categories));

위와 같이 넘기게 되면, 아래와 같이 데이터가 구성 된다. 

    [{id="asdfasdf", name="asdfasdf"}, {id="asdfasdf", name="asdfasdf"}]

그럼 아래처럼 `JSON.parse`를 이용해 `string -> object` 형태로 바꿔 주면 된다.

    var data = {
                  Categories: '${CategoriesJson}'
                };
    
    console.log(typeof data.Categories);
    console.log(JSON.parse(data.Categories));
    
왜 이걸 모르고 있었나... 한심하구나...
