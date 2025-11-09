using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Distributed;

namespace LabMangerAPI.Validator
{
    /// <summary>
    /// 基于Session的会话验证过滤器
    /// 
    /// 功能：
    /// 1. 验证非白名单路径的会话有效性
    /// 2. 从缓存中获取用户信息并存储到HttpContext.Items
    /// </summary>
    public class SessionAuthorizationFilter : IResourceFilter
    {
        private readonly IDistributedCache _cache;
        private readonly string _sessionHeaderName;
        private readonly string _sessionValidateKey;
        private readonly List<string> _sessionIssueSessionIdOnPaths;

        public SessionAuthorizationFilter(IDistributedCache cache)
        {
            _cache = cache;
            _sessionHeaderName = AppConfig.SessionHeaderName!;
            _sessionValidateKey = AppConfig.SessionValidateKey!;
            _sessionIssueSessionIdOnPaths = AppConfig.SessionIssueSessionIdOnPaths;
        }

        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            var httpContext = context.HttpContext;
            var path = httpContext.Request.Path.Value ?? string.Empty;
            var normalizedPath = path.EndsWith("/") && path.Length > 1 ? path.TrimEnd('/') : path;
            
            // 判断是否为白名单路径
            var isWhitelisted = _sessionIssueSessionIdOnPaths.Contains(path) || 
                                _sessionIssueSessionIdOnPaths.Contains(normalizedPath);

            // 白名单路径直接放行，不需要验证会话
            if (isWhitelisted)
            {
                return;
            }

            // 非白名单路径：必须验证会话
            var sessionId = httpContext.Request.Headers[_sessionHeaderName].FirstOrDefault();
            
            if (string.IsNullOrWhiteSpace(sessionId))
            {
                // 没有会话头，返回401
                context.Result = new UnauthorizedObjectResult(new
                {
                    status = 1,
                    message = "无效的session"
                });
                return;
            }

            // 验证会话有效性
            var validateKey = _sessionValidateKey;
            if (!string.IsNullOrWhiteSpace(validateKey))
            {
                var cacheKey = $"hdrsess:{sessionId}:{validateKey}";
                var exists = _cache.GetStringAsync(cacheKey).Result;
                
                if (string.IsNullOrEmpty(exists))
                {
                    context.Result = new UnauthorizedObjectResult(new
                    {
                        status = 1,
                        message = "无效的session"
                    });
                    return;
                }
            }
            
            // 会话验证通过，从缓存中获取用户信息并存储到Items中
            httpContext.Items["userid"] = _cache.GetStringAsync($"hdrsess:{sessionId}:userid").Result;
            httpContext.Items["teamid"] = _cache.GetStringAsync($"hdrsess:{sessionId}:teamid").Result;
            httpContext.Items["role"] = _cache.GetStringAsync($"hdrsess:{sessionId}:role").Result;
        }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {
            // 资源执行完成后的处理（如果需要的话）
        }
    }

    /// <summary>
    /// 基于Session的授权特性
    /// 
    /// 用法：在控制器或Action上添加 [SessionAuthorize]
    /// 功能：自动处理会话验证和授权，支持白名单路径
    /// </summary>
    public class SessionAuthorizeAttribute : TypeFilterAttribute
    {
        public SessionAuthorizeAttribute() : base(typeof(SessionAuthorizationFilter))
        {
        }
    }


}
