namespace LabMangerAPI.Repository;
using SqlSugar;

/// <summary>
/// 接口 增删改查
/// </summary>

public interface ICrud<T,TResponseList,TRequestAdd,TRequestShow,TRequestUpdate,TRequestDel> where T:class,new()
{
    Task<T> Add(TRequestAdd body);
    Task<List<TResponseList>> Show(TRequestShow search,RefAsync<int> totalcount,RefAsync<int> totalpage);
    Task<T> Update(TRequestUpdate body);
    Task<bool> Del(TRequestDel id);
}



/// <summary>
/// 验证用户信息和权限接口
/// </summary>
public interface IUserContext
{
    string Role { get; }
    string Scope { get; }
    int TeamId { get; }
    string UserId { get; }
}
/// <summary>
/// 验证用户信息和权限类
/// </summary>
public class UserContext : IUserContext 
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    public string Role => _httpContextAccessor.HttpContext?.Items["role"]?.ToString() ?? string.Empty;
    public string Scope => _httpContextAccessor.HttpContext?.Items["scope"]?.ToString() ?? string.Empty;
    public int TeamId => Convert.ToInt32(_httpContextAccessor.HttpContext?.Items["teamid"] ?? 0);
    public string UserId => _httpContextAccessor.HttpContext?.Items["userid"]?.ToString() ?? string.Empty;
}
