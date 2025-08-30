using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Repository;


public class RepositoryOperation 
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;

    public RepositoryOperation(IUserContext userContext)
    {
        _userContext = userContext;
    }

     public async Task<List<Operation>> CreateOperationsAsync(List<Operation> operations) //批量添加操作记录数据
    {
        using var tran = _db.Ado.UseTran();
        try
        {
            await _db.Insertable(operations).ExecuteCommandAsync();
            tran.CommitTran();
            return operations;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            tran.RollbackTran();
            throw;
        }
    }
    public async Task<List<ResponseOperation.InboundData>> GetOperationsWithDetailsAsync(int startId, int endId) //查找刚创建的数据
    {
        var exp = Expressionable.Create<Operation>();
        exp.And(o => o.Active == true);
        exp.And(o => o.Id >= startId && o.Id <= endId);
        return await _db.Queryable<Operation>()
            .LeftJoin<Reagent>((o, r) => o.ReagentId == r.Id)
            .LeftJoin<Lot>((o, r, l) => o.LotId == l.Id)
            .LeftJoin<User>((o, r, l, u) => o.UserId == u.Id)
            .Where(exp.ToExpression())
            .Select((o, r, l, u) => new ResponseOperation.InboundData
            {
                Id = o.Id,
                UserName = u.UserName,
                ReagentName = r.Name,
                Lotname = l.Name,
                Note = o.Note,
                Action = "inbound",
                BarcodeNumber = o.BarcodeNumber,
                
            })
            .ToListAsync();
    }
    
    public async Task<int> GetMaxOperationIdAsync() //获取最大id
    {
        return await _db.Queryable<Operation>().MaxAsync(o => o.Id);
    }
    
    
    public async Task<int> OutboundCount(string barcodenumber) //得出出库
    {

        int outcount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.BarcodeNumber==barcodenumber && o.Action==OperationAction.Outbound)
            .CountAsync();
        return outcount;
    }
    public async Task<int> OutboundCount(int reagentid ,int lotid) //得出出库数量
    {

        int outcount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.ReagentId==reagentid && o.LotId==lotid &&o.Action==OperationAction.Outbound)
            .CountAsync();
        return outcount;
    }

    
    public async Task<int> InboundCount(string barcodenumber) //得出入库数量
    {
        int incount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.BarcodeNumber==barcodenumber && o.Action==OperationAction.Inbound)
            .CountAsync();
        return incount;
    }
    
    public async Task<int> InboundCount(int reagentid ,int lotid) //得出入库数量
    {
        int incount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.ReagentId==reagentid&&o.LotId==lotid && o.Action==OperationAction.Inbound)
            .CountAsync();
        return incount;
    }
    
    

    public Operation GetOperation(string barcodenumber)//输入条码号 查询对应的记录
    {
        var result =  _db.Queryable<Operation>()
            .Single(o => o.Active == true && o.BarcodeNumber == barcodenumber && o.Action == OperationAction.Inbound);
        return result;
    }
    
    

    public async Task<List<ResponseOperation.ShowData>> Show(RequestOperation.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage) //展示show
    {
        string? reagentname=search.ReagentName;
        string? barcodenumber=search.BarcodeNumber;
        int page=search.Page;
        int pageSize=search.PageSize;
        var exp = Expressionable.Create<Operation>();
        exp.And(o=>o.Active==true);
        exp.AndIF(search.StartTime !=null, o => o.CreateTime >= search.StartTime);
        exp.AndIF(search.EndTime !=null, o => o.CreateTime <= search.EndTime);
        exp.AndIF(string.IsNullOrEmpty(reagentname)==false,o => o.Reagent!.Name.Contains(reagentname!));
        exp.AndIF(string.IsNullOrEmpty(barcodenumber)==false,o => o.BarcodeNumber.Contains(barcodenumber!));
        ScopeVerification.CreateScope(ref exp,_userContext.TeamId,_userContext.Role);
        var result = _db.Queryable<Operation>()
            .LeftJoin<Reagent>((o, r) => o.ReagentId == r.Id)
            .LeftJoin<Lot>((o, r, l) => o.LotId == l.Id)
            .LeftJoin<User>((o, r, l, u) => o.UserId == u.Id)
            .Where(exp.ToExpression())
            .OrderBy(o => o.Id, OrderByType.Desc)
            .Select((o, r, l, u) => new ResponseOperation.ShowData
            {
                Id = o.Id,
                UserName = u.UserName,
                ReagentId = o.ReagentId,
                LotId = o.LotId,
                ReagentName = r.Name,
                LotName = l.Name,
                Note = o.Note,
                Action = o.Action,
                BarcodeNumber = o.BarcodeNumber,
                CreateTime = o.CreateTime,
            })
            .ToPageListAsync(page, pageSize,totalcount, totalpage);

        return await result;
    }

    public async Task<Operation> Update(RequestOperation.Update body) //修改操作
    {
    var result = await _db.Updateable<Operation>()
        .SetColumns(it => new Operation
        {
            TeamId = _userContext.TeamId,
            ReagentId = body.ReagentId,
            LotId = body.LotId,
            Action = body.Action,
            Note = body.Note,
            CreateTime = body.CreateTime,
            BarcodeNumber = body.BarcodeNumber,
        })
        .Where(it => it.Id == body.Id)
        .ExecuteReturnEntityAsync();
    return result;
    }

    



    public async Task<Operation> ShowOne(int id) //展示一个操作数
    {
        var result = await _db.Queryable<Operation>()
            .SingleAsync(o => o.Id == id);
        return result;
    }
    
    

    public async Task<Operation> Del(int id) //删除
    {
        var result= await _db.Updateable<Operation>()
            .SetColumns(it => it.Active == false)
            .Where(it => it.Id == id)
            .ExecuteReturnEntityAsync();
        return result;

    }
    


    // 新增：根据试剂ID列表批量查询操作记录（智能分页用） 导出表格用
    public async Task<List<ResponseOperation.ExportToExcelDataListData>> ShowOperationsByReagentIds(List<int> reagentIds) 
    {
        if (reagentIds.Count == 0)
            return new List<ResponseOperation.ExportToExcelDataListData>();

        var result = await _db.Queryable<Operation>()
            .Where(o => o.Active == true && reagentIds.Contains(o.ReagentId))
            .LeftJoin<Reagent>((o,r) => o.ReagentId == r.Id)
            .LeftJoin<Lot>((o,r,l) => l.Id == o.LotId)
            .LeftJoin<User>((o,r,l,u) => o.UserId == u.Id)
            .Where((o,r,l,u) => r.Active == true)
            .OrderBy(o => o.ReagentId, OrderByType.Asc)
            .OrderBy(o => o.CreateTime, OrderByType.Asc)
            .Select((o,r,l,u) => new ResponseOperation.ExportToExcelDataListData
            {
                ReagentId = o.ReagentId,
                CreateTime = o.CreateTime,
                LotId = o.LotId,
                LotName = l.Name,
                ExpirationDate = l.ExpirationDate,
                UserName = u.UserName,
                Action = o.Action,
            })
            .ToListAsync();
        return result;
    }
}