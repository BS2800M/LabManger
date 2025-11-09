
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;


namespace LabMangerAPI.Validator
{
    /// <summary>
    /// 权限验证特性
    /// 
    /// 功能：
    /// 1. 验证用户是否有权限访问指定的接口
    /// 2. 从HttpContext.Items中获取用户角色信息
    /// 3. 根据角色和权限配置进行验证
    /// </summary>
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
    public class RequirePermissionAttribute : Attribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                // 从HttpContext.Items中获取用户角色信息（由SessionAuthorizationFilter设置）
                var role = context.HttpContext.Items["role"]?.ToString();
                
                // 检查角色是否存在
                if (string.IsNullOrEmpty(role))
                {
                    throw new HttpRequestException("用户角色信息缺失", null, HttpStatusCode.Unauthorized);
                }
                
                var permission = context.HttpContext.Request.Path.Value;

                // 静态类中直接读取
                var permissions = AppConfig.GetRolePermissions(role);
                var scope = AppConfig.GetRoleScope(role);
                
                // 存储scope到HttpContext.Items中，供后续使用
                if (!string.IsNullOrEmpty(scope))
                {
                    context.HttpContext.Items["scope"] = scope;
                }
                
                // 验证权限
                if (permissions == null || !permissions.Contains(permission))
                {
                    throw new HttpRequestException("权限不足", null, HttpStatusCode.Forbidden);
                }
            }
            catch (Exception error)
            {
                Console.WriteLine(error.Message);
                
                // 其他异常转换为权限不足
                throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // 可以在这里做一些后处理工作，如日志记录
        }
    }
}
