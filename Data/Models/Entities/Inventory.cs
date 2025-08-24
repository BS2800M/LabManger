using SqlSugar;

namespace LabMangerAPI.Data.Models.Entities;

public class Inventory
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(IsNullable = false)]
    public int ReagentId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int LotId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } = 0;
    
    [SugarColumn(IsNullable = false)]
    public int Number { get; set; } = 0;

    [Navigate(NavigateType.OneToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }
    
    [Navigate(NavigateType.OneToOne, nameof(LotId))]
    public Lot? Lot { get; set; }
}
