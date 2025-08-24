// ReSharper disable UnusedAutoPropertyAccessor.Global


using System.ComponentModel.DataAnnotations;
using LabMangerAPI.DTOs.Common;

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

    public class Del
    {
        //[Range(1, int.MaxValue, ErrorMessage = "非法id")] 
        public  int Id { get; set;}
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
        public string ReagentName { get; set; } = "";
        public string LotName { get; set; } = "";
        public string Note { get; set; } = "";
        public string BarcodeNumber { get; set; } = "";
        public string UserName { get; set; } = "";
        public string Action { get; set; } = "";
        
    }
    
    public class Del : ApiResponse
    {
        
    }

}