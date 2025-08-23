using LabMangerAPI.Repository;
using LabMangerAPI.RequestType;
using SqlSugar;
using System.Net;
using LabMangerAPI.SugarSql;

namespace LabMangerAPI.Service;
using Validator;

public class ServiceTeam
{
    private readonly RepositoryTeam _repositoryteam;
    private readonly IUserContext _userContext;

    
    public ServiceTeam(RepositoryTeam repositoryteam,IUserContext userContext)
    {
        _repositoryteam = repositoryteam;
        _userContext = userContext;
    }
    
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