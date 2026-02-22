using System.Net;
using LabMangerAPI.Repository;
using LabMangerAPI.DTOs;
using LabMangerAPI.DTOs.Common;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Service;
/// <summary>
/// 操作类(服务层)
/// </summary>
public class ServiceOperation
{
    
    private readonly RepositoryOperation  _repositoryoperation;
    private readonly RepositoryInventory _repositoryInventory;
    private readonly RepositoryReagent _repositoryReagent;
    private readonly IUserContext _userContext;
    /// <summary>
    /// 构建操作类(服务层)
    /// </summary>
    /// <param name="repositoryoperation">操作类（仓储层）</param>
    ///  <param name="repositoryInventory">库存类（仓储层）</param>
    ///  <param name="repositoryReagent">试剂类（仓储层）</param>
    /// <param name="userContext">用户和权限验证接口</param>
    public ServiceOperation(RepositoryOperation repositoryoperation, RepositoryInventory repositoryInventory, RepositoryReagent repositoryReagent, IUserContext userContext)
    {
        _repositoryoperation = repositoryoperation;
        _repositoryInventory = repositoryInventory;
        _repositoryReagent = repositoryReagent;
        _userContext = userContext;
    }
    /// <summary>
    /// 入库
    /// </summary>
    /// <param name="body">入库时请求的数据</param>
    ///  <returns>入库时返回的数据</returns>

    public async Task<ResponseOperation.Inbound> Inbound(RequestOperation.Inbound body) //入库逻辑
    {
        int startId = await _repositoryoperation.GetMaxOperationIdAsync() + 1;
        // 业务逻辑：构建操作列表
        var operations = await BuildOperationsAsync(body);
        // 数据访问：创建操作记录
        await _repositoryoperation.CreateOperationsAsync(operations);

        // 获取ID范围用于查询
        int endId = await _repositoryoperation.GetMaxOperationIdAsync();
        // 数据访问：查询操作详情
        var result = await _repositoryoperation.GetOperationsWithDetailsAsync(startId, endId);
        //更新库存
        var inventoryResults = await BuildInventoryUpdatesAsync(body);
        var messages = inventoryResults.Select(r => r.Message).ToList();

        return new ResponseOperation.Inbound
        {
            Status = 1,
            Message = messages,
            Data = result
        };
    }
    /// <summary>
    /// 根据入库参数生成操作记录列表
    /// </summary>
    /// <param name="body">入库时请求的数据</param>
    ///  <returns>构建好的操作列表</returns>
    private async Task<List<Operation>> BuildOperationsAsync(RequestOperation.Inbound body) 
    {
        var operations = new List<Operation>();
        int startId = await _repositoryoperation.GetMaxOperationIdAsync();
        int currentId = startId;
        
        foreach (var inbound in body.InboundList)
        {
            for (int i = 0; i < inbound.Number; i++)
            {
                operations.Add(new Operation
                {
                    TeamId = _userContext.TeamId,
                    ReagentId = inbound.ReagentId,
                    LotId = inbound.LotId,
                    UserId = int.Parse(_userContext.UserId),
                    BarcodeNumber = GenerateBarcodeNumber(currentId), // 业务逻辑
                    Note = inbound.Note,
                    Action = OperationAction.Inbound,
                    Status = Status.Enable,
                    CreateTime = DateTime.Now
                });
                currentId++;
            }
        }
        return operations;
    }
    /// <summary>
    /// 根据特殊出库参数生成操作记录列表
    /// </summary>
    /// <param name="body">特殊出库时请求的数据</param>
    ///  <returns>构建好的操作列表</returns>
    private async Task<List<Operation>> BuildOperationsAsync(RequestOperation.SpecialOutbound body) // 构建出库操作列表
    {
        var operations = new List<Operation>();
        int startId = await _repositoryoperation.GetMaxOperationIdAsync();
        int currentId = startId;

        foreach (var inbound in body.OutboundList)
        {
            for (int i = 0; i < inbound.Number; i++)
            {
                operations.Add(new Operation
                {
                    TeamId = _userContext.TeamId,
                    ReagentId = inbound.ReagentId,
                    LotId = inbound.LotId,
                    UserId = int.Parse(_userContext.UserId),
                    BarcodeNumber = GenerateBarcodeNumber(currentId), // 业务逻辑
                    Note = inbound.Note,
                    Action = OperationAction.Outbound,
                    Status = Status.Enable,
                    CreateTime = DateTime.Now
                });
                currentId++;
            }
        }
        return operations;
    }
    /// <summary>
    /// 根据id生成唯一试剂条码号
    /// </summary>
    /// <param name="id">试剂id</param>
    ///  <returns>唯一条码号</returns>
    private string GenerateBarcodeNumber(int id)  
    {
        return (id + 100000).ToString();
    }
    /// <summary>
    /// 根据入库参数更新对应库存（多种试剂异步更新）
    /// </summary>
    /// <param name="body">入库时请求的数据</param>
    ///  <returns>库存更新完成对象的集合列表</returns>
    private async Task<List<InventoryUpdateResult>> BuildInventoryUpdatesAsync(RequestOperation.Inbound body) //业务逻辑 批量入库更新库存
    {
        var tasks = new List<Task<InventoryUpdateResult>>();
        foreach (var inbound in body.InboundList)
        {
            tasks.Add(_repositoryInventory.UpdatePlus(inbound.ReagentId, inbound.LotId, inbound.Number));
        }

        var result = await Task.WhenAll(tasks);
        return result.ToList();
    }
    /// <summary>
    /// 根据出库参数更新对应库存（多种试剂异步更新）
    /// </summary>
    /// <param name="body">入库时请求的数据</param>
    ///  <returns>库存更新完成对象的集合列表</returns>
    private async Task<List<InventoryUpdateResult>> BuildInventoryUpdatesAsync(RequestOperation.SpecialOutbound body) //业务逻辑 出库更新库存
    {
        var tasks = new List<Task<InventoryUpdateResult>>();
        foreach (var inbound in body.OutboundList)
        {
            tasks.Add(_repositoryInventory.UpdatePlus(inbound.ReagentId, inbound.LotId, -(inbound.Number)));
        }
        var result = await Task.WhenAll(tasks);
        return result.ToList();
    }
    /// <summary>
    /// 根据条码号出库
    /// </summary>
    /// <param name="body">出库时请求的数据</param>
    ///  <returns>出库完成后返回的数据</returns>
    public async Task<ResponseOperation.Outbound> Outbound(RequestOperation.Outbound body) //根据条码号出库
    {
        int incount= await _repositoryoperation.InboundCount(body.BarcodeNumber);
        int outcount = await _repositoryoperation.OutboundCount(body.BarcodeNumber);

        if (incount == 0 && outcount == 0)
        {
            return new ResponseOperation.Outbound
            {
                Status = 1,
                Message = "该条码未进行入库",
            };
        }
        if (incount == 1 && outcount ==1)
        {
            return new ResponseOperation.Outbound
            {
                Status = 1,
                Message = "该条码已经出库",
            };
        }
        if (incount == 1 && outcount ==0)
        {
            var search = _repositoryoperation.GetOperation(body.BarcodeNumber);
            var createlist=new List<Operation>();
            createlist.Add(
                new Operation{
                    ReagentId = search.ReagentId,
                    LotId = search.LotId,
                    UserId = int.Parse(_userContext.UserId),
                    Action = OperationAction.Outbound,
                    Status = Status.Enable,
                    BarcodeNumber = search.BarcodeNumber,
                    Note = search.Note,
                    CreateTime = DateTime.Now
                });
            await _repositoryoperation.CreateOperationsAsync(createlist);
            var response = await _repositoryInventory.UpdatePlus(search.ReagentId, search.LotId, -1);
            return new ResponseOperation.Outbound
            {
                Status = 0,
                Message = response.Message,
            };
        }
        throw new HttpRequestException("出库失败",null,HttpStatusCode.Forbidden);
    }
    /// <summary>
    /// 特殊出库
    /// </summary>
    /// <param name="body">出库时请求的数据</param>
    ///  <returns>出库完成后返回的数据</returns>
    public async Task<ResponseOperation.SpecialOutbound> SpecialOutbound(RequestOperation.SpecialOutbound body) 
    {

        var inventoryResults = await BuildInventoryUpdatesAsync(body);
        
        // 使用结构化结果来优雅地处理库存不足的情况
        var validOutboundItems = body.OutboundList
            .Zip(inventoryResults, (outbound, result) => new { Outbound = outbound, Result = result })
            .Where(item => item.Result.IsSuccess) // 使用结构化结果判断是否成功
            .Select(item => item.Outbound)
            .ToList();
        
        // 创建新的 body 对象，只包含有效的出库项
        var filteredBody = new RequestOperation.SpecialOutbound
        {
            OutboundList = validOutboundItems
        };
        var operations = await BuildOperationsAsync(filteredBody);
        await _repositoryoperation.CreateOperationsAsync(operations);

        // 提取消息用于返回
        var messages = inventoryResults.Select(r => r.Message).ToList();

        return new ResponseOperation.SpecialOutbound
        {
            Status = 1,
            Message = messages,
        };
    }
    /// <summary>
    /// 展示操作列表
    /// </summary>
    /// <param name="body">展示操作列表时请求的数据</param>
    ///  <returns>展示操作列表后返回的数据</returns>
    public async Task<ResponseOperation.Show> Show(RequestOperation.Show search) //展示操作
    {
        RefAsync<int> totalcount=new RefAsync<int>();
        RefAsync<int> totalpage=new RefAsync<int>();
        var result=await (_repositoryoperation.Show(search,totalcount,totalpage));
        return new ResponseOperation.Show
        {
            Status = 1,
            Message = "成功",
            Data = result,
            TotalPage = totalpage,
            TotalCount = totalcount
        };
    }
    /// <summary>
    /// 更新一个操作（多种试剂异步更新）
    /// </summary>
    /// <param name="body">更新操作列表时请求的数据</param>
    ///  <returns>更新操作列表后返回的数据</returns>
    public async Task<ResponseOperation.Update> Update(RequestOperation.Update body) //更新操作
    {
        if (!await ResourceVerification.CheckResourceExist<Operation>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        if (!await ResourceVerification.CheckResourceExist<Reagent>(MySqlSugar.Db, body.ReagentId)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源试剂id", null, HttpStatusCode.Forbidden);
        }
        if (!await ResourceVerification.CheckResourceExist<Lot>(MySqlSugar.Db, body.LotId)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源批号id", null, HttpStatusCode.Forbidden);
        }
        
    
        if (!await ResourceVerification.CheckResourcePermission<Operation>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        var updatebefore=await _repositoryoperation.ShowOne(body.Id); //获取被改前的操作models
        var updateafter= await _repositoryoperation.Update(body); //获取被改后的操作models
        
        //修正库存 被改的操作后改后的操作都要改 
        var inboundcountbefore=await _repositoryoperation.InboundCount( updatebefore.ReagentId,  updatebefore.LotId); 
        var outboundcountbefore=await _repositoryoperation.OutboundCount( updatebefore.ReagentId,  updatebefore.LotId);
        await _repositoryInventory.Audit( updatebefore.ReagentId,  updatebefore.LotId, inboundcountbefore-outboundcountbefore);
        
        
        var inboundcountafter=await _repositoryoperation.InboundCount(updateafter.ReagentId, updateafter.LotId);
        var outboundcountafter=await _repositoryoperation.OutboundCount(updateafter.ReagentId, updateafter.LotId);
        await _repositoryInventory.Audit(updateafter.ReagentId, updateafter.LotId, inboundcountafter-outboundcountafter);
        
        return new ResponseOperation.Update
        {
            Status = 1,
            Message = "修改成功",
            Data = updateafter,
        };
    }
    /// <summary>
    /// 删除一个操作（多种试剂异步更新）
    /// </summary>
    /// <param name="body">删除操作列表时请求的数据</param>
    ///  <returns>删除操作列表后返回的数据</returns>
    public async Task<ResponseOperation.Del>  Del(RequestOperation.Del body) //删除操作
    {
        if (!await ResourceVerification.CheckResourceExist<Operation>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        
        if (!await ResourceVerification.CheckResourcePermission<Operation>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        var result= await _repositoryoperation.Del(body.Id); //修正库存
        var inboundcount=await _repositoryoperation.InboundCount(result.ReagentId, result.LotId);
        var outboundcount=await _repositoryoperation.OutboundCount(result.ReagentId, result.LotId);
        await _repositoryInventory.Audit(result.ReagentId, result.LotId, inboundcount-outboundcount);
        

        return new ResponseOperation.Del
        {
            Status = 1,
            Message = "成功",
        };
    }


}