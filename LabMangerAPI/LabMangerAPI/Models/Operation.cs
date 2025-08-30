using SqlSugar;

namespace LabMangerAPI.Models;

// 复合普通索引：ReagentId, LotId, Action
[SugarIndex("idx_operation_reagent_lot_action",
    nameof(ReagentId), OrderByType.Asc,
    nameof(LotId), OrderByType.Asc,
    nameof(Action), OrderByType.Asc)]
// 复合普通索引：ReagentId, CreateTime
[SugarIndex("idx_operation_reagent_createtime",
    nameof(ReagentId), OrderByType.Asc,
    nameof(CreateTime), OrderByType.Asc)]
// 复合普通索引：BarcodeNumber, Action
[SugarIndex("idx_operation_barcode_action",
    nameof(BarcodeNumber), OrderByType.Asc,
    nameof(Action), OrderByType.Asc)]
// 复合普通索引：Active, TeamId, CreateTime
[SugarIndex("idx_operation_active_team_createtime",
    nameof(Active), OrderByType.Asc,
    nameof(TeamId), OrderByType.Asc,
    nameof(CreateTime), OrderByType.Asc)]

public class Operation
{
    [SugarColumn(IsPrimaryKey = true, IsIdentity = true)]
    public int Id { get; set; }
    
    [SugarColumn(IsNullable = false)]
    public int ReagentId { get; set; } 
    
    [SugarColumn(IsNullable = false)]
    public int LotId { get; set; } 
    
    [SugarColumn(IsNullable = false)]
    public int UserId { get; set; } 
    
    [SugarColumn(IsNullable = false)]
    public int TeamId { get; set; } 
    
    [SugarColumn(ColumnDataType = "datetime")]
    public DateTime CreateTime { get; set; } = DateTime.Now;
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string BarcodeNumber { get; set; } = "";
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public OperationAction Action { get; set;}
    
    [SugarColumn(Length = 100, IsNullable = false)]
    public string Note { get; set; } = "";
    
    [SugarColumn(IsNullable = false)]
    public bool Active { get; set; } = true;
    
    [Navigate(NavigateType.OneToOne, nameof(ReagentId))]
    public Reagent? Reagent { get; set; }
    
    [Navigate(NavigateType.OneToOne, nameof(LotId))]
    public Lot? Lot { get; set; }
}

public enum OperationAction
{
    NoInfo=0, //无信息
    Inbound = 1,    // 入库
    Outbound=2,   //出库
    
}