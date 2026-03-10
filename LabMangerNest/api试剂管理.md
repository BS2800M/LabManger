---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 默认模块

Base URLs:

# Authentication

* API Key (session)
    - Parameter Name: **sessionid**, in: header. 

# 需要鉴权

## PUT 删除用户

PUT /user/del

> Body 请求参数

```json
{
  "id": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userName": "律桂英",
    "role": 1,
    "status": 2,
    "teamId": 1,
    "teamName": "免疫小组"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» userName|string|true|none||none|
|»» role|integer|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» teamName|string|true|none||none|

# 数据模型

