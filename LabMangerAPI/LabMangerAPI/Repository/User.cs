
using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;
using LabMangerAPI.Validator;
namespace LabMangerAPI.Repository;

public class RepositoryUser:ICrud<User,ResponseUser.ShowData,RequestUser.Add,RequestUser.Show,RequestUser.Update,RequestUser.Del>
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    public RepositoryUser(IUserContext userContext)
    {   
        _userContext = userContext;
    }

    public async Task<User> Add(RequestUser.Add body)
    { 
       var result=_db.Insertable(new User
       {
           TeamId = body.TeamId,
           UserName = body.UserName,
           PassWord = body.PassWord,
           Role = body.Role,
       }).ExecuteReturnEntityAsync();
       return await result;
    }
    public async Task<List <ResponseUser.ShowData>> Show(RequestUser.Show search,RefAsync<int> totalcount,RefAsync<int> totalpage)
    { 
        string? name=search.Name;
        int page=search.Page;
        int pageSize=search.PageSize;
        var exp = Expressionable.Create<User>();
        exp.And(u=>u.Active==true);
        exp.AndIF(string.IsNullOrEmpty(name)==false,u => u.UserName.Contains(name!) );
        ScopeVerification.CreateScope(ref exp,_userContext.TeamId,_userContext.Role);
        var result = _db.Queryable<User>()
            .Where(exp.ToExpression())
            .LeftJoin<Team>((u,t)=>u.TeamId == t.Id)
            .OrderBy(u => u.Id,OrderByType.Desc)
            .Select((u,t)=>new ResponseUser.ShowData
            {
                Id = u.Id,
                UserName = u.UserName,
                TeamName =t.Name, 
                Role = u.Role,
                TeamId=t.Id,
                
            })
            .ToPageListAsync(page, pageSize,totalcount, totalpage);

        return await result;
        
    }

    public async Task<User> Update(RequestUser.Update body)
    {

        var result = _db.Updateable(new User {
            Id = body.Id,
            TeamId = body.TeamId,
            UserName = body.UserName,
            PassWord = body.PassWord,
            Role = body.Role,
        }).ExecuteReturnEntityAsync();
        return await result;
        
    }

    public async Task<bool> Del(RequestUser.Del body)
    {
        await _db.Updateable<User>()
            .SetColumns(it => it.Active == false)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        return  true;
    }
}