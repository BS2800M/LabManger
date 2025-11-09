using SqlSugar;

namespace LabMangerAPI.Models;

[SugarIndex("idx_inventory_team_reagent_lot",
    nameof(TeamId), OrderByType.Asc,
    nameof(ReagentId), OrderByType.Asc,
    nameof(LotId), OrderByType.Asc)]
[SugarIndex("idx_inventory_reagent_lot",
    nameof(ReagentId), OrderByType.Asc,
    nameof(LotId), OrderByType.Asc)]
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
