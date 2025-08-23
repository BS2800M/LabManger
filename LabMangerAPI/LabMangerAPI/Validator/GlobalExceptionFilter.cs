using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;


namespace LabMangerAPI.Validator;

public class GlobalExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is HttpRequestException httpException)
        {
            var statusCode = httpException.StatusCode ?? HttpStatusCode.InternalServerError;
            Console.WriteLine($"处理HttpRequestException，状态码: {statusCode}");
            context.Result = new ObjectResult(new
            {
                status = 1,
                Message = httpException.Message
            })
            {
                StatusCode = (int)statusCode
            };
            context.ExceptionHandled = true;
        }
    }
}

public class XcActionFilter : IActionFilter
{


    public void OnActionExecuting(ActionExecutingContext context)
    {
            // 获取第一个错误消息
            var firstError = context.ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .FirstOrDefault();
            if (!string.IsNullOrEmpty(firstError))
            {
                var result = new { Status = 1, Message = firstError };
                context.Result = new JsonResult(result)
                {
                    StatusCode = (int)HttpStatusCode.Forbidden
                };
            }
        
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // 不需要实现
    }

}


    
    
