using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using System.Text;
using System.Security.Cryptography;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using Microsoft.IdentityModel.Tokens;
using System.Net;
namespace LabMangerAPI.Service;

public class ServiceSigninout
{
    public async Task<ResponseSigninout.Signin> Signin(RequestSigninout.Signin query)
    {
        string tokenstring;
        int responseStatus;
        string teamname;
        UserRole role;
        string responseMessage;
            string username=query.UserName;
            string password=query.PassWord;
            byte[] passwordbyte=Encoding.UTF8.GetBytes(password);
            passwordbyte=SHA256.Create().ComputeHash(passwordbyte);
            password = BitConverter.ToString(passwordbyte).Replace("-","");
            var result = await MySqlSugar.Db.Queryable<User>()
                .Where(it => it.UserName == username && it.PassWord == password).ToListAsync();
            if (result.Count >=1)
            {
                var team = await MySqlSugar.Db.Queryable<Team>()
                    .Where(it => it.Id == result.First().TeamId).ToListAsync();
                teamname = team.First().Name;
                role = result.First().Role;
                
                
                responseStatus = 0;
                responseMessage = "登录成功";
                var securitystring = WebApplication.CreateBuilder().Configuration["Jwt:SecretKey"];
                byte[] keybytes=Encoding.UTF8.GetBytes(securitystring!);
                var securityKey = new SymmetricSecurityKey(keybytes);
                var mysigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var myclaims = new[]
                {
                    new Claim("username", result.First().UserName),
                    new Claim("userid", result.First().Id.ToString()),
                    new Claim("teamid", result.First().TeamId.ToString()),
                    new Claim("role", result.First().Role.ToString())
                };
                var token=new JwtSecurityToken(
                    issuer: "LabMangerAPI", // 必须与验证配置一致
                    audience: "LabMangerAPI-Client", // 必须与验证配置一致
                    claims: myclaims,
                    expires: DateTime.UtcNow.AddDays(100), // 必须设置有效期
                    signingCredentials: mysigningCredentials
                    );
                tokenstring=new JwtSecurityTokenHandler().WriteToken(token);
                
            }
            else
            {
                throw new HttpRequestException("用户名或密码错误", null, HttpStatusCode.Forbidden);
            }

            return new ResponseSigninout.Signin
            {
                Status = responseStatus,
                Message = responseMessage,
                Token=tokenstring,
                UserName = query.UserName,
                TeamName = teamname,
                Role = role
            };
    }
    public  ResponseSigninout.Signout Signout(RequestSigninout.Signout query)
    {
        return new ResponseSigninout.Signout
        {
            Status = 0,
            Message = "登出成功",
        };
    }


}