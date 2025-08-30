
using LabMangerAPI.DTOs;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
using SqlSugar;

namespace LabMangerAPI.Repository;

public class RepositoryTeam:ICrud<Team,Team,RequestTeam.Add,RequestTeam.Show,RequestTeam.Update,RequestTeam.Del>
{
    readonly SqlSugarClient _db=MySqlSugar.Db;
    readonly IUserContext _userContext;
    public RepositoryTeam(IUserContext userContext)
    {   
        _userContext = userContext;
    }

    public async Task<Team> Add(RequestTeam.Add body)
    {
       var result=_db.Insertable(new  Team {
           Name= body.Name,
           Note= body.Note,
           Phone = body.Phone,
       }).ExecuteReturnEntityAsync();
       return await result;
    }
    public async Task<List<Team>> Show(RequestTeam.Show search,RefAsync<int> totalcount,RefAsync<int> totalpage)
    { 
        string? name=search.Name;
        int page=search.Page;
        int pageSize=search.PageSize;
        var exp = Expressionable.Create<Team>();
        exp.And(t=>t.Active==true);
        exp.AndIF(string.IsNullOrEmpty(name)==false,t => t.Name.Contains(name!));
        var result = _db.Queryable<Team>()
            .Where(exp.ToExpression())
            .OrderBy(t => t.Id,OrderByType.Desc)
            .ToPageListAsync(page, pageSize,totalcount, totalpage);

        return await result;
        
    }

    public async Task<Team> Update(RequestTeam.Update body)
    {
        var result = _db.Updateable(new Team {
            Id= body.Id, 
            Name= body.Name,
            Note= body.Note,
            Phone = body.Phone,
        }).ExecuteReturnEntityAsync();
        return await result;
        
    }

    public async Task<bool> Del(RequestTeam.Del body)
    {
        await _db.Updateable<Team>()
            .SetColumns(it => it.Active == false)
            .Where(it => it.Id == body.Id)
            .ExecuteReturnEntityAsync();
        return  true;
    }
}