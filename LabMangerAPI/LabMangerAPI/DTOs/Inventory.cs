// ReSharper disable UnusedAutoPropertyAccessor.Global

using LabMangerAPI.DTOs.Common;
namespace LabMangerAPI.DTOs;

public class RequestInventory
{
    /// 查询试剂的请求模型
    public class Show : SearchablePaginationDto
    {
        /// 搜索的试剂名称 支持模糊搜索
        public string? ReagentName { get; set; } = "";
    }

    public class  AuditAll
    {
        public int Id { get; set; } = 0;

    }

    public class DashBoard
    {
        public int Id { get; set; } = 0;
    }


}
public class ResponseInventory
{
    
    public class ShowData
    {
        public int Id { get; set; }
        public string ReagentName { get; set; } = "";
        public string LotName { get; set; } = "";
        public int Number { get; set; }
        public int ReagentWarnNumber { get; set; }
        public DateTime LotExpirationDate { get; set; }
        public string Specifications { get; set; } = "";
        

        public string Warning { get; set; } = "";
        
        public int WarnNumber { get; set; }
    }
    public class Show : PaginatedResponse<ShowData>
    {

    }

    public class AuditAll : ApiResponse
    {

    }
    public class DashBoard : ApiResponse<DashBoardData>
    {

    }

    public class DashBoardData
    {
        public int TotalNum { get; set; } 
        public int WarningTotalNum { get; set; } 
        public int WarningNumNum { get; set; } 
        public int WarningExpNum { get; set; } 
    }
    

}
