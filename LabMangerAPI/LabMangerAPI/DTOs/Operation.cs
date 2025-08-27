// ReSharper disable UnusedAutoPropertyAccessor.Global


using System.ComponentModel.DataAnnotations;
using LabMangerAPI.DTOs.Common;
using LabMangerAPI.Models;

namespace LabMangerAPI.DTOs;

public class RequestOperation
{
    public class Inbound
    {
        [Required(ErrorMessage = "入库信息不能为空")] public List<InboundListData> InboundList { get; init; } = null!;
    }
    public class Outbound
    {
        [Required(ErrorMessage = "入库条码不能为空")] public string BarcodeNumber { get; init; } = null!;
    }
    public class InboundListData
    {
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public  int ReagentId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public  int LotId { get; set; }
        public int Number { get; set; } = 0;
        public String Note { get; set; } = "";
        
    }

    public class SpecialOutbound
    {
        [Required(ErrorMessage = "出库信息不能为空")] public List<OutboundListData> OutboundList { get; init; } = null!;
    }
    public class OutboundListData
    {
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public int ReagentId { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public int LotId { get; set; }
        public int Number { get; set; } = 0;
        public String Note { get; set; } = "";
    }
    
    public class Show : TimeRangePaginationDto
    {
        /// 搜索的试剂名称 支持模糊搜索
        public string? ReagentName { get; set; } = "";
        
        public string? BarcodeNumber { get; set; } = "";
    }

    public class Update
    {
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public  int Id { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "非法reagentid")] public  int ReagentId { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "非法lotid")] public  int LotId { get; set; }
        
        public DateTime CreateTime { get; set; } = DateTime.Now;
        
        public string Action { get; set; } = "";
        
        public string Note { get; set; } = "";
        
    }

    public class Del
    {
        //[Range(1, int.MaxValue, ErrorMessage = "非法id")] 
        public  int Id { get; set;}
    }

    public class ExportToExcel
    {
        
    }



}

public class ResponseOperation
{
    public class Inbound
    {

            public int Status { get; set; } = -1;
            public List<string> Message { get; set; } = new List<string>();
            public  List<InboundData> Data { get; set; }=new List<InboundData>();
    }

    public class InboundData
    {
        public int Id { get; set; } = -1;
        public string ReagentName { get; set; } = "";
        public string Lotname { get; set; } = "";
        public string Note { get; set; } = "";
        public string BarcodeNumber { get; set; } = "";
        public string UserName { get; set; } = "";
        public string Action { get; set; } = "";
        
    }
    public class Outbound
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
    }
    public class SpecialOutbound
    {
        public int Status { get; set; } = -1;
        public List<string> Message { get; set; } =new List<string>();

    }
    public class Show : PaginatedResponse<ShowData>
    {

    }
    public class ShowData
    {
        public int Id { get; set; } 
        
        public DateTime CreateTime { get; set; }
        
        public int ReagentId { get; set; }
        
        public int LotId { get; set; }
        public string ReagentName { get; set; } = "";
        public string LotName { get; set; } = "";
        public string Note { get; set; } = "";
        public string BarcodeNumber { get; set; } = "";
        public string UserName { get; set; } = "";
        public string Action { get; set; } = "";
        
        
    }

    public class Update : ApiResponse<Operation>
    {
    }

    public class Del : ApiResponse
    {
        
    }

    public class ExportToExcelDataListData
    {
        public DateTime CreateTime { get; set; } = DateTime.Now;
        public int LotId { get; set; }
        public string LotName { get; set; } = "";
        public DateTime ExpirationDate {get; set;}= DateTime.Now;
        public string UserName { get; set; } = "";
        
        public string Action { get; set; } = "";
        public int InboundNumber { get; set; } = 0;
        public int OutboundNumber { get; set; } = 0;
        public int InventoryNumber { get; set; } = 0;
    }

    public class ExportToExcelData
    {
        public int ReagentId { get; set; }
        public string ReagentName { get; set; } = "";
        public string StorageCondition { get; set; } = "";
        public string Manufacturer { get; set; } = "";
        public List<ExportToExcelDataListData> OperationList { get; set; } = new List<ExportToExcelDataListData>();

    }

    public class ExportToExcel:ApiResponse
    {
        public List<ExportToExcelData> Data { get; set; } = new List<ExportToExcelData>();
    }

}