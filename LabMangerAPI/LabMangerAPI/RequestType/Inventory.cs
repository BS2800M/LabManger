// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
namespace LabMangerAPI.RequestType;

public class RequestInventory
{
    public class Show
    {
        /// 搜索的试剂名称 支持模糊搜索
        public string? ReagentName { get; set; } = "";

        /// 页码
        [Range(1, int.MaxValue, ErrorMessage = "页码必须大于0")]
        public int Page { get; set; } = 1;

        /// 每页大小
        [Range(1, 1000, ErrorMessage = "每页大小必须在1-1000之间")]
        public int PageSize { get; set; } = 10;
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
    public class Show
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public List<ShowData>? Data { get; set; }
        public int TotalPage { get; set; }
        public int TotalCount { get; set; }
    }

    public class AuditAll
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
    }
    public class DashBoard
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public DashBoardData Data { get; set; }=new DashBoardData();
    }

    public class DashBoardData
    {
        public int TotalNum { get; set; } 
        public int WarningTotalNum { get; set; } 
        public int WarningNumNum { get; set; } 
        public int WarningExpNum { get; set; } 
    }
    

}
