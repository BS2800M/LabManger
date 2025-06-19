// 登录登出相关的 schema 定义
const loginout_login_schema = {
    querystring: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' },
        },
        required: ['username', 'password']
    }
};
const loginout_logout_schema = {
    querystring: {
        type: 'object',
        properties: {
            username: { type: 'string' },
        },
        required: ['username']
    }
};
export { loginout_login_schema, loginout_logout_schema };
