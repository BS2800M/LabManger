
using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;

namespace LabMangerAPI.Repository;
/// <summary>
/// 小组类（仓储层）
/// </summary>
public class RepositoryTeam:ICrud<Team,Team,RequestTeam.Add,RequestTeam.Show,RequestTeam.Update,RequestTeam.Del>
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    /// <summary>
    /// 构建小组类(仓储层)
    /// </summary>
    /// <param name="userContext">用户和权限验证接口</param>
    public RepositoryTeam(IUserContext userContext)
    {   
        _userContext = userContext;
    }

    /// <summary>
    /// 增加一个小组
    /// </summary>
    /// <param name="body">增加小组时请求的数据</param>
    ///  <returns>增加一个小组用时返回的数据</returns>
    public async Task<Team> Add(RequestTeam.Add body)
    {
       var result=_db.Insertable(new  Team {
           Name= body.Name,
           Note= body.Note,
           Phone = body.Phone,
       }).ExecuteReturnEntityAsync();
       return await result;
    }
    /// <summary>
    /// 展示多个小组
    /// </summary>
    /// <param name="search">展示小组时请求的数据</param>
    /// <param name="totalcount">ref 小组总数</param>
    /// <param name="totalcount">ref 总页数</param>
    ///  <returns>展示多个小组时返回的数据</returns>
    public async Task<List<Team>> Show(RequestTeam.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        string? name = search.Name;
        int page = search.Page;
        int pageSize = search.PageSize;
        var exp = Expressionable.Create<Team>();
        exp.And(t => t.Status == Status.Enable);
        exp.AndIF(string.IsNullOrEmpty(name) == false, t => t.Name.Contains(name!));
        var result = _db.Queryable<Team>()
            .Where(exp.ToExpression())
            .OrderBy(t => t.Id, OrderByType.Desc)
            .ToPageListAsync(page, pageSize, totalcount, totalpage);

        return await result;

    }
    /// <summary>
    /// 更新一个小组的信息
    /// </summary>
    /// <param name="body">更新小组信息时请求的数据</param>
    ///  <returns>更新小组信息时返回的数据</returns>
    public async Task<Team> Update(RequestTeam.Update body)
    {
        var result = _db.Updateable(new Team {
            Id= body.Id, 
            Name= body.Name,
            Note= body.Note,
            Phone = body.Phone,
        }).ExecuteReturnEntityAsync();
        return await result;
        
    }
    /// <summary>
    /// 删除一个小组的信息
    /// </summary>
    /// <param name="body">删除小组信息时请求的数据</param>
    ///  <returns>删除小组信息时返回的数据</returns>
    public async Task<bool> Del(RequestTeam.Del body)
    {
        await _db.Updateable<Team>()
            .SetColumns(it => it.Status == Status.Delete)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        return  true;
    }
}