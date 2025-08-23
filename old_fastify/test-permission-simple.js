// 简单的权限测试脚本
import jwt from 'jsonwebtoken'

// 模拟权限检查函数
function check_permission_func(action) {    
    return function(request, reply) {
        console.log(`检查权限: ${action}`)
        
        // 模拟从 headers 获取 token
        const jwt_token = request.headers?.token || 'test_token'
        
        try {
            // 验证 JWT token
            const auth = jwt.verify(jwt_token, 'labmanger')
            console.log(`用户角色: ${auth.permission}`)
            
            // 模拟权限列表
            const role_permissions = {
                admin: {
                    permissions: ["team_add", "team_show", "reagent_add", "reagent_show"]
                },
                user: {
                    permissions: ["team_show", "reagent_show"]
                }
            }
            
            const permissions = role_permissions[auth.permission]?.permissions || []
            
            if (!permissions.includes(action)) {
                console.log(`权限不足: ${auth.permission} 没有 ${action} 权限`)
                return reply.status(403).send({status: 1, msg: "权限不足"})
            }
            
            console.log(`权限检查通过: ${auth.permission} -> ${action}`)
            // 权限通过，不返回任何值，继续执行后续函数
            
        } catch (error) {
            console.log(`权限检查错误: ${error.message}`)
            return reply.status(401).send({status: 1, msg: "认证失败"})
        }
    }
}

// 模拟业务处理函数
function team_add(request, reply) {
    console.log('执行业务逻辑: team_add')
    return { status: 0, msg: "成功", data: { id: 1, name: "测试团队" } }
}

function team_show(request, reply) {
    console.log('执行业务逻辑: team_show')
    return { status: 0, msg: "成功", data: [{ id: 1, name: "测试团队" }] }
}

// 模拟请求对象
function createMockRequest(token, action) {
    return {
        headers: { token },
        body: { name: "测试团队" },
        query: {}
    }
}

// 模拟响应对象
function createMockReply() {
    let statusCode = 200
    let responseData = null
    
    return {
        status: function(code) {
            statusCode = code
            return this
        },
        send: function(data) {
            responseData = data
            console.log(`响应: ${statusCode}`, data)
            return this
        },
        getStatusCode: () => statusCode,
        getResponseData: () => responseData
    }
}

// 测试函数
function testPermissionFlow(token, action, handler) {
    console.log(`\n=== 测试: ${action} ===`)
    
    const request = createMockRequest(token, action)
    const reply = createMockReply()
    
    // 执行权限检查
    const permissionChecker = check_permission_func(action)
    const permissionResult = permissionChecker(request, reply)
    
    // 如果权限检查返回了响应，说明权限不足
    if (permissionResult !== undefined) {
        console.log('权限检查阻止了后续执行')
        return
    }
    
    // 权限通过，执行业务逻辑
    console.log('权限检查通过，执行业务逻辑')
    const businessResult = handler(request, reply)
    console.log('业务逻辑结果:', businessResult)
}

// 生成测试 token
const adminToken = jwt.sign(
    { username: 'admin', permission: 'admin' },
    'labmanger'
)

const userToken = jwt.sign(
    { username: 'user', permission: 'user' },
    'labmanger'
)

// 运行测试
console.log('=== 权限系统测试 ===')

// 测试管理员权限
testPermissionFlow(adminToken, 'team_add', team_add)
testPermissionFlow(adminToken, 'team_show', team_show)

// 测试普通用户权限
testPermissionFlow(userToken, 'team_show', team_show)
testPermissionFlow(userToken, 'team_add', team_add) // 应该被拒绝

console.log('\n=== 测试完成 ===') 