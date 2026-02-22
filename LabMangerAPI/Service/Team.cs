using LabMangerAPI.Repository;
using LabMangerAPI.DTOs;
using SqlSugar;
using System.Net;
using LabMangerAPI.Data;
using LabMangerAPI.Models;

namespace LabMangerAPI.Service;
using Validator;
/// <summary>
/// 小组类（服务层）
/// </summary>

public class ServiceTeam
{
    private readonly RepositoryTeam _repositoryteam;
    private readonly IUserContext _userContext;

    /// <summary>
    /// 构建小组类(服务层)
    /// </summary>
    /// <param name="repositoryteam">小组仓储层</param>
    /// <param name="userContext">用户和权限验证接口</param>
    public ServiceTeam(RepositoryTeam repositoryteam,IUserContext userContext)
    {
        _repositoryteam = repositoryteam;
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个小组
    /// </summary>
    /// <param name="body">增加小组时请求的数据</param>
    ///  <returns>增加一个小组时返回的数据</returns>
    public async Task<ResponseTeam.Add> Add(RequestTeam.Add body)
    {
        var result = await (_repositoryteam.Add(body));
        return new ResponseTeam.Add
        {
            Status = 0,
            Message = "成功",
            Data = result
        };

    }
    /// <summary>
    /// 展示多个小组
    /// </summary>
    /// <param name="search">展示小组时请求的数据</param>
    ///  <returns>展示多个小组时返回的数据</returns>
    public async Task<ResponseTeam.Show> Show(RequestTeam.Show search)
    {

        RefAsync<int> reftotalcount=new RefAsync<int>();
        RefAsync<int> reftotalpage=new RefAsync<int>();
        var result = await (_repositoryteam.Show(search,reftotalcount,reftotalpage));
        return new ResponseTeam.Show
        {
            Status = 0,
            Message = "成功",
            Data = result,
            TotalPage= reftotalpage,
            TotalCount= reftotalcount
        };
    }
    /// <summary>
    /// 更新一个小组的信息
    /// </summary>
    /// <param name="body">更新小组信息时请求的数据</param>
    ///  <returns>更新小组信息时返回的数据</returns>
    public async Task<ResponseTeam.Update> Update(RequestTeam.Update body)
    {
        if (!await ResourceVerification.CheckResourceExist<Team>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        var result =  await (_repositoryteam.Update(body));
        return new ResponseTeam.Update
        {
            Status = 0,
            Message = "成功",
            Data = result
        };
    }
    /// <summary>
    /// 删除一个小组的信息
    /// </summary>
    /// <param name="body">删除小组信息时请求的数据</param>
    ///  <returns>删除小组信息时返回的数据</returns>
    public async Task<ResponseTeam.Del> Del(RequestTeam.Del body)
    {
        if (!await ResourceVerification.CheckResourceExist<Team>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }

        await (_repositoryteam.Del(body));
        return new ResponseTeam.Del
        {
            Status = 0,
            Message = "成功",
        };


    }
}