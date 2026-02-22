
using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Repository;
/// <summary>
/// 用户类(仓储层)
/// </summary>
public class RepositoryUser:ICrud<User,ResponseUser.ShowData,RequestUser.Add,RequestUser.Show,RequestUser.Update,RequestUser.Del>
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    /// <summary>
    /// 构建用户类(仓储层)
    /// </summary>
    /// <param name="userContext">用户和权限验证接口</param>
    public RepositoryUser(IUserContext userContext)
    {   
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个用户
    /// </summary>
    /// <param name="body">增加用户时请求的数据</param>
    ///  <returns>增加用时返回的数据</returns>
    public async Task<User> Add(RequestUser.Add body)
    {
        var result = _db.Insertable(new User
        {
            TeamId = body.TeamId,
            UserName = body.UserName,
            PassWord = body.PassWord,
            Role = body.Role,
        }).ExecuteReturnEntityAsync();
        return await result;
    }
    /// <summary>
    /// 展示多个用户
    /// </summary>
    /// <param name="search">展示用户时请求的数据</param>
    /// <param name="totalcount">ref 用户总数</param>
    /// <param name="totalcount">ref 总页数</param>
    ///  <returns>展示多个用户时返回的数据</returns>
    public async Task<List <ResponseUser.ShowData>> Show(RequestUser.Show search,RefAsync<int> totalcount,RefAsync<int> totalpage)
    { 
        string? name=search.Name;
        int page=search.Page;
        int pageSize=search.PageSize;
        var exp = Expressionable.Create<User>();
        exp.And(u=>u.Status == Status.Enable);
        exp.AndIF(string.IsNullOrEmpty(name)==false,u => u.UserName.Contains(name!) );
        ScopeVerification.CreateScope(ref exp,_userContext.TeamId,_userContext.Role);
        var result = _db.Queryable<User>()
            .Where(exp.ToExpression())
            .LeftJoin<Team>((u,t)=>u.TeamId == t.Id)
            .OrderBy(u => u.Id,OrderByType.Desc)
            .Select((u,t)=>new ResponseUser.ShowData
            {
                Id = u.Id,
                UserName = u.UserName,
                TeamName =t.Name, 
                Role = u.Role,
                TeamId=t.Id,
                
            })
            .ToPageListAsync(page, pageSize,totalcount, totalpage);

        return await result;
        
    }
    /// <summary>
    /// 更新一个用户的信息
    /// </summary>
    /// <param name="body">更新用户信息时请求的数据</param>
    ///  <returns>更新用户信息时返回的数据</returns>
    public async Task<User> Update(RequestUser.Update body)
    {

        var result = _db.Updateable(new User {
            Id = body.Id,
            TeamId = body.TeamId,
            UserName = body.UserName,
            PassWord = body.PassWord,
            Role = body.Role,
        }).ExecuteReturnEntityAsync();
        return await result;
        
    }
    /// <summary>
    /// 删除一个用户的信息
    /// </summary>
    /// <param name="body">删除用户信息时请求的数据</param>
    ///  <returns>删除用户信息时返回的数据</returns>
    public async Task<bool> Del(RequestUser.Del body)
    {
        await _db.Updateable<User>()
            .SetColumns(it => it.Status == Status.Delete)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        return  true;
    }
}