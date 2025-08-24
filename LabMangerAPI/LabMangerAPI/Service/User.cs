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

public class ServiceUser
{
    private readonly RepositoryUser _repositoryuser;
    private readonly IUserContext _userContext;

    
    public ServiceUser(RepositoryUser repositoryuser,IUserContext userContext)
    {
        _repositoryuser = repositoryuser;
        _userContext = userContext;
    }
    
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