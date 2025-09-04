using LabMangerAPI.Data;
using LabMangerAPI.Validator;
using LabMangerAPI.Repository;
using LabMangerAPI.Service;


namespace LabMangerAPI;

    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder();
            AppConfig.ReadConfig(builder); //读取配置
            await Migrate.Run(); //迁移数据库
            
            // 添加配置服务
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddDistributedMemoryCache();
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
                
            });

            // 配置HTTPS证书
            if (!string.IsNullOrEmpty(AppConfig.CertificatePath) && File.Exists(AppConfig.CertificatePath))
            {
                builder.WebHost.ConfigureKestrel(serverOptions =>
                {
                    serverOptions.ConfigureHttpsDefaults(httpsOptions =>
                    {
                    // 使用证书文件和私钥文件
                    httpsOptions.ServerCertificate = System.Security.Cryptography.X509Certificates.X509Certificate2.CreateFromPemFile(AppConfig.CertificatePath, AppConfig.KeyPath);
                    });
                });
            }
            var app = builder.Build();
            app.UseHsts(); // 启用 HTTP Strict Transport Security (HSTS)
            app.UseCors("AllowAll");
            app.UseRouting();
            app.MapControllers();
            app.Run();
            
        }
    }



