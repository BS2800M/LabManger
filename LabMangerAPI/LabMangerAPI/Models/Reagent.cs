using SqlSugar;

namespace LabMangerAPI.Models;

public class Reagent
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; } 
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Name { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Specifications { get; set; } = "";

    [SugarColumn(IsNullable = false)]
    public int Price { get; set; } = 0;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string StorageCondition { get; set; } = "";

    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Manufacturer { get; set; } = "";
    
    [SugarColumn(Length = 200, IsNullable = false)]
    public string Note { get; set; } = "";

    [SugarColumn(IsNullable = false)]
    public int WarnNumber { get; set; } = 0;

    [SugarColumn(Length = 100, IsNullable = false)]
    public int WarnDays { get; set; } = 0;
    
    [SugarColumn(ColumnDataType = "datetime")]
    public DateTime CreateTime { get; set; } = DateTime.Now;
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } 
}
