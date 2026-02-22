using LabMangerAPI.Validator;
using LabMangerAPI.DTOs;
using LabMangerAPI.DTOs.Common;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;

namespace LabMangerAPI.Repository;
/// <summary>
/// 库存类(仓储层)
/// </summary>
public class RepositoryInventory
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    /// <summary>
    /// 构建库存类(服务层)
    /// </summary>
    /// <param name="userContext">用户和权限验证接口</param>
    public RepositoryInventory(IUserContext userContext)
    {
        _userContext = userContext;
    }
    /// <summary>
    /// 增加库存（这里指的是在数据库里库存表中添加一行）
    /// </summary>
    /// <param name="reagentId">试剂id</param>
    /// <param name="lotid">批号id</param>
    public async Task<Inventory> Add(int reagentid, int lotid) 
    {
        var result = await _db.Insertable(new Inventory
        {
            ReagentId = reagentid,
            LotId = lotid,
            Number = 0,
            TeamId = _userContext.TeamId
        }).ExecuteReturnEntityAsync();
        return result;
    }
    /// <summary>
    /// 展示多个库存
    /// </summary>
    /// <param name="search">展示库存时请求的数据</param>
    ///  <param name="totalcount">展示库存总行数</param>
    ///  <param name="totalpage">总页数</param>
    ///  <returns>展示多个库存时返回的数据</returns>
    public async Task<List<ResponseInventory.ShowData>> Show(RequestInventory.Show search,RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        string? reagentname = search.ReagentName;
        int page = search.Page;
        int pageSize = search.PageSize;
        var exp = Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Status != Status.Delete &&i.Lot!.Status != Status.Delete);
        exp.AndIF(string.IsNullOrEmpty(reagentname) == false, i =>i.Reagent!.Name.Contains(reagentname!) );
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var result = _db.Queryable<Inventory>()
            .LeftJoin<Reagent>((i, r) => i.ReagentId == r.Id)
            .LeftJoin<Lot>((i, r,l) => i.LotId == l.Id)
            .Where(exp.ToExpression())
            .OrderBy((i,r,l)=>SqlFunc.IIF(r.Status == Status.Enable && l.Status == Status.Enable,true,false),OrderByType.Desc)
            .OrderBy((i, r, l) => SqlFunc.IIF(
                r.WarnNumber >= i.Number || l.ExpirationDate <= DateTime.Now, 
                0,  // 有警告的排在前面 (0 < 1)
                1   // 无警告的排在后面
            ))
            .Select((i,r,l) => new ResponseInventory.ShowData
            {
                Id = i.Id,
                ReagentId = i.ReagentId,
                LotId = i.LotId,
                ReagentName = r.Name,
                LotName = l.Name,
                Number = i.Number,
                LotExpirationDate = l.ExpirationDate,
                ReagentWarnNumber = r.WarnNumber,
                Specifications = r.Specifications,
                WarnNumber = r.WarnNumber,
                Status = SqlFunc.IIF(r.Status == Status.Enable && l.Status == Status.Enable,Status.Enable,Status.Disable),
                Warning = SqlFunc.IIF(r.WarnNumber >= i.Number, "number", "") + 
                          SqlFunc.IIF(l.ExpirationDate <= DateTime.Now, "time", "")
                
            })
            .ToPageListAsync(page, pageSize, totalcount, totalpage);
        return await result;
    }
    /// <summary>
    /// 更新库存数量 在原来的基础上加减
    /// </summary>
    /// <param name="reagentId">试剂id</param>
    ///  <param name="lotid">批号id</param>
    ///  <param name="number">加减个数</param>
    ///  <returns> 更新试剂库存后的结果类</returns>
    public async Task<InventoryUpdateResult> UpdatePlus(int reagentId, int lotid, int number) 
    {
        using var tran = _db.Ado.UseTran();
        try
        {
            var exp = Expressionable.Create<Inventory>();
            exp.And(i=>i.ReagentId == reagentId && i.LotId == lotid);
            var result= await _db.Queryable<Inventory>()
                .LeftJoin<Reagent>((i,r)=>i.ReagentId == r.Id)
                .Where(exp.ToExpression())
                .Select((i,r)=>new
                {
                    i.Id,
                    i.ReagentId,
                    i.LotId,
                    i.Number,
                    ReagentName = r.Name,
                    r.WarnNumber,
                })
                .ToListAsync();
            
            var currentStock = result.First().Number;
            var reagentName = result.First().ReagentName;
            
            if (currentStock + number < 0) //如果库存数量小于出库数量 不予出库
            {
                return InventoryUpdateResult.InsufficientStock(reagentName, currentStock, number);
            }
            await _db.Updateable(new Inventory
            {
                Id = result.First().Id,
                ReagentId = result.First().ReagentId,
                LotId = result.First().LotId,
                Number = currentStock + number,
            }).ExecuteReturnEntityAsync();
            tran.CommitTran();
            if (currentStock + number <= result.First().WarnNumber) //如果库存数量达到警告线则提醒 但会正常出库
            {
                return InventoryUpdateResult.WarningStock(reagentName, currentStock, number);
            }
            return InventoryUpdateResult.Success(reagentName, currentStock + number, number);
        }
        catch (Exception ex)
        {
            Console.WriteLine("错误"+ex.Message);
            tran.RollbackTran();
            throw;
        }
    }
    /// <summary>
    /// 更新库存数量 直接赋予数字
    /// </summary>
    /// <param name="id">库存id</param>
    ///  <param name="number">库存数量</param>
    ///  <returns> 更新库存返回的数据</returns>
    public async Task<Inventory> Audit(int id,int number) //更新库存 直接赋予数字
    {
        var update = await _db.Updateable(new Inventory
        {
            Id = id,
            Number = number,
        })
            .UpdateColumns(it => new { it.Number }) 
            .ExecuteReturnEntityAsync();
        return  update;
    }
    /// <summary>
    /// 更新库存数量 直接赋予数字
    /// </summary>
    /// <param name="reagentId">试剂id</param>
    ///  <param name="lotid">批号id</param>
    ///  <param name="number">库存数量</param>
    ///  <returns> 更新库存返回的数据</returns>
    
    public async Task<Inventory> Audit(int reagentid, int lotid, int number) //更新库存 直接赋予数字
    {
        var update = await _db.Updateable(new Inventory
        {
            Number = number,
        })
            .Where(it => it.ReagentId == reagentid && it.LotId == lotid)
            .UpdateColumns(it => new { it.Number })
            .ExecuteReturnEntityAsync();
        return update;

    }
    
    /// <summary>
    /// 展示所有库存 不受任何限制
    /// </summary>
    ///  <returns>展示所有库存时返回的数据</returns>
    public async Task<List<Inventory>> ShowAll() 
    {
        var alllist = _db.Queryable<Inventory>()
            .Where(it => it.Reagent!.Status == Status.Enable && it.Lot!.Status == Status.Enable)
            .ToListAsync();
        return await alllist;

    }
    /// <summary>
    /// 展示仪表盘（主页数据）
    /// </summary>
    /// <param name="search">仪表盘请求数据</param>
    /// <returns>仪表盘返回数据</returns>
    public async Task<ResponseInventory.DashBoardData> DashBoard()
    {
        var exp = Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Status == Status.Enable&&i.Lot!.Status == Status.Enable);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countall =  _db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();
        
        exp=Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Status == Status.Enable&&i.Lot!.Status == Status.Enable);
        exp.And(i=>i.Reagent!.WarnNumber>=i.Number || i.Lot!.ExpirationDate<=DateTime.Now);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countwarn=_db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();
        
        exp=Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Status == Status.Enable&&i.Lot!.Status == Status.Enable);
        exp.And(i=>i.Reagent!.WarnNumber>=i.Number);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countwarnnum=_db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();
        
        exp=Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Status == Status.Enable&&i.Lot!.Status == Status.Enable);
        exp.And(i=>i.Lot!.ExpirationDate<=DateTime.Now);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countwarnexp=_db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();

        return new ResponseInventory.DashBoardData
        {

            TotalNum = await countall,
            WarningTotalNum = await countwarn,
            WarningNumNum = await countwarnnum,
            WarningExpNum = await countwarnexp,
        };
    }
}