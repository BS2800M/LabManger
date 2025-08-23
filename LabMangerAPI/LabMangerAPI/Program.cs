using LabMangerAPI.SugarSql;
using LabMangerAPI.Validator;
using LabMangerAPI.Repository;
using LabMangerAPI.Service;

namespace LabMangerAPI
{
    public class Program
    {

        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder();
            
            // 添加配置服务
            builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

            builder.Services.AddOpenApi();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<IUserContext, UserContext>();
            builder.Services.AddScoped<RepositoryReagent>();
            builder.Services.AddScoped<RepositoryLot>();
            builder.Services.AddScoped<RepositoryTeam>();
            builder.Services.AddScoped<RepositoryUser>();
            builder.Services.AddScoped<RepositoryOperation>();
            builder.Services.AddScoped<RepositoryInventory>();
            builder.Services.AddScoped<ServiceSigninout>();
            builder.Services.AddScoped<ServiceOperation>();
            builder.Services.AddScoped<ServiceReagent>();
            builder.Services.AddScoped<ServiceLot>();
            builder.Services.AddScoped<ServiceInventory>();
            builder.Services.AddScoped<ServiceTeam>();
            builder.Services.AddScoped<ServiceUser>();



            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<GlobalExceptionFilter>();
                options.Filters.Add<XcActionFilter>();
                
            }).ConfigureApiBehaviorOptions(options =>
            {
                // 禁用默认的模型验证响应
                options.SuppressModelStateInvalidFilter = true;
            });
            
            JwtVerification.Run(builder);
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                Migrate.Run();
                app.MapOpenApi();
            }
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
            
        }
    }
}


