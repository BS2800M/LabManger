using SqlSugar;
using LabMangerAPI.Models;
namespace LabMangerAPI.Models;

[SugarIndex("idx_reagent_team_status",
    nameof(TeamId), OrderByType.Asc,
    nameof(Status), OrderByType.Asc)]
[SugarIndex("idx_reagent_name",
    nameof(Name), OrderByType.Asc)]

/// <summary>
/// 试剂的基本信息类
/// </summary>
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

    [SugarColumn(IsNullable = false)]
    public Status Status { get; set; } = Status.Enable;
}

/// <summary>
/// 试剂状态（启用 禁用 删除）
/// </summary>
public enum Status
{
    Enable = 0, //启用
    Disable = 1, //禁用
    Delete = 2 //删除

}

