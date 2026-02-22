
using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Repository;
/// <summary>
/// 试剂类(仓储层)
/// </summary>
public class RepositoryReagent : ICrud<Reagent, Reagent, RequestReagent.Add, RequestReagent.Show, RequestReagent.Update, RequestReagent.Del>
{
    readonly SqlSugarClient _db = MySqlSugar.Db;
    readonly IUserContext _userContext;
    /// <summary>
    /// 构建试剂类(仓储层)
    /// </summary>
    /// <param name="userContext">用户和权限验证接口</param>
    public RepositoryReagent(IUserContext userContext)
    {
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个试剂
    /// </summary>
    /// <param name="body">增加试剂时请求的数据</param>
    ///  <returns>增加试剂时返回的数据</returns>
    public async Task<Reagent> Add(RequestReagent.Add body)
    {
        // 只负责数据插入，不处理业务逻辑
        var result = _db.Insertable(new Reagent
        {
            TeamId = _userContext.TeamId,
            Name = body.Name,
            Specifications = body.Specifications,
            Price = body.Price,
            StorageCondition = body.StorageCondition,
            Status = body.Status,
            Manufacturer = body.Manufacturer,
            Note = body.Note,
            WarnNumber = body.WarnNumber,
            WarnDays = body.WarnDays,
            CreateTime = DateTime.Now,
        }).ExecuteReturnEntityAsync();
        
        return await result;
    }
    /// <summary>
    /// 展示多个试剂
    /// </summary>
    /// <param name="search">展示试剂时请求的数据</param>
    /// <param name="totalcount">ref 试剂总数</param>
    /// <param name="totalcount">ref 总页数</param>
    ///  <returns>返回展示多个试剂时返回的数据</returns>
    public async Task<List<Reagent>> Show(RequestReagent.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        // 只负责数据查询，不处理权限验证
        string? name = search.Name;
        int page = search.Page;
        int pageSize = search.PageSize;
        
        var exp = Expressionable.Create<Reagent>();
        exp = exp.And(r => r.Status != Status.Delete);
        exp.AndIF(string.IsNullOrEmpty(name) == false, r => r.Name.Contains(name!));
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        
        var result = _db.Queryable<Reagent>()
            .Where(exp.ToExpression())
            .OrderBy(r=>r.Status, OrderByType.Asc)
            .OrderBy(r => r.Id, OrderByType.Desc)
            .ToPageListAsync(page, pageSize, totalcount, totalpage);

        return await result;
    }
    /// <summary>
    /// 更新一个试剂的信息
    /// </summary>
    /// <param name="body">更新试剂信息时请求的数据</param>
    ///  <returns>更新试剂信息时返回的数据</returns>
    public async Task<Reagent> Update(RequestReagent.Update body)
    {
        // 只负责数据更新，权限验证移到服务层
        var result = _db.Updateable(new Reagent
        {
            Id = body.Id,
            TeamId = _userContext.TeamId,
            Name = body.Name,
            Specifications = body.Specifications,
            Price = body.Price,
            StorageCondition = body.StorageCondition,
            Status = body.Status,
            Manufacturer = body.Manufacturer,
            Note = body.Note,
            WarnNumber = body.WarnNumber,
            WarnDays = body.WarnDays,
            CreateTime = DateTime.Now,
        }).ExecuteReturnEntityAsync();
        
        return await result;
    }
    /// <summary>
    /// 删除一个试剂的信息
    /// </summary>
    /// <param name="body">删除试剂信息时请求的数据</param>
    ///  <returns>删除试剂信息时返回的数据</returns>
    public async Task<bool> Del(RequestReagent.Del body)
    {
        // 只负责数据删除，权限验证移到服务层
        await _db.Updateable<Reagent>()
            .SetColumns(it => it.Status == Status.Delete)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        
        return true;
    }
    /// <summary>
    /// 展示所有试剂的简易信息（不带过滤功能）
    /// </summary>
    /// <param name="body">展示所有试剂信息时请求的数据</param>
    ///  <returns>展示所有试剂信息时返回的数据</returns>
    public async Task<List<ResponseReagent.ShowAllData>> ShowAll()
    {
        var exp = Expressionable.Create<Reagent>();
        exp.And(r => r.Status == Status.Enable);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var result = _db.Queryable<Reagent>()
            .Where(exp.ToExpression())
            .OrderBy(r => r.Id, OrderByType.Desc)
            .Select(r => new ResponseReagent.ShowAllData { Id = r.Id, Name = r.Name })
            .ToListAsync();

            
        return await result;
    }
}