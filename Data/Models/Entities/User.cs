using SqlSugar;

namespace LabMangerAPI.Data.Models.Entities;

public class User
{   
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public string UserName { get; set; } = "";
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public string PassWord { get; set; } = "";
    
    [SugarColumn(Length = 50, IsNullable = false)]
    public string Role { get; set; } = "";

    [SugarColumn(Length = 50, IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(ColumnName = "Team_Id")]
    public int TeamId { get; set; } 
}
