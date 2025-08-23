using System.Net;
using LabMangerAPI.Repository;
using LabMangerAPI.RequestType;
using LabMangerAPI.SugarSql;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Service;

public class ServiceOperation
{
    
    private readonly RepositoryOperation  _repositoryoperation;
    private readonly IUserContext _userContext;
    private readonly RepositoryInventory _repositoryInventory;
    public ServiceOperation(RepositoryOperation repositoryoperation,RepositoryInventory repositoryInventory, IUserContext userContext)
    {
        _repositoryoperation = repositoryoperation;
        _userContext = userContext;
        _repositoryInventory = repositoryInventory;
    }
    public async Task<ResponseOperation.Inbound> Inbound(RequestOperation.Inbound body) //入库逻辑
    {
        int startId = await  _repositoryoperation.GetMaxOperationIdAsync()+1;
        // 业务逻辑：构建操作列表
        var operations = await BuildOperationsAsync(body);
        // 数据访问：创建操作记录
        await _repositoryoperation.CreateOperationsAsync(operations);
        
        // 获取ID范围用于查询
        int endId = await  _repositoryoperation.GetMaxOperationIdAsync();
        // 数据访问：查询操作详情
        var result=await _repositoryoperation.GetOperationsWithDetailsAsync(startId, endId);
        //更新库存
        var messages=  await BuildInventoryUpdatesAsync(body);
        
        return new ResponseOperation.Inbound
        {
            Status = 1,
            Message = messages,
            Data = result
        };
    }
     
    private async Task<List<Operation>> BuildOperationsAsync(RequestOperation.Inbound body) // 构建入库操作列表
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
                    Action = "inbound",
                    Active = true,
                    CreateTime = DateTime.Now
                });
                currentId++;
            }
        }
        return operations;
    }
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
                    Action = "specialoutbound",
                    Active = true,
                    CreateTime = DateTime.Now
                });
                currentId++;
            }
        }
        return operations;
    }
    
    private string GenerateBarcodeNumber(int id)  // 业务逻辑：条码生成规则
    {
        return (id + 100000).ToString();
    }

    private async Task<List<string>> BuildInventoryUpdatesAsync(RequestOperation.Inbound body) //业务逻辑 入库更新库存
    {
        var tasks = new List<Task<string>>();
            foreach (var inbound in body.InboundList)
            {
                tasks.Add(_repositoryInventory.Update(inbound.ReagentId, inbound.LotId, inbound.Number));
            }

            var result= await Task.WhenAll(tasks);
            return result.ToList();

    }
    
    private async Task<List<string>> BuildInventoryUpdatesAsync(RequestOperation.SpecialOutbound body) //业务逻辑 出库更新库存
    {
        var tasks = new List<Task<string>>();
        foreach (var inbound in body.OutboundList)
        {
            tasks.Add(_repositoryInventory.Update(inbound.ReagentId, inbound.LotId, -(inbound.Number)));
        }
        var result= await Task.WhenAll(tasks);
        return result.ToList();

    }

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
                    Action = "outbound",
                    Active = true,
                    BarcodeNumber = search.BarcodeNumber,
                    Note = search.Note,
                    CreateTime = DateTime.Now
                });
            await _repositoryoperation.CreateOperationsAsync(createlist);
            var response= await _repositoryInventory.Update(search.ReagentId, search.LotId, -1);
            return new ResponseOperation.Outbound
            {
                Status = 0,
                Message = response,
            };
        }
        throw new HttpRequestException("出库失败",null,HttpStatusCode.Forbidden);
    }

    public async Task<ResponseOperation.SpecialOutbound> SpecialOutbound(RequestOperation.SpecialOutbound body) // 特殊出库
    {
        var operations = await BuildOperationsAsync(body);
        await _repositoryoperation.CreateOperationsAsync(operations);
        var  messages= await BuildInventoryUpdatesAsync(body);
        return new ResponseOperation.SpecialOutbound
        {
            Status = 1,
            Message = messages,
        };
    }

    public async Task<ResponseOperation.Show> Show(RequestOperation.Show search)
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

    public async Task<ResponseOperation.Del>  Del(RequestOperation.Del body)
    {
        if (!await ResourceVerification.CheckResourceExist<Operation>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        
        if (!await ResourceVerification.CheckResourcePermission<Operation>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        var result= await _repositoryoperation.Del(body.Id);
        if (result.Action == "outbound" || result.Action == "specialoutbound") //如果是出库 则把库存数量加回来
        {
            await _repositoryInventory.Update(result.ReagentId, result.LotId, 1);
        }
        if (result.Action == "inbound" )
        {
            await _repositoryInventory.Update(result.ReagentId, result.LotId, -1);
        }
        

        return new ResponseOperation.Del
        {
            Status = 1,
            Message = "成功",
        };
    }
    
    


}