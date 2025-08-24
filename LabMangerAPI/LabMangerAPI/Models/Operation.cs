using SqlSugar;

namespace LabMangerAPI.Models;

public class Operation
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(IsNullable = false)]
    public int ReagentId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int LotId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int UserId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } = 0;
    
    [SugarColumn(ColumnDataType = "datetime")]
    public DateTime CreateTime { get; set; } = DateTime.Now;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string BarcodeNumber { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Action { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Note { get; set; } = "";
    
    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [Navigate(NavigateType.OneToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }
    
    [Navigate(NavigateType.OneToOne, nameof(LotId))]
    public Lot? Lot { get; set; }
}
