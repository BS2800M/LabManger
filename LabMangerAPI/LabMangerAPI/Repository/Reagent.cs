
using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Repository;

public class RepositoryReagent : ICrud<Reagent, Reagent, RequestReagent.Add, RequestReagent.Show, RequestReagent.Update, RequestReagent.Del>
{
    readonly SqlSugarClient _db = MySqlSugar.Db;
    readonly IUserContext _userContext;
    
    public RepositoryReagent(IUserContext userContext)
    {
        _userContext = userContext;
    }

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
            
            Manufacturer = body.Manufacturer,
            Note = body.Note,
            WarnNumber = body.WarnNumber,
            WarnDays = body.WarnDays,
            CreateTime = DateTime.Now,
        }).ExecuteReturnEntityAsync();
        
        return await result;
    }
    
    public async Task<List<Reagent>> Show(RequestReagent.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        // 只负责数据查询，不处理权限验证
        string? name = search.Name;
        int page = search.Page;
        int pageSize = search.PageSize;
        
        var exp = Expressionable.Create<Reagent>();
        exp.And(r => r.Active == true);
        exp.AndIF(string.IsNullOrEmpty(name) == false, r => r.Name.Contains(name!));
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        
        var result = _db.Queryable<Reagent>()
            .Where(exp.ToExpression())
            .OrderBy(r => r.Id, OrderByType.Desc)
            .ToPageListAsync(page, pageSize, totalcount, totalpage);

        return await result;
    }

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

            Manufacturer = body.Manufacturer,
            Note = body.Note,
            WarnNumber = body.WarnNumber,
            WarnDays = body.WarnDays,
            CreateTime = DateTime.Now,
        }).ExecuteReturnEntityAsync();
        
        return await result;
    }

    public async Task<bool> Del(RequestReagent.Del body)
    {
        // 只负责数据删除，权限验证移到服务层
        await _db.Updateable(new Reagent
        {
            Id = body.Id,
            Active = false,
        }).ExecuteReturnEntityAsync();
        
        return true;
    }

    public async Task<List<ResponseReagent.ShowAllData>> ShowAll()
    {
        var exp = Expressionable.Create<Reagent>();
        exp.And(r => r.Active == true);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var result = _db.Queryable<Reagent>()
            .Where(exp.ToExpression())
            .OrderBy(r => r.Id, OrderByType.Desc)
            .Select(r => new ResponseReagent.ShowAllData { Id = r.Id, Name = r.Name })
            .ToListAsync();

            
        return await result;
    }
}