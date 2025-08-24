
using SqlSugar;
using LabMangerAPI.Data;
using LabMangerAPI.Models;
namespace LabMangerAPI.Validator;


public static class ScopeVerification
{
    public static void CreateScope( ref Expressionable<User> exp,int teamid,string role)
    {
        var scope = WebApplication.CreateBuilder().Configuration.GetSection($"PermissionsTable:{role}:scope").Get<string>();
        if (scope == "team")
        {
            exp.And(t => t.TeamId == teamid);
        }
    }
    
    public static void CreateScope( ref Expressionable<Reagent> exp,int teamid,string role)
    {

        var scope = WebApplication.CreateBuilder().Configuration.GetSection($"PermissionsTable:{role}:scope").Get<string>();
        if (scope == "team")
        {
                exp.And(r => r.TeamId == teamid);
        }
    }
    public static void CreateScope( ref Expressionable<Lot> exp,int teamid,string role)
    {
        var scope = WebApplication.CreateBuilder().Configuration.GetSection($"PermissionsTable:{role}:scope").Get<string>();
        if (scope == "team")
        {
            exp.And(l => l.TeamId== teamid);
        }
    }
    
    public static void CreateScope( ref Expressionable<Operation> exp,int teamid,string role)
    {
        var scope = WebApplication.CreateBuilder().Configuration.GetSection($"PermissionsTable:{role}:scope").Get<string>();
        if (scope == "team")
        {
            exp.And(o => o.TeamId== teamid);
        }
    }
    
    public static void CreateScope( ref Expressionable<Inventory> exp,int teamid,string role)
    {
        var scope = WebApplication.CreateBuilder().Configuration.GetSection($"PermissionsTable:{role}:scope").Get<string>();
        if (scope == "team")
        {
            exp.And(i => i.TeamId== teamid);
        }
    }
    
}

public static class ResourceVerification
{
    public static async Task<bool> CheckResourcePermission<T>(SqlSugarClient db,string scope,int inteamid,int inresourceid) //验证资源所有权
    {

        int count;
        if (scope == "team")
        {
            count = await db.Queryable<T>()
                .Where("TeamId = @teamid AND Id = @resourceid", new { teamid = inteamid, resourceid = inresourceid })
                .CountAsync();

            if (count == 0)
            {
                Console.WriteLine($"权限越界");
                return false;
            }
            return true;
        }
        if (scope == "all")
        {
            return true;
        }
        return false;
    }

    public static async  Task<bool> CheckResourceExist<T>(SqlSugarClient db, int inresourceid)////验证资源是否存在
    {
        int count;
        count = await db.Queryable<T>()
            .Where("Id = @resourceid", new { resourceid = inresourceid })
            .CountAsync();
        if (count == 1)
        {
            return true;
        }
        return false;
        
    }
}