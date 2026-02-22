using LabMangerAPI.Repository;
using LabMangerAPI.DTOs;
using SqlSugar;
using System.Net;
using LabMangerAPI.Data;
using LabMangerAPI.Models;

namespace LabMangerAPI.Service;
using Validator;
/// <summary>
/// 批号类(服务层)
/// </summary>
public class ServiceLot
{
    private readonly RepositoryLot _repositorylot;
    private readonly RepositoryInventory _repositoryinventory;
    private readonly IUserContext _userContext;

    /// <summary>
    /// 构建批号类(服务层)
    /// </summary>
    /// <param name="repositorylot">批号仓储层</param>
    /// <param name="repositoryInventory">库存仓储层</param>
    /// <param name="userContext">用户和权限验证接口</param>
    public ServiceLot(RepositoryLot repositorylot, RepositoryInventory repositoryInventory,IUserContext userContext)
    {
        _repositorylot = repositorylot;
        _repositoryinventory = repositoryInventory;
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个批号
    /// </summary>
    /// <param name="body">增加批号时请求的数据</param>
    ///  <returns>增加批号时返回的数据</returns>
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
                Status = result.Status,
            }
        };
    }
    /// <summary>
    /// 展示多个批号
    /// </summary>
    /// <param name="search">展示批号时请求的数据</param>
    ///  <returns>返回展示多个批号时返回的数据</returns>
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
    /// <summary>
    /// 更新一个批号的信息
    /// </summary>
    /// <param name="body">更新批号信息时请求的数据</param>
    ///  <returns>更新批号信息时返回的数据</returns>
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
    /// <summary>
    /// 删除一个批号的信息
    /// </summary>
    /// <param name="body">删除批号信息时请求的数据</param>
    ///  <returns>删除批号信息时返回的数据</returns>
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
    /// <summary>
    /// 展示所有批号的简易信息（不带过滤功能）
    /// </summary>
    /// <param name="body">展示所有批号信息时请求的数据</param>
    ///  <returns>展示所有批号信息时返回的数据</returns>
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