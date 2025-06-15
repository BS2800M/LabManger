---
title: 个人项目
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

# 个人项目

Base URLs:

# Authentication

* API Key (token)
    - Parameter Name: **token**, in: header. 

# 需要鉴权

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
  "msg": "成功",
  "data": [
    {
      "id": 2,
      "name": "临建小组",
      "using": true,
      "phone": "1000",
      "note": ""
    },
    {
      "id": 1,
      "name": "免疫小组",
      "using": true,
      "phone": "052 2037 4386",
      "note": "ullamco labore ut"
    }
  ],
  "total": 2,
  "page": 1,
  "pagesize": 10,
  "totalpages": 1
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
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» using|boolean|true|none||none|
|»» phone|string|true|none||none|
|»» note|string|true|none||none|
|» total|integer|true|none||none|
|» page|integer|true|none||none|
|» pagesize|integer|true|none||none|
|» totalpages|integer|true|none||none|

## POST 小组添加

POST /team/add/

> Body 请求参数

```json
{
  "name": "生化小组",
  "phone": "052 2037 4386",
  "note": "ullamco labore ut",
  "using": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |名称|
|» phone|body|string| 是 |none|
|» note|body|string| 是 |none|
|» using|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
|» permission|body|string| 是 |none|
|» teamid|body|number| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功添加用户"
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
  "msg": "成功添加用户"
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

## POST 试剂添加

POST /reagent/add/

> Body 请求参数

```json
{
  "name": "ALT",
  "specifications": "盒",
  "warn_number": 0,
  "price": 400,
  "storage_condition": "2-6度",
  "teamid": 1,
  "warn_days": 0,
  "using": true,
  "generate_lot": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |none|
|» specifications|body|string| 是 |none|
|» warn_number|body|integer| 是 |none|
|» price|body|integer| 是 |none|
|» storage_condition|body|string| 是 |none|
|» teamid|body|integer| 是 |none|
|» warn_days|body|integer| 是 |none|
|» using|body|boolean| 是 |none|
|» generate_lot|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 2,
      "name": "CD80",
      "specifications": "盒",
      "warn_number": 0,
      "price": 400,
      "creation_time": "2025-06-06T12:41:13.293Z",
      "storage_condition": "2-6度",
      "teamid": 1,
      "using": true,
      "warn_days": 0
    },
    {
      "id": 1,
      "name": "ASO试剂",
      "specifications": "箱",
      "warn_number": 2,
      "price": 1000,
      "creation_time": "2025-06-06T11:24:22.088Z",
      "storage_condition": "常温",
      "teamid": 1,
      "using": true,
      "warn_days": 0
    }
  ],
  "total": 2,
  "page": 1,
  "pagesize": 10,
  "totalpages": 1
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
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» name|string|true|none||none|
|»» specifications|string|true|none||none|
|»» warn_number|integer|true|none||none|
|»» price|integer|true|none||none|
|»» creation_time|string|true|none||none|
|»» storage_condition|string|true|none||none|
|»» teamid|integer|true|none||none|
|»» using|boolean|true|none||none|
|»» warn_days|integer|true|none||none|
|» total|integer|true|none||none|
|» page|integer|true|none||none|
|» pagesize|integer|true|none||none|
|» totalpages|integer|true|none||none|

## PUT 试剂修改

PUT /reagent/update/

> Body 请求参数

```json
{
  "id": 1,
  "name": "ASO试剂",
  "specifications": "箱",
  "warn_number": 2,
  "price": 1000,
  "storage_condition": "常温",
  "teamid": 1,
  "warn_days": 0,
  "using": true
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» id|body|integer| 否 |ID 编号|
|» name|body|string| 是 |名称|
|» specifications|body|string| 是 |none|
|» warn_number|body|integer| 是 |none|
|» price|body|integer| 是 |none|
|» storage_condition|body|string| 是 |none|
|» warn_days|body|integer| 是 |none|
|» using|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

## GET 试剂所有列出

GET /reagent/showall/

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|teamid|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 3,
      "name": "CD80"
    },
    {
      "id": 2,
      "name": "CD80"
    },
    {
      "id": 1,
      "name": "ASO试剂"
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
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||ID 编号|
|»» name|string|true|none||名称|

## POST 批号添加

POST /lot/add/

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
|body|body|object| 否 |none|
|» name|body|string| 是 |名称|
|» reagentid|body|integer| 是 |none|
|» expiration_date|body|string(date-time)| 是 |none|
|» using|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
|reagentname|query|string| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|
|body|body|object| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 16,
      "name": "测试LOT",
      "expiration_date": "2025-06-05T15:12:32.540Z",
      "creation_time": "2025-06-07T04:17:02.018Z",
      "reagentid": 1,
      "reagentname": "ASO试剂",
      "using": true
    }
  ],
  "total": 1,
  "page": 1,
  "pagesize": 10,
  "totalpages": 1
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
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|false|none||none|
|»» name|string|false|none||none|
|»» expiration_date|string|false|none||none|
|»» creation_time|string|false|none||none|
|»» reagentid|integer|false|none||none|
|»» reagentname|string|false|none||none|
|»» using|boolean|false|none||none|
|» total|integer|true|none||none|
|» page|integer|true|none||none|
|» pagesize|integer|true|none||none|
|» totalpages|integer|true|none||none|

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
|» expiration_date|body|string(date-time)| 是 |none|
|» using|body|boolean| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

## PUT 批号删除

PUT /lot/delete/

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
  "msg": "成功",
  "data": {}
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
|» msg|string|true|none||none|
|» data|object|true|none||none|

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
  "msg": "成功",
  "data": [
    {
      "id": 2,
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
|» status|integer|true|none||状态|
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|false|none||ID 编号|
|»» name|string|false|none||名称|

## POST 入库

POST /operation/inbound/

> Body 请求参数

```json
{
  "inboundlist": [
    {
      "reagentid": 1,
      "lotid": 1,
      "number": 5,
      "userid": 2
    }
  ]
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» inboundlist|body|[object]| 是 |none|
|»» reagentid|body|integer| 是 |none|
|»» lotid|body|integer| 是 |none|
|»» number|body|integer| 是 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "入库成功",
  "data": [
    {
      "id": 76,
      "reagentid": 2,
      "lotid": 2,
      "reagentname": "CD80",
      "lotname": "LOT10086",
      "barcodenumber": "1000076",
      "operation_action": "inbound",
      "using": true,
      "username": "夕俊杰"
    },
    {
      "id": 77,
      "reagentid": 2,
      "lotid": 2,
      "reagentname": "CD80",
      "lotname": "LOT10086",
      "barcodenumber": "1000077",
      "operation_action": "inbound",
      "using": true,
      "username": "夕俊杰"
    },
    {
      "id": 78,
      "reagentid": 2,
      "lotid": 2,
      "reagentname": "CD80",
      "lotname": "LOT10086",
      "barcodenumber": "1000078",
      "operation_action": "inbound",
      "using": true,
      "username": "夕俊杰"
    },
    {
      "id": 79,
      "reagentid": 2,
      "lotid": 2,
      "reagentname": "CD80",
      "lotname": "LOT10086",
      "barcodenumber": "1000079",
      "operation_action": "inbound",
      "using": true,
      "username": "夕俊杰"
    },
    {
      "id": 80,
      "reagentid": 2,
      "lotid": 2,
      "reagentname": "CD80",
      "lotname": "LOT10086",
      "barcodenumber": "1000080",
      "operation_action": "inbound",
      "using": true,
      "username": "夕俊杰"
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
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» reagentid|integer|true|none||none|
|»» lotid|integer|true|none||none|
|»» using|boolean|true|none||none|
|»» username|string|true|none||none|
|»» barcodenumber|string|true|none||none|
|»» reagentname|string|true|none||none|
|»» lotname|string|true|none||none|

## POST 出库

POST /operation/outbound/

> Body 请求参数

```json
"{\r\n    \"barcodenumber\": \"1000070\",\r\n}"
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
|» msg|string|true|none||none|

## POST 特殊出库

POST /operation/special_outbound/

> Body 请求参数

```json
{
  "reagentid": 1,
  "lotid": 1,
  "number": 2
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» outboundlist|body|[object]| 是 |none|
|»» reagentid|body|integer| 是 |none|
|»» lotid|body|integer| 是 |none|
|»» number|body|integer| 是 |none|

> 返回示例

```json
{
  "status": 0,
  "msg": "出库成功"
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
|» msg|string|true|none||none|

## GET 列出操作

GET /operation/show/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|reagentname|query|string| 否 |none|
|searchlater|query|string(date-time)| 否 |none|
|searchearlier|query|string(date-time)| 否 |none|
|barcodenumber|query|string| 否 |none|
|page|query|integer| 否 |none|
|pagesize|query|integer| 否 |none|

> 返回示例

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 6,
      "reagentid": 1,
      "lotid": 16,
      "reagentname": "ASO试剂",
      "lotname": "测试LOT",
      "barcodenumber": "unknown",
      "operation_action": "s_outbound",
      "using": true,
      "userid": 2,
      "username": "测试用户"
    },
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
      "username": "测试用户"
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
      "username": "测试用户"
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
      "username": "测试用户"
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
      "username": "测试用户"
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
      "username": "测试用户"
    }
  ],
  "total": 6,
  "page": 1,
  "pagesize": 10,
  "totalpages": 1
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
|» msg|string|true|none||none|
|» data|[object]|true|none||none|
|»» id|integer|true|none||none|
|»» reagentid|integer|true|none||none|
|»» lotid|integer|true|none||none|
|»» reagentname|string|true|none||none|
|»» lotname|string|true|none||none|
|»» barcodenumber|string|true|none||none|
|»» operation_action|string|true|none||none|
|»» using|boolean|true|none||none|
|»» userid|integer|true|none||none|
|»» username|string|true|none||none|
|» total|integer|true|none||none|
|» page|integer|true|none||none|
|» pagesize|integer|true|none||none|
|» totalpages|integer|true|none||none|

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
  "status": 0,
  "msg": "成功",
  "data": {
    "id": 2,
    "reagentid": 2,
    "lotid": 2,
    "operation_action": "inbound",
    "creation_time": "2025-06-06T14:32:34.329Z",
    "using": false,
    "barcodenumber": "10002",
    "username": "夕俊杰"
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
|» msg|string|true|none||none|
|» data|object|true|none||none|
|»» id|integer|true|none||none|
|»» reagentid|integer|true|none||none|
|»» lotid|integer|true|none||none|
|»» operation_action|string|true|none||none|
|»» creation_time|string|true|none||none|
|»» using|boolean|true|none||none|
|»» barcodenumber|string|true|none||none|
|»» username|string|true|none||none|

## GET 库存列出

GET /inventory/show/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |none|
|pagesize|query|number| 否 |none|
|only_warn|query|boolean| 否 |none|

> 返回示例

> 200 Response

```json
{
  "status": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "reagentid": 16,
      "lotid": 42,
      "reagentname": "测试试剂",
      "lotname": "测试批号",
      "inventory_number": 0,
      "last_outbound_time": "2025-06-09T10:59:29.205Z",
      "warn_time": "2025-06-09T10:59:29.205Z",
      "lastweek_outbound_number": 0,
      "warn_number": 0
    }
  ],
  "total": 1,
  "page": 1,
  "pagesize": 10,
  "totalpages": 1
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
|»» id|integer|false|none||none|
|»» reagentid|integer|false|none||none|
|»» lotid|integer|false|none||none|
|»» reagentname|string|false|none||none|
|»» lotname|string|false|none||none|
|»» inventory_number|integer|false|none||none|
|»» last_outbound_time|string|false|none||none|
|»» warn_time|string|false|none||none|
|»» lastweek_outbound_number|integer|false|none||none|
|»» warn_number|integer|false|none||none|
|» total|integer|true|none||none|
|» page|integer|true|none||none|
|» pagesize|integer|true|none||none|
|» totalpages|integer|true|none||none|

## PUT 验证库存

PUT /inventory/audit/

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
{}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|none|Inline|

### 返回数据结构

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

## GET 登录

GET /loginout/login/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 否 |none|
|password|query|string| 否 |none|

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

GET /loginout/logout/

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|username|query|string| 否 |none|

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

