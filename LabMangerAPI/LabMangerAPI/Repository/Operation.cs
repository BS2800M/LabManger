using LabMangerAPI.RequestType;
using LabMangerAPI.SugarSql;
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

     public async Task<List<Operation>> CreateOperationsAsync(List<Operation> operations) //批量更新数据
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
    
    
    public async Task<int> OutboundCount(string barcodenumber)
    {

        int outcount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.BarcodeNumber==barcodenumber && o.Action=="outbound")
            .CountAsync();
        return outcount;
    }
    public async Task<int> OutboundCount(int reagentid ,int lotid)
    {

        int outcount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.ReagentId==reagentid && o.LotId==lotid &&o.Action=="outbound")
            .CountAsync();
        return outcount;
    }

    
    public async Task<int> InboundCount(string barcodenumber)
    {
        int incount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.BarcodeNumber==barcodenumber && o.Action=="inbound")
            .CountAsync();
        return incount;
    }
    
    public async Task<int> InboundCount(int reagentid ,int lotid)
    {
        int incount=await _db.Queryable<Operation>()
            .Where(o=>o.Active==true && o.ReagentId==reagentid&&o.LotId==lotid && o.Action=="inbound")
            .CountAsync();
        return incount;
    }
    
    

    public Operation GetOperation(string barcodenumber)//输入条码号 查询对应的记录
    {
        var result =  _db.Queryable<Operation>()
            .Single(o => o.Active == true && o.BarcodeNumber == barcodenumber && o.Action == "inbound");
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

    public async Task<Operation> Del(int id)
    {
        var result= await _db.Updateable(new Operation {
            Id= id,
            Active = false,
        }).ExecuteReturnEntityAsync();
        return result;

    }
}