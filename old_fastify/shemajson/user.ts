// 用户相关的 schema 定义

const user_add_schema = {
    body: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            role: { type: 'string' },
            teamid: { type: 'number' },
        },
        required: ['username', 'password', 'role', 'teamid']
    }
}

const user_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
        },
        required: ['id']
    }
}

const user_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' },
        },
        required: ['name', 'page', 'pagesize']
    }
}

const user_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            role: { type: 'string' },
            teamid: { type: 'number' },
            password: { type: 'string' },
        },
        required: ['id', 'username', 'role', 'teamid', 'password']
    }
}

export {
    user_add_schema,
    user_del_schema,
    user_show_schema,
    user_update_schema
} 