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

<<<<<<< HEAD
## POST 小组添加

POST /team/add

> Body 请求参数

```json
{
  "name": "生化小组",
  "phone": "5080",
  "note": "注释",
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |名称|
|» phone|body|string| 是 |none|
|» note|body|string| 是 |none|
|» status|body|[状态](#schema状态)| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» status|0|
|» status|1|
|» status|2|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "生化小组",
    "phone": "5080",
    "note": "注释"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|

## GET 小组列出

GET /team/show

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pageSize|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 6,
      "name": "生化小组",
      "phone": "5080",
      "note": "注释",
      "status": 0
    },
    {
      "id": 5,
      "name": "生化小组",
      "phone": "5080",
      "note": "注释",
      "status": 0
    },
    {
      "id": 4,
      "name": "生化小组",
      "phone": "5080",
      "note": "注释",
      "status": 0
    },
    {
      "id": 3,
      "name": "生化小组",
      "phone": "5080",
      "note": "注释",
      "status": 0
    },
    {
      "id": 1,
      "name": "免疫小组",
      "phone": "052 2037 4386",
      "note": "ullamco labore ut",
      "status": 0
    }
  ],
  "meta": {
    "total": 5,
    "pageSize": 10,
    "page": "1",
    "totalPage": 1
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
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|»» status|integer|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» page|string|true|none||none|
|»» totalPage|integer|true|none||none|

## PUT 小组修改

PUT /team/update

> Body 请求参数

```json
{
  "id": 1,
  "name": "免疫小组",
  "phone": "052 2037 4386",
  "note": "ullamco labore ut",
  "status": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 否 |ID 编号|
|» name|body|string| 是 |名称|
|» phone|body|string| 是 |none|
|» note|body|string| 是 |none|
|» status|body|[状态](#schema状态)| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» status|0|
|» status|1|
|» status|2|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "免疫小组",
    "phone": "052 2037 4386",
    "note": "ullamco labore ut",
    "status": 0
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
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|»» status|integer|true|none||none|

## PUT 小组删除

PUT /team/del

> Body 请求参数

```json
{
  "id": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 否 |ID 编号|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "生化小组",
    "phone": "5080",
    "note": "注释",
    "status": 2
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
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|»» status|integer|true|none||none|

## POST 增加用户

POST /user/add

> Body 请求参数

```json
{
  "userName": "汪蒙",
  "passWord": "eTUQMhNVpjOk2hQ",
  "teamId": 1,
  "role": 0
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» userName|body|string| 是 |none|
|» passWord|body|string| 是 |none|
|» teamId|body|integer| 是 |none|
|» role|body|integer| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|» role|0|
|» role|1|
|» role|2|
|» role|3|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "userName": "党萍",
    "passWord": "*",
    "role": 0,
    "status": 0,
    "teamId": 1,
    "teamName": "免疫小组"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|none|Inline|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» userName|string|true|none||none|
|»» passWord|string|true|none||none|
|»» role|integer|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» teamName|string|true|none||none|

## GET 用户列出

GET /user/show

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pageSize|query|integer| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 3,
      "userName": "党萍",
      "role": 0,
      "status": 0,
      "teamId": 1,
      "teamName": "免疫小组"
    },
    {
      "id": 2,
      "userName": "党萍",
      "role": 0,
      "status": 0,
      "teamId": 1,
      "teamName": "免疫小组"
    },
    {
      "id": 1,
      "userName": "admin",
      "role": 3,
      "status": 0,
      "teamId": 1,
      "teamName": "免疫小组"
    }
  ],
  "meta": {
    "total": 3,
    "page": 1,
    "pageSize": 10,
    "totalPage": 1
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
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» userName|string|true|none||none|
|»» role|integer|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» teamName|string|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

## PUT 修改用户

PUT /user/update

> Body 请求参数

```json
{
  "id": 1,
  "userName": "admin",
  "passWord": "123456",
  "teamId": 1,
  "role": 0,
  "status": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 是 |none|
|» userName|body|string| 是 |none|
|» passWord|body|string| 是 |none|
|» teamId|body|number| 是 |none|
|» role|body|[用户身份](#schema用户身份)| 是 |none|
|» status|body|[状态](#schema状态)| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» role|0|
|» role|1|
|» role|2|
|» role|3|
|» status|0|
|» status|1|
|» status|2|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userName": "admin",
    "passWord": "*",
    "role": 0,
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
|»» passWord|string|true|none||none|
|»» role|integer|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» teamName|string|true|none||none|

=======
>>>>>>> dev-ts
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

