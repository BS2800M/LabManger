using LabMangerAPI.Repository;
using LabMangerAPI.RequestType;
using SqlSugar;
using System.Net;
using LabMangerAPI.SugarSql;

namespace LabMangerAPI.Service;
using Validator;

public class ServiceLot
{
    private readonly RepositoryLot _repositorylot;
    private readonly RepositoryInventory _repositoryinventory;
    private readonly IUserContext _userContext;

    
    public ServiceLot(RepositoryLot repositorylot, RepositoryInventory repositoryInventory,IUserContext userContext)
    {
        _repositorylot = repositorylot;
        _repositoryinventory = repositoryInventory;
        _userContext = userContext;
    }
    
    public async Task<ResponseLot.Add> Add(RequestLot.Add body)
    {

        
        // 调用仓储层
        var result = await _repositorylot.Add(body);
        await _repositoryinventory.Add(body.ReagentId, result.Id);
        return new ResponseLot.Add
        {
            Status = 0,
            Message = "添加成功",
            Data = new Lot
            {
                Id = result.Id,
                Name = result.Name,
                ReagentId = result.ReagentId,
                Active = result.Active,
            }
        };
    }
    
    public async Task<ResponseLot.Show> Show(RequestLot.Show search)
    {

        
        RefAsync<int> totalcount = new RefAsync<int>();
        RefAsync<int> totalpage = new RefAsync<int>();
        
        // 调用仓储层
        var result = await _repositorylot.Show(search, totalcount, totalpage);
        
        return new ResponseLot.Show
        {
            Status = 0,
            Message = "查询成功",
            Data = result,
            TotalPage = totalpage,
            TotalCount = totalcount
        };
    }
    
    public async Task<ResponseLot.Update> Update(RequestLot.Update body)
    {
        if (!await ResourceVerification.CheckResourceExist<Lot>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        // 业务逻辑：权限验证
        if (!await ResourceVerification.CheckResourcePermission<Lot>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        

        
        // 调用仓储层
        var result = await _repositorylot.Update(body);
        
        return new ResponseLot.Update
        {
            Status = 0,
            Message = "更新成功",
            Data = result
        };
    }
    
    public async Task<ResponseLot.Del> Del(RequestLot.Del body)
    {
        if (!await ResourceVerification.CheckResourceExist<Lot>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        // 业务逻辑：权限验证
        if (!await ResourceVerification.CheckResourcePermission<Lot>(MySqlSugar.Db, _userContext.Scope, _userContext.TeamId, body.Id))
        {
            throw new HttpRequestException("权限验证失败", null, HttpStatusCode.Forbidden);
        }
        
        // 调用仓储层
        await _repositorylot.Del(body);
        
        return new ResponseLot.Del
        {
            Status = 0,
            Message = "删除成功"
        };
    }
    
    public async Task<ResponseLot.ShowAll> ShowAll(RequestLot.ShowAll query)
    {
        
        // 调用仓储层
        var result = await _repositorylot.ShowAll(query.ReagentId);
        
        return new ResponseLot.ShowAll
        {
            Status = 0,
            Message = "查询成功",
            Data = result
        };
    }
}