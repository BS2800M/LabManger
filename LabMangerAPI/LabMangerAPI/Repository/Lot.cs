using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;

namespace LabMangerAPI.Repository;

public class RepositoryLot : ICrud<Lot, ResponseLot.ShowData, RequestLot.Add, RequestLot.Show, RequestLot.Update, RequestLot.Del>
{
    readonly SqlSugarClient _db = MySqlSugar.Db;
    readonly IUserContext _userContext;
    
    public RepositoryLot(IUserContext userContext)
    {
        _userContext = userContext;
    }

    public async Task<Lot> Add(RequestLot.Add body)
    {
        // 只负责数据插入，不处理业务逻辑
        var result = _db.Insertable(new Lot
        {
            TeamId = _userContext.TeamId,
            Name = body.Name,
            ExpirationDate = body.ExpirationDate,
            ReagentId = body.ReagentId,

        }).ExecuteReturnEntityAsync();
        
        return await result;
    }
    
    public async Task<List<ResponseLot.ShowData>> Show(RequestLot.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        // 只负责数据查询，不处理权限验证
        string? name = search.Name;
        int page = search.Page;
        int pageSize = search.PageSize;
        
        var exp = Expressionable.Create<Lot>();
        exp.And(l => l.Active == true);
        exp.AndIF(string.IsNullOrEmpty(name) == false, l => l.Name.Contains(name!));
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        
        var result = _db.Queryable<Lot>()
            .LeftJoin<Reagent>((l, r) => l.ReagentId == r.Id)
            .Where(exp.ToExpression())
            .OrderBy(l => l.Id, OrderByType.Desc)
            .Select((l, r) => new ResponseLot.ShowData
            {
                Id = l.Id,
                Name = l.Name,
                ReagentId = l.ReagentId,
                ExpirationDate = l.ExpirationDate,
                TeamId = l.TeamId,
                ReagentName = r.Name,
            })
            .ToPageListAsync(page, pageSize, totalcount, totalpage);

        return await result;
    }

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
        }).ExecuteReturnEntityAsync();
        
        return await result;
    }

    public async Task<bool> Del(RequestLot.Del body)
    {
        // 只负责数据删除，权限验证移到服务层
        await _db.Updateable<Lot>()
            .SetColumns(it => it.Active == false)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        
        return true;
    }
    
    public async Task<List<ResponseLot.ShowAllData>> ShowAll(int reagentId)
    {
        var exp = Expressionable.Create<Lot>();
        exp.And(l => l.Active == true);
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