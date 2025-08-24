using SqlSugar;

namespace LabMangerAPI.Data.Models.Entities;

public class Lot
{    
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Name { get; set; } = "";
    
    [SugarColumn(IsNullable = false)]
    public int ReagentId { get; set; } = 0;

    [SugarColumn(ColumnDataType = "datetime")]
    public DateTime ExpirationDate { get; set; } = DateTime.Now;
    
    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public int TeamId { get; set; } = 0;
    
    [Navigate(NavigateType.ManyToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }
}
