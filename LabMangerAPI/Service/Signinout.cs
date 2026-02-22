using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using System.Text;
using System.Security.Cryptography;
using System.Net;
using Microsoft.Extensions.Caching.Distributed;
namespace LabMangerAPI.Service;
/// <summary>
/// 登录登出类（服务层）
/// </summary>
public class ServiceSigninout
{
    private readonly IDistributedCache _cache;
    private readonly IHttpContextAccessor _httpContextAccessor;
    /// <summary>
    /// 构建登录登出类(服务层)
    /// </summary>
    /// <param name="cache"></param>
    /// <param name="httpContextAccessor">http上下文</param>
    public ServiceSigninout(IDistributedCache cache, IHttpContextAccessor httpContextAccessor)
    {
        _cache = cache;
        _httpContextAccessor = httpContextAccessor;
    }
    /// <summary>
    /// 登录
    /// </summary>
    /// <param name="body">登录时请求的数据</param>
    ///  <returns>登录时返回的数据</returns>
    public async Task<ResponseSigninout.Signin> Signin(RequestSigninout.Signin query)
    {
        int responseStatus;
        string teamname;
        UserRole role;
        string responseMessage;
        
        string username = query.UserName;
        string password = query.PassWord;
        byte[] passwordbyte = Encoding.UTF8.GetBytes(password);
        passwordbyte = SHA256.Create().ComputeHash(passwordbyte);
        password = BitConverter.ToString(passwordbyte).Replace("-", "");
        string? sessionId;
        var result = await MySqlSugar.Db.Queryable<User>()
            .Where(it => it.UserName == username && it.PassWord == password).ToListAsync();
            
        if (result.Count >= 1)
        {
            var team = await MySqlSugar.Db.Queryable<Team>()
                .Where(it => it.Id == result.First().TeamId).ToListAsync();
            teamname = team.First().Name;
            role = result.First().Role;
            responseStatus = 0;
            responseMessage = "登录成功";
            
            // 获取或生成会话ID
            sessionId = _httpContextAccessor.HttpContext?.Request.Headers["X-Session-Id"].FirstOrDefault();
            if (string.IsNullOrEmpty(sessionId))
            {
                // 自动生成会话ID
                sessionId = Guid.NewGuid().ToString("N");
            }
            
            // 同时存储到HttpContext.Items中，供后续使用
            if (_httpContextAccessor.HttpContext != null)
            {
                _httpContextAccessor.HttpContext.Items["__header_session_id__"] = sessionId;
            }
            var cacheOptions = new DistributedCacheEntryOptions
            {
                // 设置绝对过期时间
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(AppConfig.SessionDay),
            };
            // 登录成功：把关键用户信息写入基于请求头的会话
            await _cache.SetStringAsync($"hdrsess:{sessionId}:userid", result.First().Id.ToString(), cacheOptions);
            await _cache.SetStringAsync($"hdrsess:{sessionId}:teamid", result.First().TeamId.ToString(), cacheOptions);
            await _cache.SetStringAsync($"hdrsess:{sessionId}:role", result.First().Role.ToString(), cacheOptions);
            
        }
        else
        {
            throw new HttpRequestException("用户名或密码错误", null, HttpStatusCode.Forbidden);
        }

        return new ResponseSigninout.Signin
        {
            Status = responseStatus,
            Message = responseMessage,
            UserName = query.UserName,
            TeamName = teamname,
            SessionId = sessionId,
            Role = role
        };
    }
    /// <summary>
    /// 登出
    /// </summary>
    /// <param name="body">登出时请求的数据</param>
    ///  <returns>登出时返回的数据</returns>
    public ResponseSigninout.Signout Signout(RequestSigninout.Signout query)
    {
        return new ResponseSigninout.Signout
        {
            Status = 0,
            Message = "登出成功",
        };
    }
}