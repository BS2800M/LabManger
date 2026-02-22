using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Repository;

/// <summary>
/// 操作类(仓储层)
/// </summary>
public class RepositoryOperation 
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    /// <summary>
    /// 构建仓储类(服务层)
    /// </summary>
    /// <param name="userContext">用户和权限验证接口</param>
    public RepositoryOperation(IUserContext userContext)
    {
        _userContext = userContext;
    }
    /// <summary>
    /// 批量添加操作记录数据
    /// </summary>
    /// <param name="operations">操作列表</param>
    /// <returns>添加的操作列表</returns>
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
    /// <summary>
    /// //查找一段范围内的操作数据
    /// </summary>
    /// <param name="startId">操作起始id</param>
    /// <param name="endId">操作结束id</param>
    /// <returns>操作数据列表</returns>
    public async Task<List<ResponseOperation.InboundData>> GetOperationsWithDetailsAsync(int startId, int endId) 
    {
        var exp = Expressionable.Create<Operation>();
        exp.And(o => o.Status == Status.Enable);
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
    /// <summary>
    /// 获取所有操作数据中最大的id
    /// </summary>
    /// <returns>最大id</returns>
    public async Task<int> GetMaxOperationIdAsync() //获取最大id
    {
        return await _db.Queryable<Operation>().MaxAsync(o => o.Id);
    }
    
    /// <summary>
    /// 根据条码号得出用这条码出库的数量（用来判断是否已经出过库了）
    /// </summary>
    /// <param name="barcodenumber">唯一条码号</param>
    /// <returns>用这个条码出库的数量</returns>
    public async Task<int> OutboundCount(string barcodenumber) 
    {

        int outcount=await _db.Queryable<Operation>()
            .Where(o=>o.Status == Status.Enable && o.BarcodeNumber==barcodenumber && o.Action==OperationAction.Outbound)
            .CountAsync();
        return outcount;
    }
    /// <summary>
    /// 根据试剂id 和批号id得出库的数量（用来计算库存用 修正库存）
    /// </summary>
    /// <param name="reagentid">试剂id</param>
    /// <param name="lotid">批号id</param>
    /// <returns>这个试剂id 批号id的出库数量</returns>
    public async Task<int> OutboundCount(int reagentid, int lotid) 
    {

        int outcount = await _db.Queryable<Operation>()
            .Where(o => o.Status == Status.Enable && o.ReagentId == reagentid && o.LotId == lotid && o.Action == OperationAction.Outbound)
            .CountAsync();
        return outcount;
    }
    /// <summary>
    /// 根据试剂id 和批号id和开始结束时间得出库的数量（用来统计）
    /// </summary>
    /// <param name="reagentid">试剂id</param>
    /// <param name="lotid">批号id</param>
    /// <param name="starttime">开始时间</param>
    /// <param name="endtime">结束时间</param>
    /// <returns>这个试剂id 批号id 这段时间的出库数量</returns>

    public async Task<int> OutboundCount(int reagentid, int lotid, bool onlylot, DateTime starttime, DateTime endtime)
    {
        var exp = Expressionable.Create<Operation>();
        exp.And(o => o.Status == Status.Enable && o.ReagentId == reagentid);
        exp.And(o => o.CreateTime >= starttime && o.CreateTime <= endtime);
        exp.And(o => o.Action == OperationAction.Outbound);
        exp.AndIF(onlylot, o => o.LotId == lotid);
        int outcount = await _db.Queryable<Operation>()
            .Where(exp.ToExpression())
            .CountAsync();
        return outcount;
    }
    /// <summary>
    /// 根据条码号得出用这条码入库的数量（用来判断是否已经入过库了）
    /// </summary>
    /// <param name="barcodenumber">唯一条码号</param>
    /// <returns>用这个条码入库的数量</returns>

    public async Task<int> InboundCount(string barcodenumber) 
    {
        int incount=await _db.Queryable<Operation>()
            .Where(o=>o.Status == Status.Enable && o.BarcodeNumber==barcodenumber && o.Action==OperationAction.Inbound)
            .CountAsync();
        return incount;
    }
    /// <summary>
    /// 根据试剂id 和批号id得入库的数量（用来计算库存用 修正库存）
    /// </summary>
    /// <param name="reagentid">试剂id</param>
    /// <param name="lotid">批号id</param>
    /// <returns>这个试剂id 批号id的入库数量</returns>
    
    public async Task<int> InboundCount(int reagentid, int lotid) //得出入库数量
    {
        int incount = await _db.Queryable<Operation>()
            .Where(o => o.Status == Status.Enable && o.ReagentId == reagentid && o.LotId == lotid && o.Action == OperationAction.Inbound)
            .CountAsync();
        return incount;
    }
    /// <summary>
    /// 根据试剂id 和批号id和开始结束时间得入库的数量（用来统计）
    /// </summary>
    /// <param name="reagentid">试剂id</param>
    /// <param name="lotid">批号id</param>
    /// <param name="starttime">开始时间</param>
    /// <param name="endtime">结束时间</param>
    /// <returns>这个试剂id 批号id 这段时间的入库数量</returns>
    public async Task<int> InboundCount(int reagentid,int lotid,bool onlylot, DateTime starttime, DateTime endtime)
    {
        var exp = Expressionable.Create<Operation>();
        exp.And(o => o.Status == Status.Enable && o.ReagentId == reagentid);
        exp.And(o => o.CreateTime>=starttime&&o.CreateTime<=endtime);
        exp.And(o=>o.Action==OperationAction.Inbound);
        exp.AndIF(onlylot,o=>o.LotId==lotid);

        int incount=await _db.Queryable<Operation>()
            .Where(exp.ToExpression())
            .CountAsync();
        return incount;
    }
    /// <summary>
    /// 根据条码号来查询操作数据
    /// </summary>
    /// <param name="barcodenumber">条码号</param>
    /// <returns>查询到的操作数据</returns>

    public Operation GetOperation(string barcodenumber)//输入条码号 查询对应的记录
    {
        var result =  _db.Queryable<Operation>()
            .Single(o => o.Status == Status.Enable && o.BarcodeNumber == barcodenumber && o.Action == OperationAction.Inbound);
        return result;
    }
    
    /// <summary>
    /// 展示操作
    /// </summary>
    /// <param name="search">展示操作请求的数据</param>
    /// <param name="totalcount">操作个数</param>
    ///  <param name="totalpage">总页数</param>
    /// <returns>展示操作返回的数据</returns>

    public async Task<List<ResponseOperation.ShowData>> Show(RequestOperation.Show search, RefAsync<int> totalcount, RefAsync<int> totalpage) //展示show
    {
        string? reagentname=search.ReagentName;
        string? barcodenumber=search.BarcodeNumber;
        int page=search.Page;
        int pageSize=search.PageSize;
        var exp = Expressionable.Create<Operation>();
        exp.And(o=>o.Status == Status.Enable);
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
    /// <summary>
    /// 修改一个操作
    /// </summary>
    /// <param name="body">修改一个操作数据请求的数据</param>
    /// <returns>修改一个操作返回的数据</returns>
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

    
     /// <summary>
    /// 根据操作id查询操作
    /// </summary>
    /// <param name="id">操作id</param>
    /// <returns>返回的操作</returns>


    public async Task<Operation> ShowOne(int id) 
    {
        var result = await _db.Queryable<Operation>()
            .SingleAsync(o => o.Id == id);
        return result;
    }
    
     /// <summary>
    /// 删除一个操作
    /// </summary>
    /// <param name="body">删除一个操作数据请求的数据</param>
    /// <returns>删除一个操作返回的数据</returns>
    public async Task<Operation> Del(int id) 
    {
        var result= await _db.Updateable<Operation>()
            .SetColumns(it => it.Status == Status.Delete)
            .Where(it => it.Id == id)
            .ExecuteReturnEntityAsync();
        return result;

    }
    


}