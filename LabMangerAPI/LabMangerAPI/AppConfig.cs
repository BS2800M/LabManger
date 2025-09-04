namespace LabMangerAPI;

public static class AppConfig
{
    public static string? CertificatePath { get; set; } 
    public static string? KeyPath { get; set; }
    public static int SessionDay { get; set; }
    public static string? SessionHeaderName { get; set; }
    public static string? SessionValidateKey { get; set; }
    public static List<string> SessionIssueSessionIdOnPaths { get; set; } = new List<string>();
    
    // 权限配置缓存到内存中
    public static Dictionary<string, string[]> RolePermissions { get; } = new(); 
    public static Dictionary<string, string> RoleScopes { get; } = new();
    public static Dictionary<string, string> RoleDescriptions { get; } = new();
    
    public static void ReadConfig(WebApplicationBuilder builder)
    {
        CertificatePath = builder.Configuration["Kestrel:Endpoints:Https:Certificate:Path"];  //证书路径
        KeyPath = builder.Configuration["Kestrel:Endpoints:Https:Certificate:KeyPath"];  //私钥路径
        SessionDay = builder.Configuration.GetValue("SessionDay", 30); //session过期时间
        SessionHeaderName = builder.Configuration.GetValue<string>("SessionHeaderName","X-Session-Id"); //session header名字
        SessionValidateKey = builder.Configuration.GetValue<string>("SessionValidateKey","userid");  //如何验证session有效性
        SessionIssueSessionIdOnPaths = builder.Configuration.GetValue<string>("SessionIssueSessionIdOnPaths","").Split(',').ToList(); //不进行session验证的接口
        // 一次性读取权限配置到内存
        LoadPermissionsToMemory(builder.Configuration);
    }
    
    /// <summary>
    /// 一次性将权限配置加载到内存中
    /// </summary>
    private static void LoadPermissionsToMemory(IConfiguration configuration)
    {
        var permissionsSection = configuration.GetSection("PermissionsTable");

        foreach (var roleSection in permissionsSection.GetChildren())
        {
            var roleName = roleSection.Key;
            
            // 读取权限数组
            var permissions = roleSection.GetSection("permissions").Get<string[]>();
            if (permissions != null)
            {
                RolePermissions[roleName] = permissions;
            }
            // 读取作用域
            var scope = roleSection.GetSection("scope").Get<string>();
            if (!string.IsNullOrEmpty(scope))
            {
                RoleScopes[roleName] = scope;
            }
            
            // 读取描述
            var description = roleSection.GetSection("describe").Get<string>();
            if (!string.IsNullOrEmpty(description))
            {
                RoleDescriptions[roleName] = description;
            }
        }
        
        Console.WriteLine($"权限配置已加载到内存: {RolePermissions.Count} 个角色");
    }
    
    /// <summary>
    /// 获取指定角色的权限列表（从内存中读取）
    /// </summary>
    public static string[]? GetRolePermissions(string role)
    {
        return RolePermissions.TryGetValue(role, out var permissions) ? permissions : null;
    }
    
    /// <summary>
    /// 获取指定角色的作用域（从内存中读取）
    /// </summary>
    public static string? GetRoleScope(string role)
    {
        return RoleScopes.TryGetValue(role, out var scope) ? scope : null;
    }
    
    /// <summary>
    /// 获取指定角色的描述（从内存中读取）
    /// </summary>
    public static string? GetRoleDescription(string role)
    {
        return RoleDescriptions.TryGetValue(role, out var description) ? description : null;
    }
    
    /// <summary>
    /// 检查指定角色是否有访问指定路径的权限（从内存中快速检查）
    /// </summary>
    public static bool HasPermission(string role, string path)
    {
        return RolePermissions.TryGetValue(role, out var permissions) && 
               permissions.Contains(path);
    }
    
    /// <summary>
    /// 获取所有角色名称（从内存中读取）
    /// </summary>
    public static IEnumerable<string> GetAllRoles()
    {
        return RolePermissions.Keys;
    }
    
    /// <summary>
    /// 重新加载权限配置（用于运行时更新权限）
    /// </summary>
    public static void ReloadPermissions(IConfiguration configuration)
    {
        // 清空现有缓存
        RolePermissions.Clear();
        RoleScopes.Clear();
        RoleDescriptions.Clear();
        
        // 重新加载
        LoadPermissionsToMemory(configuration);
    }
}