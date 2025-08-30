using SqlSugar;

namespace LabMangerAPI.Models;

[SugarIndex("idx_lot_reagent_name",
    nameof(ReagentId), OrderByType.Asc,
    nameof(Name), OrderByType.Asc)]
[SugarIndex("idx_lot_team_active",
    nameof(TeamId), OrderByType.Asc,
    nameof(Active), OrderByType.Asc)]
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
