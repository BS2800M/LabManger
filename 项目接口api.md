---
title: c# 改版
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

# c# 改版

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer

- HTTP Authentication, scheme: bearer

# 需要鉴权

## POST 小组添加

POST /team/add/

> Body 请求参数

```json
{
  "name": "生化小组",
  "phone": "5080",
  "note": "注释",
  "active": true
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
|» active|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": {
    "id": 3,
    "name": "生化小组",
    "phone": "5080",
    "note": "注释",
    "active": true
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|»» active|boolean|true|none||none|

## GET 小组列出

GET /team/show/

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": [
    {
      "id": 3,
      "name": "生化小组",
      "phone": "5080",
      "note": "注释",
      "active": true
    },
    {
      "id": 2,
      "name": "临建小组",
      "phone": "052 2037 4386",
      "note": "ullamco labore ut",
      "active": true
    },
    {
      "id": 1,
      "name": "生化小组",
      "phone": "052 2037 4386",
      "note": "ullamco labore ut",
      "active": true
    }
  ],
  "totalPage": 1,
  "totalCount": 3
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|»» active|boolean|true|none||none|
|» totalPage|integer|true|none||none|
|» totalCount|integer|true|none||none|

## PUT 小组修改

PUT /team/update/

> Body 请求参数

```json
{
  "id": 1,
  "name": "免疫小组",
  "phone": "052 2037 4386",
  "note": "ullamco labore ut",
  "using": true
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
|» using|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": {
    "id": 1,
    "name": "免疫小组",
    "phone": "5084",
    "note": "修改后",
    "active": true
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|»» active|boolean|true|none||none|

## PUT 小组删除

PUT /team/del/

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
  "status": 0,
  "message": "成功"
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|

## POST 增加用户

POST /user/add/

> Body 请求参数

```json
{
  "username": "宰国芳",
  "password": "10086",
  "permission": "officia adipisicing ut fugiat ut"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|
|» teamid|body|integer| 是 |none|
|» role|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": {
    "id": 2,
    "userName": "管理员",
    "passWord": "*",
    "role": "admin",
    "active": true,
    "teamId": 1
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
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» userName|string|true|none||none|
|»» passWord|string|true|none||none|
|»» role|string|true|none||none|
|»» active|boolean|true|none||none|
|»» teamId|integer|true|none||none|

## GET 用户列出

GET /user/show/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "userName": "管理员2",
      "teamId": 0,
      "role": "admin",
      "teamName": "免疫小组"
    }
  ],
  "totalPage": 1,
  "totalCount": 1
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
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|false|none||none|
|»» userName|string|false|none||none|
|»» teamId|integer|false|none||none|
|»» role|string|false|none||none|
|»» teamName|string|false|none||none|
|» totalPage|integer|true|none||none|
|» totalCount|integer|true|none||none|

## PUT 修改用户

PUT /user/update/

> Body 请求参数

```json
{
  "id": 1,
  "username": "admin",
  "password": "10086",
  "teamid": 1,
  "role": "admin",
  "active": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 是 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|
|» teamid|body|number| 是 |none|
|» role|body|string| 是 |none|
|» active|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": {
    "id": 1,
    "userName": "管理员2",
    "passWord": "*",
    "role": "admin",
    "active": true,
    "teamId": 1
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
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» userName|string|true|none||none|
|»» passWord|string|true|none||none|
|»» role|string|true|none||none|
|»» active|boolean|true|none||none|
|»» teamId|integer|true|none||none|

## PUT 删除用户

PUT /user/del/

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
  "status": 0,
  "message": "成功"
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
|» status|integer|true|none||none|
|» message|string|true|none||none|

## POST 试剂添加

POST /reagent/add/

> Body 请求参数

```json
{
  "name": "ALT",
  "specifications": "盒",
  "warnnumber": 0,
  "price": 400,
  "storagecondition": "2-8度",
  "warndays": 1,
  "active": true,
  "generatelot": true,
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
|» warnnumber|body|integer| 是 |none|
|» price|body|integer| 是 |none|
|» storgecondition|body|string| 是 |none|
|» warndays|body|integer| 是 |none|
|» active|body|boolean| 是 |none|
|» generatelot|body|boolean| 是 |none|
|» manufacturer|body|string| 是 |none|
|» note|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "添加成功",
  "data": {
    "id": 9,
    "name": "ALT",
    "specifications": "盒",
    "price": 400,
    "storgeCondition": "2-8度",
    "active": true,
    "manufacturer": "迈瑞",
    "note": "注释",
    "warnNumber": 0,
    "warnDays": 1,
    "createTime": "2025-08-17T12:36:29.3030882+08:00",
    "teamId": 1
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» specifications|string|true|none||none|
|»» price|integer|true|none||none|
|»» storgeCondition|string|true|none||none|
|»» active|boolean|true|none||none|
|»» manufacturer|string|true|none||none|
|»» note|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|»» warnDays|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» teamId|integer|true|none||none|

## GET 试剂列出 

GET /reagent/show/

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "查询成功",
  "data": [
    {
      "id": 10,
      "name": "ALT",
      "specifications": "盒",
      "price": 400,
      "storgeCondition": "2-8度",
      "active": true,
      "manufacturer": "迈瑞",
      "note": "注释",
      "warnNumber": 0,
      "warnDays": 1,
      "createTime": "2025-08-17T12:36:58.4946594",
      "teamId": 1
    },
    {
      "id": 9,
      "name": "ALT",
      "specifications": "盒",
      "price": 400,
      "storgeCondition": "2-8度",
      "active": true,
      "manufacturer": "迈瑞",
      "note": "注释",
      "warnNumber": 0,
      "warnDays": 1,
      "createTime": "2025-08-17T12:36:29.3030882",
      "teamId": 1
    },
    {
      "id": 8,
      "name": "ALP",
      "specifications": "盒",
      "price": 400,
      "storgeCondition": "",
      "active": true,
      "manufacturer": "",
      "note": "",
      "warnNumber": 0,
      "warnDays": 0,
      "createTime": "2025-08-13T21:44:00.0800961",
      "teamId": 1
    },
    {
      "id": 7,
      "name": "ALT",
      "specifications": "盒",
      "price": 400,
      "storgeCondition": "",
      "active": true,
      "manufacturer": "",
      "note": "",
      "warnNumber": 0,
      "warnDays": 0,
      "createTime": "2025-08-13T20:51:22.8495192",
      "teamId": 1
    }
  ],
  "totalPage": 1,
  "totalCount": 4
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» specifications|string|true|none||none|
|»» price|integer|true|none||none|
|»» storgeCondition|string|true|none||none|
|»» active|boolean|true|none||none|
|»» manufacturer|string|true|none||none|
|»» note|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|»» warnDays|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» teamId|integer|true|none||none|
|» totalPage|integer|true|none||none|
|» totalCount|integer|true|none||none|

## PUT 试剂修改

PUT /reagent/update/

> Body 请求参数

```json
{
  "id": 9,
  "name": "ASO试剂",
  "specifications": "箱",
  "warnnumber": 0,
  "price": 1000,
  "storageCondition": "常温28",
  "warn_days": 0,
  "active": true,
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
|» warnnumber|body|integer| 是 |none|
|» price|body|integer| 是 |none|
|» StorgeCondition|body|string| 是 |none|
|» warn_days|body|integer| 是 |none|
|» active|body|boolean| 是 |none|
|» manufacturer|body|string| 是 |none|
|» note|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "更新成功",
  "data": {
    "id": 10,
    "name": "ASO试剂",
    "specifications": "箱",
    "price": 1000,
    "storgeCondition": "常温",
    "active": true,
    "manufacturer": "迈瑞",
    "note": "注释",
    "warnNumber": 0,
    "warnDays": 0,
    "createTime": "2025-08-17T12:39:58.6364337+08:00",
    "teamId": 1
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» specifications|string|true|none||none|
|»» price|integer|true|none||none|
|»» storgeCondition|string|true|none||none|
|»» active|boolean|true|none||none|
|»» manufacturer|string|true|none||none|
|»» note|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|»» warnDays|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» teamId|integer|true|none||none|

## PUT 试剂删除

PUT /reagent/del/

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
  "status": 0,
  "message": "删除成功"
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|

## POST 批号添加

POST /lot/add/

> Body 请求参数

```json
{
  "name": "LOT10086",
  "reagentid": 10,
  "expirationdate": "2025-09-05T15:12:32.540Z",
  "active": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |名称|
|» reagentid|body|integer| 是 |none|
|» expirationdate|body|string(time)| 是 |none|
|» active|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "添加成功",
  "data": {
    "id": 9,
    "name": "LOT10086",
    "reagentId": 10,
    "expirationDate": "2025-09-05T15:12:32.54Z",
    "active": true,
    "teamId": 1,
    "reagent": null
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» reagentId|integer|true|none||none|
|»» expirationDate|string|true|none||none|
|»» active|boolean|true|none||none|
|»» teamId|integer|true|none||none|
|»» reagent|null|true|none||none|

## GET 批号列出

GET /lot/show/

> Body 请求参数

```json
{
  "name": "LOT10086",
  "reagentid": 1,
  "expiration_date": "2025-06-05T15:12:32.540Z",
  "using": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|name|query|string| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "查询成功",
  "data": [
    {
      "id": 9,
      "name": "LOT10086",
      "reagentId": 10,
      "expirationDate": "2025-09-05T15:12:32.54",
      "active": true,
      "teamId": 1,
      "reagentName": "ASO试剂"
    },
    {
      "id": 8,
      "name": "LOT10086",
      "reagentId": 10,
      "expirationDate": "2028-08-17T12:52:13.5103772",
      "active": true,
      "teamId": 1,
      "reagentName": "ASO试剂"
    },
    {
      "id": 7,
      "name": "默认ALT",
      "reagentId": 10,
      "expirationDate": "2026-06-17T12:36:58.5261165",
      "active": true,
      "teamId": 1,
      "reagentName": "ASO试剂"
    },
    {
      "id": 6,
      "name": "默认ALT",
      "reagentId": 9,
      "expirationDate": "2026-06-17T12:36:29.3636027",
      "active": true,
      "teamId": 1,
      "reagentName": "ALT"
    },
    {
      "id": 5,
      "name": "默认ALP",
      "reagentId": 8,
      "expirationDate": "2026-06-13T21:44:00.1168708",
      "active": true,
      "teamId": 1,
      "reagentName": "ALP"
    },
    {
      "id": 4,
      "name": "默认ALT",
      "reagentId": 7,
      "expirationDate": "2026-06-13T20:51:22.8652506",
      "active": true,
      "teamId": 1,
      "reagentName": "ALT"
    }
  ],
  "totalPage": 1,
  "totalCount": 6
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» reagentId|integer|true|none||none|
|»» expirationDate|string|true|none||none|
|»» active|boolean|true|none||none|
|»» teamId|integer|true|none||none|
|»» reagentName|string|true|none||none|
|» totalPage|integer|true|none||none|
|» totalCount|integer|true|none||none|

## PUT 批号修改

PUT /lot/update/

> Body 请求参数

```json
{
  "id": 1,
  "name": "LOT修改后",
  "reagentid": 1,
  "expiration_date": "2025-06-05T15:12:32.540Z",
  "using": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 是 |none|
|» name|body|string| 是 |名称|
|» reagentid|body|integer| 是 |none|
|» expirationdate|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "更新成功",
  "data": {
    "id": 9,
    "name": "LOT修改后",
    "reagentId": 20,
    "expirationDate": "2025-06-05T15:12:32.54Z",
    "active": true,
    "teamId": 1,
    "reagent": null
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» reagentId|integer|true|none||none|
|»» expirationDate|string|true|none||none|
|»» active|boolean|true|none||none|
|»» teamId|integer|true|none||none|
|»» reagent|null|true|none||none|

## PUT 批号删除

PUT /lot/del/

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
  "status": 0,
  "message": "删除成功"
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|

## GET 试剂所有列出

GET /reagent/showall/

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
  "status": 0,
  "message": "查询成功",
  "data": [
    {
      "id": 10,
      "name": "ASO试剂"
    },
    {
      "id": 9,
      "name": "ALT"
    },
    {
      "id": 8,
      "name": "ALP"
    },
    {
      "id": 7,
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||ID 编号|
|»» name|string|true|none||名称|

## GET 批号所有列出

GET /lot/showall/

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentid|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "查询成功",
  "data": [
    {
      "id": 8,
      "name": "LOT10086"
    },
    {
      "id": 7,
      "name": "默认ALT"
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||ID 编号|
|»» name|string|true|none||名称|

## POST 入库

POST /operation/inbound/

> Body 请求参数

```json
{
  "inboundlist": [
    {
      "reagentid": 10,
      "lotid": 9,
      "number": 5,
      "note": "注释"
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» inboundlist|body|[object]| 是 |none|
|»» reagentid|body|integer| 否 |none|
|»» lotid|body|integer| 否 |none|
|»» number|body|integer| 否 |none|
|»» note|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 1,
  "message": [
    "ASO试剂库存更新成功"
  ],
  "data": [
    {
      "id": 403,
      "reagentName": "ASO试剂",
      "lotname": "LOT修改后",
      "note": "注释",
      "barcodeNumber": "100402",
      "userName": "管理员2",
      "action": "inbound"
    },
    {
      "id": 404,
      "reagentName": "ASO试剂",
      "lotname": "LOT修改后",
      "note": "注释",
      "barcodeNumber": "100403",
      "userName": "管理员2",
      "action": "inbound"
    },
    {
      "id": 405,
      "reagentName": "ASO试剂",
      "lotname": "LOT修改后",
      "note": "注释",
      "barcodeNumber": "100404",
      "userName": "管理员2",
      "action": "inbound"
    },
    {
      "id": 406,
      "reagentName": "ASO试剂",
      "lotname": "LOT修改后",
      "note": "注释",
      "barcodeNumber": "100405",
      "userName": "管理员2",
      "action": "inbound"
    },
    {
      "id": 407,
      "reagentName": "ASO试剂",
      "lotname": "LOT修改后",
      "note": "注释",
      "barcodeNumber": "100406",
      "userName": "管理员2",
      "action": "inbound"
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
|» status|integer|true|none||状态|
|» message|[string]|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» reagentName|string|true|none||none|
|»» lotname|string|true|none||none|
|»» note|string|true|none||none|
|»» barcodeNumber|string|true|none||none|
|»» userName|string|true|none||none|
|»» action|string|true|none||none|

## POST 出库

POST /operation/outbound/

> Body 请求参数

```json
{
  "barcodenumber": "1000070"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» barcodenumber|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 1,
  "message": "ASO试剂库存更新成功"
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|

## POST 特殊出库

POST /operation/special_outbound/

> Body 请求参数

```json
{
  "outboundlist": [
    {
      "reagentid": 10,
      "lotid": 9,
      "number": 1
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» outboundlist|body|[object]| 是 |none|
|»» reagentid|body|integer| 否 |none|
|»» lotid|body|integer| 否 |none|
|»» number|body|integer| 否 |none|
|»» n|body|string| 是 |none|

> 返回示例

```json
{
  "status": 1,
  "message": [
    "ASO试剂库存更新成功"
  ]
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
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» status|integer|true|none||状态|
|» message|[string]|true|none||none|

## PUT 操作删除

PUT /operation/del/

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
  "status": 1,
  "message": "成功"
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
|» status|integer|true|none||状态|
|» message|string|true|none||none|

## GET 列出操作

GET /operation/show/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentname|query|string| 否 |none|
|starttime|query|string(date-time)| 否 |none|
|endtime|query|string(date-time)| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|
|barcodenumber|query|string| 否 |none|

> 返回示例

```json
{
  "status": 1,
  "message": "成功",
  "data": [
    {
      "id": 518,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100517",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 517,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100516",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 516,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100515",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 515,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100514",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 514,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100513",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 513,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100512",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 512,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100511",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 511,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100510",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 510,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100509",
      "userName": "管理员2",
      "action": "specialoutbound"
    },
    {
      "id": 509,
      "createTime": "2025-08-19T23:45:35.286",
      "reagentName": "90",
      "lotName": "122222",
      "note": "",
      "barcodeNumber": "100508",
      "userName": "管理员2",
      "action": "specialoutbound"
    }
  ],
  "totalPage": 13,
  "totalCount": 121
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
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» createTime|string|true|none||none|
|»» reagentName|string|true|none||none|
|»» lotName|string|true|none||none|
|»» note|string|true|none||none|
|»» barcodeNumber|string|true|none||none|
|»» userName|string|true|none||none|
|»» action|string|true|none||none|
|» totalPage|integer|true|none||none|
|» totalCount|integer|true|none||none|

## GET 统计列出

GET /inventory/show/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |none|
|pagesize|query|number| 否 |none|
|reagentname|query|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "查询成功",
  "data": [
    {
      "id": 9,
      "reagentName": "90",
      "lotName": "122222",
      "number": 1,
      "reagentWarnNumber": 0,
      "lotExpirationDate": "2025-08-21T15:59:59",
      "specifications": "",
      "warning": "",
      "warnNumber": 0
    },
    {
      "id": 8,
      "reagentName": "90",
      "lotName": "默认90",
      "number": 1,
      "reagentWarnNumber": 0,
      "lotExpirationDate": "2026-06-19T22:53:44.7688877",
      "specifications": "",
      "warning": "",
      "warnNumber": 0
    },
    {
      "id": 4,
      "reagentName": "ALT1",
      "lotName": "默认ALT",
      "number": 0,
      "reagentWarnNumber": 0,
      "lotExpirationDate": "2026-06-17T12:36:29.3636027",
      "specifications": "盒1",
      "warning": "number",
      "warnNumber": 0
    }
  ],
  "totalPage": 1,
  "totalCount": 3
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
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» reagentName|string|true|none||none|
|»» lotName|string|true|none||none|
|»» number|integer|true|none||none|
|»» reagentWarnNumber|integer|true|none||none|
|»» lotExpirationDate|string|true|none||none|
|»» specifications|string|true|none||none|
|»» warning|string|true|none||none|
|»» warnNumber|integer|true|none||none|
|» totalPage|integer|true|none||none|
|» totalCount|integer|true|none||none|

## PUT 验证库存

PUT /inventory/auditall/

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
  "status": 0,
  "message": "成功"
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
|» status|integer|true|none||none|
|» message|string|true|none||none|

## GET 主界面板子

GET /inventory/dashboard/

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "message": "成功",
  "data": {
    "totalNum": 2,
    "warningTotalNum": 0,
    "warningNumNum": 2,
    "warningExpNum": 0
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
|» status|integer|true|none||none|
|» message|string|true|none||none|
|» data|object|true|none||none|
|»» totalNum|integer|true|none||none|
|»» warningTotalNum|integer|true|none||none|
|»» warningNumNum|integer|true|none||none|
|»» warningExpNum|integer|true|none||none|

## GET 导出专用表格接口

GET /operation/show_exportToExcel/

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "reagentid": 160,
      "reagentname": "醋酸2",
      "storage_condition": "低温避光",
      "operationlist": [
        {
          "creation_time": "2025-06-14T17:07:17.715Z",
          "lotid": 300,
          "lotname": "LOT20200602636",
          "lotexpiration_date": "2024-11-19T19:13:48.159Z",
          "inventory_number": 60,
          "inbound_number": 60,
          "outbound_number": 0,
          "username": "测试用户"
        },
        {
          "creation_time": "2025-06-14T17:08:02.507Z",
          "lotid": 300,
          "lotname": "LOT20200602636",
          "lotexpiration_date": "2024-11-19T19:13:48.159Z",
          "inventory_number": 130,
          "inbound_number": 70,
          "outbound_number": 0,
          "username": "测试用户"
        }
      ]
    },
    {
      "reagentid": 196,
      "reagentname": "硝酸钠2",
      "storage_condition": "阴凉干燥",
      "operationlist": [
        {
          "creation_time": "2025-06-14T17:07:17.715Z",
          "lotid": 476,
          "lotname": "LOT20210719045",
          "lotexpiration_date": "2025-07-15T06:48:33.734Z",
          "inventory_number": 50,
          "inbound_number": 50,
          "outbound_number": 0,
          "username": "测试用户"
        }
      ]
    },
    {
      "reagentid": 258,
      "reagentname": "硫酸钼2",
      "storage_condition": "-80℃超低温",
      "operationlist": [
        {
          "creation_time": "2025-06-14T17:07:17.715Z",
          "lotid": 262,
          "lotname": "LOT20220515068",
          "lotexpiration_date": "2026-01-21T00:04:22.704Z",
          "inventory_number": 40,
          "inbound_number": 40,
          "outbound_number": 0,
          "username": "测试用户"
        }
      ]
    },
    {
      "reagentid": 289,
      "reagentname": "硝酸铪2",
      "storage_condition": "阴凉干燥",
      "operationlist": [
        {
          "creation_time": "2025-06-14T17:07:17.715Z",
          "lotid": 492,
          "lotname": "LOT20220717678",
          "lotexpiration_date": "2025-02-13T21:50:52.866Z",
          "inventory_number": 30,
          "inbound_number": 30,
          "outbound_number": 0,
          "username": "测试用户"
        }
      ]
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
|» status|integer|true|none||none|
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» reagentid|integer|true|none||none|
|»» reagentname|string|true|none||none|
|»» storage_condition|string|true|none||none|
|»» operationlist|[object]|true|none||none|
|»»» creation_time|string|true|none||none|
|»»» lotid|integer|true|none||none|
|»»» lotname|string|true|none||none|
|»»» lotexpiration_date|string|true|none||none|
|»»» inventory_number|integer|true|none||none|
|»»» inbound_number|integer|true|none||none|
|»»» outbound_number|integer|true|none||none|

# 登录登出

## POST 登录

POST /signinout/signin/

> Body 请求参数

```json
{
  "username": "string",
  "password": "string"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» username|body|string| 是 |none|
|» password|body|string| 是 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

## GET 登出

GET /signinout/signout

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

# 数据模型

