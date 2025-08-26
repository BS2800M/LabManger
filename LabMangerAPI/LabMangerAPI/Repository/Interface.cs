namespace LabMangerAPI.Repository;
using SqlSugar;


public interface ICrud<T,TResponseList,TRequestAdd,TRequestShow,TRequestUpdate,TRequestDel> where T:class,new()
{
    Task<T> Add(TRequestAdd body);
    Task<List<TResponseList>> Show(TRequestShow search,RefAsync<int> totalcount,RefAsync<int> totalpage);
    Task<T> Update(TRequestUpdate body);
    Task<bool> Del(TRequestDel id);
}




public interface IUserContext //验证信息接口 依赖注入
{
    string Role { get; }
    string Scope { get; }
    int TeamId { get; }
    string UserId { get; }
    string Username { get; }
}

    public class UserContext : IUserContext //验证信息接类
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
        public string Username => _httpContextAccessor.HttpContext?.Items["username"]?.ToString() ?? string.Empty;
    }
