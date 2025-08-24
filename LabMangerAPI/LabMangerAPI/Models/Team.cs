using SqlSugar;

namespace LabMangerAPI.Models;

public class Team
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Name { get; set; } = "";
    
    [SugarColumn(Length = 25, IsNullable = false)]
    public string Phone { get; set; } = "";
    
    [SugarColumn(Length = 150, IsNullable = false)]
    public string Note { get; set; } = "";
    
    [SugarColumn(Length = 150, IsNullable = false)] 
    public bool Active { get; set; } = true;
}
