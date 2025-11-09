namespace LabMangerAPI.DTOs.Common;

public class InventoryUpdateResult
{
    public bool IsSuccess { get; set; }
    public string ReagentName { get; set; } = "";
    public string Message { get; set; } = "";
    public int? CurrentStock { get; set; }
    public int? RequestedChange { get; set; }
    
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
