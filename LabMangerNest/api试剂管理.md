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
|Authorization|header|string| 否 |none|
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

## POST 试剂添加

POST /reagent/add

> Body 请求参数

```json
{
  "name": "ALT",
  "specifications": "盒",
  "warnNumber": 51,
  "price": 400,
  "storgeCondition": "do aliquip",
  "warnDays": 27,
  "status": true,
  "generateLot": false,
  "manufacturer": "迈瑞",
  "note": "注释"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |none|
|» specifications|body|string| 是 |none|
|» warnNumber|body|integer| 是 |none|
|» price|body|integer| 是 |none|
|» storgeCondition|body|string| 是 |none|
|» warnDays|body|integer| 是 |none|
|» status|body|boolean| 是 |none|
|» generateLot|body|boolean| 是 |none|
|» manufacturer|body|string| 是 |none|
|» note|body|string| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "ALT",
    "specifications": "盒",
    "price": 400,
    "storageCondition": "",
    "manufacturer": "迈瑞",
    "note": "注释",
    "warnNumber": 51,
    "warnDays": 27,
    "createTime": "2026-03-05T03:20:12.105Z",
    "teamId": 1,
    "status": 0
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
|»» specifications|string|true|none||none|
|»» price|integer|true|none||none|
|»» storageCondition|string|true|none||none|
|»» manufacturer|string|true|none||none|
|»» note|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|»» warnDays|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» teamId|integer|true|none||none|
|»» status|integer|true|none||none|

## GET 试剂列出 

GET /reagent/show

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pageSize|query|integer| 否 |none|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "ALT",
      "specifications": "盒",
      "price": 400,
      "storageCondition": "",
      "manufacturer": "迈瑞",
      "note": "注释",
      "warnNumber": 51,
      "warnDays": 27,
      "createTime": "2026-03-05T03:06:46.146Z",
      "teamId": 1,
      "status": 0
    }
  ],
  "meta": {
    "total": 1,
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
|»» id|integer|false|none||none|
|»» name|string|false|none||none|
|»» specifications|string|false|none||none|
|»» price|integer|false|none||none|
|»» storageCondition|string|false|none||none|
|»» manufacturer|string|false|none||none|
|»» note|string|false|none||none|
|»» warnNumber|integer|false|none||none|
|»» warnDays|integer|false|none||none|
|»» createTime|string|false|none||none|
|»» teamId|integer|false|none||none|
|»» status|integer|false|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

## PUT 试剂修改

PUT /reagent/update

> Body 请求参数

```json
{
  "id": 1,
  "name": "ASO试剂",
  "specifications": "箱",
  "warnNumber": 3,
  "price": 1000,
  "storgeCondition": "dolore",
  "warnDays": 39,
  "status": 1,
  "manufacturer": "迈瑞",
  "note": "注释"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |Bearer {{token}}|
|body|body|object| 否 |none|
|» id|body|integer| 否 |ID 编号|
|» name|body|string| 是 |名称|
|» specifications|body|string| 是 |none|
|» warnNumber|body|integer| 是 |none|
|» price|body|integer| 是 |none|
|» storgeCondition|body|string| 是 |none|
|» warnDays|body|integer| 是 |none|
|» status|body|[状态](#schema状态)| 是 |none|
|» manufacturer|body|string| 是 |none|
|» note|body|string| 是 |none|

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
    "name": "ASO试剂",
    "specifications": "箱",
    "price": 1000,
    "storageCondition": "",
    "manufacturer": "迈瑞",
    "note": "注释",
    "warnNumber": 3,
    "warnDays": 39,
    "createTime": "2026-03-05T03:06:46.146Z",
    "teamId": 1,
    "status": 1
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
|»» specifications|string|true|none||none|
|»» price|integer|true|none||none|
|»» storageCondition|string|true|none||none|
|»» manufacturer|string|true|none||none|
|»» note|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|»» warnDays|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» teamId|integer|true|none||none|
|»» status|integer|true|none||none|

## PUT 试剂删除

PUT /reagent/del

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
    "id": 1,
    "name": "ASO试剂",
    "specifications": "箱",
    "price": 1000,
    "storageCondition": "",
    "manufacturer": "迈瑞",
    "note": "注释",
    "warnNumber": 3,
    "warnDays": 39,
    "createTime": "2026-03-05T03:06:46.146Z",
    "teamId": 1,
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
|»» specifications|string|true|none||none|
|»» price|integer|true|none||none|
|»» storageCondition|string|true|none||none|
|»» manufacturer|string|true|none||none|
|»» note|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|»» warnDays|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» teamId|integer|true|none||none|
|»» status|integer|true|none||none|

## POST 批号添加

POST /lot/add

> Body 请求参数

```json
{
  "name": "LOT10086",
  "reagentId": 1,
  "expirationDate": "2026-03-06 11:07:33",
  "status": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |名称|
|» reagentId|body|integer| 是 |none|
|» expirationDate|body|string(time)| 是 |none|
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
    "id": 1,
    "name": "LOT10086",
    "reagentId": 1,
    "expirationDate": "2026-03-06T03:07:33.000Z",
    "status": 0,
    "teamId": 1,
    "reagentName": "ASO试剂"
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
|»» reagentId|integer|true|none||none|
|»» expirationDate|string|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» reagentName|string|true|none||none|

## GET 批号列出

GET /lot/show

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
      "id": 1,
      "name": "LOT10086",
      "reagentId": 1,
      "expirationDate": "2026-03-06T03:07:33.000Z",
      "status": 0,
      "teamId": 1,
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      }
    }
  ],
  "meta": {
    "total": 1,
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
|»» id|integer|false|none||none|
|»» name|string|false|none||none|
|»» reagentId|integer|false|none||none|
|»» expirationDate|string|false|none||none|
|»» status|integer|false|none||none|
|»» teamId|integer|false|none||none|
|»» reagent|object|false|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

## PUT 批号修改

PUT /lot/update

> Body 请求参数

```json
{
  "id": 1,
  "name": "LOT修改后",
  "reagentId": 1,
  "expirationDate": "2026-03-06 01:00:09",
  "status": 1
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 是 |none|
|» name|body|string| 是 |名称|
|» reagentId|body|integer| 是 |none|
|» expirationDate|body|string| 是 |none|
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
    "name": "LOT修改后",
    "reagentId": 1,
    "expirationDate": "2026-03-05T17:00:09.000Z",
    "status": 1,
    "teamId": 1,
    "reagent": {
      "id": 1,
      "name": "ASO试剂"
    }
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
|»» reagentId|integer|true|none||none|
|»» expirationDate|string|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» reagent|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|

## PUT 批号删除

PUT /lot/del

> Body 请求参数

```json
{
  "id": 3
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
    "id": 3,
    "name": "LOT10086",
    "reagentId": 1,
    "expirationDate": "2026-03-06T03:07:33.000Z",
    "status": 2,
    "teamId": 1,
    "reagent": {
      "id": 1,
      "name": "ASO试剂",
      "specifications": "箱",
      "price": 1000,
      "storageCondition": "",
      "manufacturer": "迈瑞",
      "note": "注释",
      "warnNumber": 3,
      "warnDays": 39,
      "createTime": "2026-03-05T03:06:46.146Z",
      "teamId": 1,
      "status": 1
    },
    "reagentName": "ASO试剂"
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
|»» reagentId|integer|true|none||none|
|»» expirationDate|string|true|none||none|
|»» status|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» reagent|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» specifications|string|true|none||none|
|»»» price|integer|true|none||none|
|»»» storageCondition|string|true|none||none|
|»»» manufacturer|string|true|none||none|
|»»» note|string|true|none||none|
|»»» warnNumber|integer|true|none||none|
|»»» warnDays|integer|true|none||none|
|»»» createTime|string|true|none||none|
|»»» teamId|integer|true|none||none|
|»»» status|integer|true|none||none|
|»» reagentName|string|true|none||none|

## GET 试剂所有列出

GET /reagent/showAll

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "ALT"
    },
    {
      "id": 3,
      "name": "ALT"
    }
  ]
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
|»» id|integer|true|none||ID 编号|
|»» name|string|true|none||名称|

## GET 批号所有列出

GET /lot/showAll

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentId|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "LOT10086"
    },
    {
      "id": 3,
      "name": "LOT10086"
    }
  ]
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
|»» id|integer|true|none||ID 编号|
|»» name|string|true|none||名称|

## POST 入库

POST /operation/inbound

> Body 请求参数

```json
{
  "inboundList": [
    {
      "reagentId": 1,
      "lotId": 1,
      "number": 63,
      "note": "magna aliqua consequat"
    },
    {
      "reagentId": 1,
      "lotId": 1,
      "number": 26,
      "note": "labore consectetur"
    },
    {
      "reagentId": 1,
      "lotId": 2,
      "number": 50,
      "note": "in pariatur sed nisi proident"
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» inboundList|body|[object]| 是 |none|
|»» reagentId|body|integer| 否 |none|
|»» lotId|body|integer| 否 |none|
|»» number|body|integer| 否 |none|
|»» note|body|string| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "messages": [
      "ASO试剂库存更新成功",
      "ASO试剂库存更新成功",
      "ASO试剂库存更新成功"
    ]
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
|»» messages|[string]|true|none||none|

## POST 出库

POST /operation/outbound

> Body 请求参数

```json
{
  "barcodeNumber": "10001"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» barcodeNumber|body|string| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "status": 1,
    "message": "该条码已经出库"
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
|»» status|integer|true|none||none|
|»» message|string|true|none||none|

## POST 特殊出库

POST /operation/specialOutbound

> Body 请求参数

```json
{
  "outboundList": [
    {
      "reagentId": 1,
      "lotId": 1,
      "number": 10,
      "note": "eu exercitation dolore adipisicing Duis"
    },
    {
      "reagentId": 1,
      "lotId": 1,
      "number": 10,
      "note": "id in quis eiusmod"
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» outboundList|body|[object]| 是 |none|
|»» reagentId|body|integer| 否 |none|
|»» lotId|body|integer| 否 |none|
|»» number|body|integer| 否 |none|
|»» note|body|string| 是 |none|

> 返回示例

```json
{
  "success": true,
  "data": {
    "messages": [
      "ASO试剂库存更新成功",
      "ASO试剂库存更新成功"
    ]
  }
}
```

```json
{
  "status": 0,
  "msg": "出库成功"
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
|»» messages|[string]|true|none||none|

## PUT 操作修改

PUT /operation/update

> Body 请求参数

```json
{
  "id": 82,
  "reagentId": 1,
  "lotId": 1,
  "createTime": "2025-11-12 15:34:57",
  "action": 2,
  "note": "dolore aute"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |Bearer {{token}}|
|body|body|object| 否 |none|
|» id|body|integer| 是 |ID 编号|
|» reagentId|body|integer| 是 |none|
|» lotId|body|integer| 是 |none|
|» createTime|body|string| 是 |none|
|» action|body|[操作状态](#schema操作状态)| 是 |none|
|» note|body|string| 是 |none|

#### 枚举值

|属性|值|
|---|---|
|» action|0|
|» action|1|
|» action|2|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": 82,
    "reagentId": 1,
    "lotId": 1,
    "userId": 1,
    "teamId": 1,
    "createTime": "2025-11-12T07:34:57.000Z",
    "barcodeNumber": "",
    "action": 2,
    "note": "dolore aute",
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
|»» reagentId|integer|true|none||none|
|»» lotId|integer|true|none||none|
|»» userId|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» barcodeNumber|string|true|none||none|
|»» action|integer|true|none||none|
|»» note|string|true|none||none|
|»» status|integer|true|none||none|

## PUT 操作删除

PUT /operation/del

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
    "reagentId": 1,
    "lotId": 1,
    "userId": 1,
    "teamId": 1,
    "createTime": "2026-03-05T03:38:58.894Z",
    "barcodeNumber": "100002",
    "action": 1,
    "note": "magna aliqua consequat",
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
|»» reagentId|integer|true|none||none|
|»» lotId|integer|true|none||none|
|»» userId|integer|true|none||none|
|»» teamId|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» barcodeNumber|string|true|none||none|
|»» action|integer|true|none||none|
|»» note|string|true|none||none|
|»» status|integer|true|none||none|

## GET 操作列出

GET /operation/show

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentName|query|string| 否 |none|
|startTime|query|string(date-time)| 否 |none|
|endTime|query|string(date-time)| 否 |none|
|page|query|integer| 否 |none|
|pageSize|query|integer| 否 |none|
|barcodeNumber|query|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": [
    {
      "id": 331,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100331",
      "action": 2
    },
    {
      "id": 330,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100330",
      "action": 2
    },
    {
      "id": 329,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100329",
      "action": 2
    },
    {
      "id": 328,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100328",
      "action": 2
    },
    {
      "id": 327,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100327",
      "action": 2
    },
    {
      "id": 326,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100326",
      "action": 2
    },
    {
      "id": 325,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100325",
      "action": 2
    },
    {
      "id": 324,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100324",
      "action": 2
    },
    {
      "id": 323,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100323",
      "action": 2
    },
    {
      "id": 322,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100322",
      "action": 2
    }
  ],
  "meta": {
    "total": 330,
    "page": 1,
    "pageSize": 10,
    "totalPage": 33
  }
}
```

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 5,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000005",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 4,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000004",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 3,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000003",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 2,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000002",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 1,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000001",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    }
  ],
  "total": 5,
  "page": 1,
  "pagesize": 10
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
|»» createTime|string|true|none||none|
|»» reagent|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» lot|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» user|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» userName|string|true|none||none|
|»» note|string|true|none||none|
|»» barcodeNumber|string|true|none||none|
|»» action|integer|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

## GET 统计列出

GET /inventory/show

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |none|
|pageSize|query|number| 否 |none|
|name|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 2,
        "name": "LOT10086",
        "expirationDate": "2026-03-06T03:07:33.000Z"
      },
      "teamId": 1,
      "number": 88
    },
    {
      "id": 1,
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后",
        "expirationDate": "2026-03-05T17:00:09.000Z"
      },
      "teamId": 1,
      "number": 147
    }
  ],
  "meta": {
    "total": 2,
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
|»» reagent|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» lot|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» expirationDate|string|true|none||none|
|»» teamId|integer|true|none||none|
|»» number|integer|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

## POST 重新计算所有库存

POST /inventory/auditAll

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "message": "库存修正完成"
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
|»» message|string|true|none||none|

## GET 库存统计图

GET /inventory/statistics

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentId|query|integer| 否 |none|
|lotId|query|integer| 否 |none|
|intervalDay|query|integer| 否 |none|
|startTime|query|string| 否 |none|
|endTime|query|string| 否 |none|
|onlyLot|query|boolean| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "xAxisLabels": [
      "2026-03-03T05:04:04.000Z",
      "2026-03-04T05:04:04.000Z",
      "2026-03-05T05:04:04.000Z"
    ],
    "dataSet": [
      {
        "name": "库存",
        "number": [
          0,
          236,
          236
        ]
      },
      {
        "name": "入库",
        "number": [
          0,
          283,
          0
        ]
      },
      {
        "name": "出库",
        "number": [
          0,
          47,
          0
        ]
      }
    ]
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
|»» xAxisLabels|[string]|true|none||none|
|»» dataSet|[object]|true|none||none|
|»»» name|string|true|none||none|
|»»» number|[integer]|true|none||none|

## GET 操作表格导出

GET /operation/showAll

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentName|query|string| 否 |none|
|startTime|query|string(date-time)| 否 |none|
|endTime|query|string(date-time)| 否 |none|
|page|query|integer| 否 |none|
|pageSize|query|integer| 否 |none|
|barcodeNumber|query|string| 否 |none|

> 返回示例

```json
{
  "success": true,
  "data": [
    {
      "id": 331,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100331",
      "action": 2
    },
    {
      "id": 330,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100330",
      "action": 2
    },
    {
      "id": 329,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100329",
      "action": 2
    },
    {
      "id": 328,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100328",
      "action": 2
    },
    {
      "id": 327,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100327",
      "action": 2
    },
    {
      "id": 326,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100326",
      "action": 2
    },
    {
      "id": 325,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100325",
      "action": 2
    },
    {
      "id": 324,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100324",
      "action": 2
    },
    {
      "id": 323,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100323",
      "action": 2
    },
    {
      "id": 322,
      "createTime": "2026-03-05T03:49:04.303Z",
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后"
      },
      "user": {
        "id": 1,
        "userName": "admin"
      },
      "note": "id in quis eiusmod",
      "barcodeNumber": "100322",
      "action": 2
    }
  ],
  "meta": {
    "total": 330,
    "page": 1,
    "pageSize": 10,
    "totalPage": 33
  }
}
```

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 5,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000005",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 4,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000004",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 3,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000003",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 2,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000002",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    },
    {
      "id": 1,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "1000001",
      "operation_action": "inbound",
      "using": true,
      "userid": 2,
      "username": "宰国芳"
    }
  ],
  "total": 5,
  "page": 1,
  "pagesize": 10
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
|»» createTime|string|true|none||none|
|»» reagent|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» lot|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» user|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» userName|string|true|none||none|
|»» note|string|true|none||none|
|»» barcodeNumber|string|true|none||none|
|»» action|integer|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

## GET 统计表格导出

GET /inventory/showAll

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |none|
|pageSize|query|number| 否 |none|
|name|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 2,
        "name": "LOT10086",
        "expirationDate": "2026-03-06T03:07:33.000Z"
      },
      "teamId": 1,
      "number": 88
    },
    {
      "id": 1,
      "reagent": {
        "id": 1,
        "name": "ASO试剂"
      },
      "lot": {
        "id": 1,
        "name": "LOT修改后",
        "expirationDate": "2026-03-05T17:00:09.000Z"
      },
      "teamId": 1,
      "number": 147
    }
  ],
  "meta": {
    "total": 2,
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
|»» reagent|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»» lot|object|true|none||none|
|»»» id|integer|true|none||none|
|»»» name|string|true|none||none|
|»»» expirationDate|string|true|none||none|
|»» teamId|integer|true|none||none|
|»» number|integer|true|none||none|
|» meta|object|true|none||none|
|»» total|integer|true|none||none|
|»» page|integer|true|none||none|
|»» pageSize|integer|true|none||none|
|»» totalPage|integer|true|none||none|

# 登录登出

## POST 登录

POST /auth/signin

> Body 请求参数

```json
{
  "username": "admin",
  "password": ""
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» userName|body|string| 是 |none|
|» passWord|body|string| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "userName": "admin",
    "teamName": "初始小组",
    "sessionId": "0c59f21f3fdf4394ac8473fa1eab8bb8",
    "role": 3
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
|»» userName|string|true|none||none|
|»» teamName|string|true|none||none|
|»» sessionId|string|true|none||none|
|»» role|integer|true|none||none|

## GET 登出

GET /auth/signout

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
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
|»» status|integer|true|none||none|

# 数据模型

<h2 id="tocS_状态">状态</h2>

<a id="schema状态"></a>
<a id="schema_状态"></a>
<a id="tocS状态"></a>
<a id="tocs状态"></a>

```json
0

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|integer|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|

<h2 id="tocS_用户身份">用户身份</h2>

<a id="schema用户身份"></a>
<a id="schema_用户身份"></a>
<a id="tocS用户身份"></a>
<a id="tocs用户身份"></a>

```json
0

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|integer|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|
|*anonymous*|3|

<h2 id="tocS_操作状态">操作状态</h2>

<a id="schema操作状态"></a>
<a id="schema_操作状态"></a>
<a id="tocS操作状态"></a>
<a id="tocs操作状态"></a>

```json
0

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|*anonymous*|integer|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|*anonymous*|0|
|*anonymous*|1|
|*anonymous*|2|

