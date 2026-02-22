// ReSharper disable UnusedAutoPropertyAccessor.Global


using System.ComponentModel.DataAnnotations;
using LabMangerAPI.Models;

namespace LabMangerAPI.DTOs;


/// <summary>
/// 有关登录登出的请求api类
/// </summary>
public class RequestSigninout
{
    public class Signin
    {
        /// 用户名
        [Required(ErrorMessage = "用户名必须填写")] public string UserName { get; init; } = null!;
        /// 密码
        public string PassWord { get; set; } = "";

    }

    /// 登出用户的请求模型
    public class Signout
    {

    }

}
/// <summary>
/// 有关登录登出的回复api类
/// </summary>
public class ResponseSigninout
   {
       public class Signin
       {
           public int Status { get; set; } = -1;
           public string Message { get; set; } = "";
           
           public string UserName { get; set; } = "";
           public string TeamName { get; set; } = "";
           public string SessionId { get; set; } = "";
           public UserRole Role { get; set; }= UserRole.Member;
       }

       public class Signout
       {
           public int Status { get; set; } = -1;
           public string Message { get; set; } = "";
       }
       
   }



