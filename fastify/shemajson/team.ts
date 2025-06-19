// 团队相关的 schema 定义

const team_add_schema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            phone: { type: 'string' },
            note: { type: 'string' },
            using: { type: 'boolean' }
        },
        required: ['name', 'phone', 'using']
    }
}

const team_show_schema = {
    querystring: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            page: { type: 'number' },
            pagesize: { type: 'number' }
        },
        required: ['name', 'page', 'pagesize']
    }
}

const team_update_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            phone: { type: 'string' },
            note: { type: 'string' },
            using: { type: 'boolean' }
        },
        required: ['id', 'name', 'phone', 'using']
    }
}

const team_del_schema = {
    body: {
        type: 'object',
        properties: {
            id: { type: 'number' }
        },
        required: ['id']
    }
}

export {
    team_add_schema,
    team_show_schema,
    team_update_schema,
    team_del_schema
} 