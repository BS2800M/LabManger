
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
namespace LabMangerAPI.Validator
{
    public class JwtVerification
    {
        static  public void Run(WebApplicationBuilder builder)
        {

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).
                AddJwtBearer(options =>
                    {
                        options.Events = new JwtBearerEvents
                        {
                            OnAuthenticationFailed = context =>
                            {
                                context.Response.StatusCode = 401;
                                context.Response.ContentType = "application/json";
                                return context.Response.WriteAsJsonAsync(new { status = 1, msg = "token验证失败" });
                            },
                            OnChallenge = context =>
                            {
                                context.Response.StatusCode = 401;
                                context.Response.ContentType = "application/json";
                                return context.Response.WriteAsJsonAsync(new { status = 1, msg = "无效token" });
                            },
                            OnTokenValidated = context =>
                            {
                                var claims = context.Principal?.Claims;
                                if (claims != null)
                                {
                                    var claimsDict = claims.ToDictionary(c => c.Type, c => c.Value);
                                    context.HttpContext.Items["userid"] = claimsDict.GetValueOrDefault("userid");
                                    context.HttpContext.Items["username"] = claimsDict.GetValueOrDefault("username");
                                    context.HttpContext.Items["teamid"] = claimsDict.GetValueOrDefault("teamid");
                                    context.HttpContext.Items["role"] = claimsDict.GetValueOrDefault(ClaimTypes.Role);

                                }
                                return Task.CompletedTask;
                            }
                        };
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = "LabMangerAPI",
                        ValidateAudience = true,
                        ValidAudience = "LabMangerAPI-Client",
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey =
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
                        
                    };
                }
            );
        }

    }
}