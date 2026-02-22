using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;

namespace LabMangerAPI.Repository;
/// <summary>
/// 批号类(仓储层)
/// </summary>
public class RepositoryLot : ICrud<Lot, ResponseLot.ShowData, RequestLot.Add, RequestLot.Show, RequestLot.Update, RequestLot.Del>
{
    readonly SqlSugarClient _db = MySqlSugar.Db;
    readonly IUserContext _userContext;
    /// <summary>
    /// 构建批号类(仓储层)
    /// </summary>
    /// <param name="userContext">用户和权限验证接口</param>
    public RepositoryLot(IUserContext userContext)
    {
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个批号
    /// </summary>
    /// <param name="body">增加批号时请求的数据</param>
    ///  <returns>增加批号时返回的数据</returns>
    public async Task<Lot> Add(RequestLot.Add body)
    {
        // 只负责数据插入，不处理业务逻辑
        var result = _db.Insertable(new Lot
        {
            TeamId = _userContext.TeamId,
            Name = body.Name,
            ExpirationDate = body.ExpirationDate,
            ReagentId = body.ReagentId,
            Status = body.Status,   

        }).ExecuteReturnEntityAsync();
        
        return await result;
    }
    /// <summary>
    /// 展示多个批号
    /// </summary>
    /// <param name="search">展示批号时请求的数据</param>
    /// <param name="totalcount">ref 批号总数</param>
    /// <param name="totalcount">ref 总页数</param>
    ///  <returns>返回展示多个批号时返回的数据</returns>
    public async Task<List<ResponseLot.ShowData>> Show(RequestLot.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        // 只负责数据查询，不处理权限验证
        string? name = search.Name;
        int page = search.Page;
        int pageSize = search.PageSize;
        
        var exp = Expressionable.Create<Lot>();
        exp.And(l=>l.Status != Status.Delete);
        exp.AndIF(string.IsNullOrEmpty(name) == false, l => l.Name.Contains(name!));
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        
        var result = _db.Queryable<Lot>()
            .LeftJoin<Reagent>((l, r) => l.ReagentId == r.Id)
            .Where(exp.ToExpression())
            .OrderBy(l => l.Status, OrderByType.Asc)
            .OrderBy(l => l.Id, OrderByType.Desc)
            .Select((l, r) => new ResponseLot.ShowData
            {
                Id = l.Id,
                Name = l.Name,
                ReagentId = l.ReagentId,
                ExpirationDate = l.ExpirationDate,
                TeamId = l.TeamId,
                ReagentName = r.Name,
                Status = l.Status,
            })
            .ToPageListAsync(page, pageSize, totalcount, totalpage);

        return await result;
    }
    /// <summary>
    /// 更新一个批号的信息
    /// </summary>
    /// <param name="body">更新批号信息时请求的数据</param>
    ///  <returns>更新批号信息时返回的数据</returns>
    public async Task<Lot> Update(RequestLot.Update body)
    {
        // 只负责数据更新，权限验证移到服务层
        var result = _db.Updateable(new Lot
        {
            Id = body.Id,
            TeamId = _userContext.TeamId,
            Name = body.Name,
            ExpirationDate = body.ExpirationDate,
            ReagentId = body.ReagentId,
            Status = body.Status,
        }).ExecuteReturnEntityAsync();
        
        return await result;
    }
    /// <summary>
    /// 删除一个批号的信息
    /// </summary>
    /// <param name="body">删除批号信息时请求的数据</param>
    ///  <returns>删除批号信息时返回的数据</returns>
    public async Task<bool> Del(RequestLot.Del body)
    {
        // 只负责数据删除，权限验证移到服务层
        await _db.Updateable<Lot>()
            .SetColumns(it => it.Status == Status.Delete)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        
        return true;
    }
    /// <summary>
    /// 展示所有批号的简易信息（不带过滤功能）
    /// </summary>
    /// <param name="body">展示所有批号信息时请求的数据</param>
    ///  <returns>展示所有批号信息时返回的数据</returns>
    public async Task<List<ResponseLot.ShowAllData>> ShowAll(int reagentId)
    {
        var exp = Expressionable.Create<Lot>();
        exp.And(l => l.Status == Status.Enable);
        exp.And(l => l.ReagentId == reagentId);
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        
        var result = _db.Queryable<Lot>()
            .Where(exp.ToExpression())
            .OrderBy(l => l.Id, OrderByType.Desc)
            .Select(l => new ResponseLot.ShowAllData { Id = l.Id, Name = l.Name })
            .ToListAsync();
            
        return await result;
    }
}