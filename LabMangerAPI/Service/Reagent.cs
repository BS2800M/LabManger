
using LabMangerAPI.Repository;
using LabMangerAPI.DTOs;
using SqlSugar;
using System.Net;
using LabMangerAPI.Data;
using LabMangerAPI.Models;

namespace LabMangerAPI.Service;

using Validator;

/// <summary>
/// 试剂类(服务层)
/// </summary>
public class ServiceReagent
{
    private readonly RepositoryReagent _repositoryreagent;
    private readonly RepositoryInventory _repositoryinventory;
    private readonly RepositoryLot _repositoryLot;
    private readonly IUserContext _userContext;
    /// <summary>
    /// 构建试剂类(服务层)
    /// </summary>
    /// <param name="repositoryreagent">试剂仓储层</param>
    /// <param name="repositorylot">批号仓储层</param>
    /// <param name="repositoryInventory">库存仓储层</param>
    /// <param name="userContext">用户和权限验证接口</param>
    public ServiceReagent(RepositoryReagent repositoryreagent, RepositoryLot repositorylot, RepositoryInventory repositoryInventory, IUserContext userContext)
    {
        _repositoryreagent = repositoryreagent;
        _repositoryLot = repositorylot;
        _repositoryinventory = repositoryInventory;
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个试剂
    /// </summary>
    /// <param name="body">增加试剂时请求的数据</param>
    ///  <returns>增加试剂时返回的数据</returns>
    public async Task<ResponseReagent.Add> Add(RequestReagent.Add body)
    {

        // 调用仓储层
        var result = await _repositoryreagent.Add(body);
        if (body.GenerateLot)
        {
            var generatelot = await _repositoryLot.Add(new RequestLot.Add
            {
                ReagentId = result.Id,
                Name = "默认" + result.Name,
                ExpirationDate = DateTime.Now.AddMonths(10),
            });
            await _repositoryinventory.Add(result.Id, generatelot.Id);
        }

        return new ResponseReagent.Add
        {
            Status = 0,
            Message = "添加成功",
            Data = result
        };
    }
    /// <summary>
    /// 展示多个试剂
    /// </summary>
    /// <param name="search">展示试剂时请求的数据</param>
    ///  <returns>返回展示多个试剂时返回的数据</returns>
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
    /// <summary>
    /// 更新一个试剂的信息
    /// </summary>
    /// <param name="body">更新试剂信息时请求的数据</param>
    ///  <returns>更新试剂信息时返回的数据</returns>
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
    /// <summary>
    /// 删除一个试剂的信息
    /// </summary>
    /// <param name="body">删除试剂信息时请求的数据</param>
    ///  <returns>删除试剂信息时返回的数据</returns>
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
    /// <summary>
    /// 展示所有试剂的简易信息（不带过滤功能）
    /// </summary>
    /// <param name="body">展示所有试剂信息时请求的数据</param>
    ///  <returns>展示所有试剂信息时返回的数据</returns>
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