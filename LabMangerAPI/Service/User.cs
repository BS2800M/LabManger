using LabMangerAPI.Repository;
using LabMangerAPI.DTOs;
using SqlSugar;
using System.Net;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using System.Text;
using System.Security.Cryptography;
namespace LabMangerAPI.Service;
using Validator;
/// <summary>
/// 用户类(服务层)
/// </summary>

public class ServiceUser
{
    private readonly RepositoryUser _repositoryuser;
    private readonly IUserContext _userContext;

    /// <summary>
    /// 构建用户类(服务层)
    /// </summary>
    /// <param name="repositoryuser">用户仓储层</param>
    /// <param name="userContext">用户和权限验证接口</param>
    public ServiceUser(RepositoryUser repositoryuser, IUserContext userContext)
    {
        _repositoryuser = repositoryuser;
        _userContext = userContext;
    }
    /// <summary>
    /// 增加一个用户
    /// </summary>
    /// <param name="body">增加用户时请求的数据</param>
    ///  <returns>增加用户时返回的数据</returns>
    public async Task<ResponseUser.Add> Add(RequestUser.Add body)
    {
        
        byte[] passwordbyte=Encoding.UTF8.GetBytes(body.PassWord);
        passwordbyte=SHA256.Create().ComputeHash(passwordbyte);
        body.PassWord = BitConverter.ToString(passwordbyte).Replace("-","");
        
        
        
        var result = await (_repositoryuser.Add(body));
        result.PassWord = "*";
        return new ResponseUser.Add
        {
            Status = 0,
            Message = "成功",
            Data = result
        };

    }
    /// <summary>
    /// 展示多个用户
    /// </summary>
    /// <param name="search">展示用户时请求的数据</param>
    ///  <returns>展示多个用户时返回的数据</returns>
    public async Task<ResponseUser.Show> Show(RequestUser.Show search)
    {

        RefAsync<int> reftotalcount=new RefAsync<int>();
        RefAsync<int> reftotalpage=new RefAsync<int>();
        var result = await (_repositoryuser.Show(search,reftotalcount,reftotalpage));
        return new ResponseUser.Show
        {
            Status = 0,
            Message = "成功",
            Data = result,
            TotalPage= reftotalpage,
            TotalCount= reftotalcount
        };
    }
    /// <summary>
    /// 更新一个用户的信息
    /// </summary>
    /// <param name="body">更新用户信息时请求的数据</param>
    ///  <returns>更新用户信息时返回的数据</returns>
    public async Task<ResponseUser.Update> Update(RequestUser.Update body)
    {
        if (!await ResourceVerification.CheckResourceExist<User>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }
        byte[] passwordbyte=Encoding.UTF8.GetBytes(body.PassWord);
        passwordbyte=SHA256.Create().ComputeHash(passwordbyte);
        body.PassWord = BitConverter.ToString(passwordbyte).Replace("-","");
        var result =  await (_repositoryuser.Update(body));
        result.PassWord = "*";
        return new ResponseUser.Update
        {
            Status = 0,
            Message = "成功",
            Data = result
        };
    }
    /// <summary>
    /// 删除一个用户的信息
    /// </summary>
    /// <param name="body">删除用户信息时请求的数据</param>
    ///  <returns>删除用户信息时返回的数据</returns>
    public async Task<ResponseUser.Del> Del(RequestUser.Del body)
    {
        if (!await ResourceVerification.CheckResourceExist<User>(MySqlSugar.Db, body.Id)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源id", null, HttpStatusCode.Forbidden);
        }

        await (_repositoryuser.Del(body));
        return new ResponseUser.Del
        {
            Status = 0,
            Message = "成功",
        };


    }
}