namespace LabMangerAPI.DTOs.Common;
/// <summary>
/// 更新试剂库存后的结果类
/// </summary>
public class InventoryUpdateResult
{
    public bool IsSuccess { get; set; }
    public string ReagentName { get; set; } = "";
    public string Message { get; set; } = "";
    public int? CurrentStock { get; set; }
    public int? RequestedChange { get; set; }
    
    /// <summary>
    /// 返回一个库存更新成功的类
    /// </summary>


    public static InventoryUpdateResult Success(string reagentName, int currentStock, int requestedChange)
    {
        return new InventoryUpdateResult
        {
            IsSuccess = true,
            ReagentName = reagentName,
            Message = $"{reagentName}库存更新成功",
            CurrentStock = currentStock,
            RequestedChange = requestedChange
        };
    }
    /// <summary>
    /// 返回一个库存更新因库存不足的类
    /// </summary>
    public static InventoryUpdateResult InsufficientStock(string reagentName, int currentStock, int requestedChange)
    {
        return new InventoryUpdateResult
        {
            IsSuccess = false,
            ReagentName = reagentName,
            Message = $"{reagentName}库存不足",
            CurrentStock = currentStock,
            RequestedChange = requestedChange
        };
    }
    /// <summary>
    /// 返回一个库存更新因库存成功但是有警告的类
    /// </summary>
    public static InventoryUpdateResult WarningStock(string reagentName, int currentStock, int requestedChange)
    {
        return new InventoryUpdateResult
        {
            IsSuccess = true,
            ReagentName = reagentName,
            Message = $"{reagentName}库存达到警告线",
            CurrentStock = currentStock,
            RequestedChange = requestedChange
        };
    }
}
