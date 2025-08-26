using SqlSugar;

namespace LabMangerAPI.Models;

public enum UserRole
{
    Member = 0,    // 组员
    Leader = 1,    // 组长  
    Director = 2,    // 主任
    Admin = 3      // 管理员
}

public class User
{   
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public string UserName { get; set; } = "";
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public string PassWord { get; set; } = "";
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public UserRole Role { get; set; } = UserRole.Member;

    [SugarColumn(Length = 50, IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(ColumnName = "Team_Id")]
    public int TeamId { get; set; } 
}
