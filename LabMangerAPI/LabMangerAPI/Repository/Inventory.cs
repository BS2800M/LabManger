using LabMangerAPI.Validator;
using LabMangerAPI.DTOs;
using LabMangerAPI.DTOs.Common;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;

namespace LabMangerAPI.Repository;

public class RepositoryInventory
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    public RepositoryInventory(IUserContext userContext)
    {
        _userContext = userContext;
    }

    public async Task<Inventory> Add(int reagentId, int lotid) //创建一张新的库存行
    {
        var result = await _db.Insertable(new Inventory
            {
                ReagentId = reagentId,
                LotId = lotid,
                Number = 0,
                TeamId = _userContext.TeamId
            }).ExecuteReturnEntityAsync();
        return result;
    }

    public async Task<List<ResponseInventory.ShowData>> Show(RequestInventory.Show search,RefAsync<int> totalcount, RefAsync<int> totalpage)
    {
        string? reagentname = search.ReagentName;
        int page = search.Page;
        int pageSize = search.PageSize;
        var exp = Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.IsDelete == false &&i.Lot!.IsDelete == false);
        exp.AndIF(string.IsNullOrEmpty(reagentname) == false, i =>i.Reagent!.Name.Contains(reagentname!) );
        
        // 基础数据访问权限（团队隔离）
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var result = _db.Queryable<Inventory>()
            .LeftJoin<Reagent>((i, r) => i.ReagentId == r.Id)
            .LeftJoin<Lot>((i, r,l) => i.LotId == l.Id)
            .Where(exp.ToExpression())
            .OrderBy((i,r,l)=>SqlFunc.IIF(r.Active==true && l.Active==true,true,false),OrderByType.Desc)
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
                Active = SqlFunc.IIF(r.Active==true && l.Active==true,true,false),
                Warning = SqlFunc.IIF(r.WarnNumber >= i.Number, "number", "") + 
                          SqlFunc.IIF(l.ExpirationDate <= DateTime.Now, "time", "")
                
            })
            .ToPageListAsync(page, pageSize, totalcount, totalpage);
        return await result;
    }

    public async Task<InventoryUpdateResult> UpdatePlus(int reagentId, int lotid, int number) //更新库存 在原来的基础上加减
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
    
    public async Task<List<Inventory>> ShowAll() //展示所有库存 不受任何限制
    {
        var alllist =  _db.Queryable<Inventory>()
            .Where(it => it.Reagent!.Active==true&&it.Lot!.Active==true)
            .ToListAsync();
        return  await alllist;

    }
    
    public async Task<ResponseInventory.DashBoardData> DashBoard()
    {
        var exp = Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Active==true&&i.Lot!.Active==true&&i.Reagent!.IsDelete==false&&i.Lot!.IsDelete==false);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countall =  _db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();
        
        exp=Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Active==true&&i.Lot!.Active==true&&i.Reagent!.IsDelete==false&&i.Lot!.IsDelete==false);
        exp.And(i=>i.Reagent!.WarnNumber>=i.Number || i.Lot!.ExpirationDate<=DateTime.Now);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countwarn=_db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();
        
        exp=Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Active==true&&i.Lot!.Active==true&&i.Reagent!.IsDelete==false&&i.Lot!.IsDelete==false);
        exp.And(i=>i.Reagent!.WarnNumber>=i.Number);
        ScopeVerification.CreateScope(ref exp, _userContext.TeamId, _userContext.Role);
        var countwarnnum=_db.Queryable<Inventory>()
            .Where(exp.ToExpression())
            .CountAsync();
        
        exp=Expressionable.Create<Inventory>();
        exp.And(i=>i.Reagent!.Active==true&&i.Lot!.Active==true&&i.Reagent!.IsDelete==false&&i.Lot!.IsDelete==false);
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