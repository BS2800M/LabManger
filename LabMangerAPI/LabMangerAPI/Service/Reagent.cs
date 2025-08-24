
using LabMangerAPI.Repository;
using LabMangerAPI.DTOs;
using SqlSugar;
using System.Net;
using LabMangerAPI.Data;
using LabMangerAPI.Models;

namespace LabMangerAPI.Service;
using Validator;
public class ServiceReagent
{
    private readonly RepositoryReagent _repositoryreagent;
    private readonly RepositoryInventory _repositoryinventory;
    private readonly RepositoryLot _repositoryLot;
    private readonly IUserContext _userContext;
    
    public ServiceReagent(RepositoryReagent repositoryreagent, RepositoryLot repositorylot,RepositoryInventory repositoryInventory,IUserContext userContext)
    {
        _repositoryreagent = repositoryreagent;
        _repositoryLot = repositorylot;
        _repositoryinventory = repositoryInventory;
        _userContext = userContext;
    }
    public async Task<ResponseReagent.Add> Add(RequestReagent.Add body)
    {
        
        // 调用仓储层
        var result = await _repositoryreagent.Add(body);
        if (body.GenerateLot)
        {
           var generatelot= await _repositoryLot.Add(new RequestLot.Add
            {
                ReagentId = result.Id,
                Name = "默认"+result.Name,
                ExpirationDate = DateTime.Now.AddMonths(10),
            } );
            await _repositoryinventory.Add(result.Id, generatelot.Id);
        }

        return new ResponseReagent.Add
        {
            Status = 0,
            Message = "添加成功",
            Data = result
        };
    }
    
    public async Task<ResponseReagent.Show> Show(RequestReagent.Show search)
    {
        
        RefAsync<int> totalcount = new RefAsync<int>();
        RefAsync<int> totalpage = new RefAsync<int>();
        
        // 调用仓储层
        var result = await _repositoryreagent.Show(search, totalcount, totalpage);
        
        return new ResponseReagent.Show
        {
            Status = 0,
            Message = "查询成功",
            Data = result,
            TotalPage = totalpage,
            TotalCount = totalcount
        };
    }
    
    public async Task<ResponseReagent.Update> Update(RequestReagent.Update body)
    {

        if (!await ResourceVerification.CheckResourceExist<Reagent>(MySqlSugar.Db, body.Id))
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }

        // 业务逻辑：权限验证
        if (!await ResourceVerification.CheckResourcePermission<Reagent>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        
        // 调用仓储层
        var result = await _repositoryreagent.Update(body);
        
        return new ResponseReagent.Update
        {
            Status = 0,
            Message = "更新成功",
            Data = result
        };
    }
    
    public async Task<ResponseReagent.Del> Del(RequestReagent.Del body)
    {
        if (!await ResourceVerification.CheckResourceExist<Reagent>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        // 业务逻辑：权限验证
        if (!await ResourceVerification.CheckResourcePermission<Reagent>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        
        // 调用仓储层
        await _repositoryreagent.Del(body);
        
        return new ResponseReagent.Del
        {
            Status = 0,
            Message = "删除成功"
        };
    }
    
    public async Task<ResponseReagent.ShowAll> ShowAll()
    {
        // 调用仓储层
        var result = await _repositoryreagent.ShowAll();
        
        return new ResponseReagent.ShowAll
        {
            Status = 0,
            Message = "查询成功",
            Data = result
        };
    }
}