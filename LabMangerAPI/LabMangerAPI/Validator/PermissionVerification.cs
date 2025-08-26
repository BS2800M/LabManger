
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;

namespace LabMangerAPI.Validator;



[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class )]
    public class RequirePermissionAttribute : Attribute, IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context) //基础权限验证
        {
            var configuration = context.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var permission = context.HttpContext.Request.Path.Value;
            var role = context.HttpContext.Items["role"]!.ToString();
            
            var permissions = configuration.GetSection($"PermissionsTable:{role}:permissions").Get<string[]>();
            var scope = configuration.GetSection($"PermissionsTable:{role}:scope").Get<string>();
            
            context.HttpContext.Items["scope"] = scope; //储存scope
            
            if (permissions == null || !permissions.Contains(permission))
            {
                throw new HttpRequestException("权限不足", null, HttpStatusCode.Forbidden);
            }
        }

        
        public void OnActionExecuted(ActionExecutedContext context)
        {
            // 可以在这里做一些后处理工作，如日志记录
        }
    }
