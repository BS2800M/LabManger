// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.SugarSql;

namespace LabMangerAPI.RequestType;


/// 添加批号的请求模型
public class RequestLot
{
    public class Add
    {
        [Required(ErrorMessage = "批号名称不能为空")] public string Name { get; init; } = null!;
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public int ReagentId { get; set; }
        public DateTime ExpirationDate { get; set; } = DateTime.Now.AddYears(3);

    }

    /// 查询批号的请求模型
    public class Show
    {

        /// 搜索的批号名称 支持模糊搜索
        public string? Name { get; set; } = "";

        /// 页码
        [Range(1, int.MaxValue, ErrorMessage = "页码必须大于0")]
        public int Page { get; set; } = 1;

        /// 每页大小
        [Range(1, 1000, ErrorMessage = "每页大小必须在1-1000之间")]
        public int PageSize { get; set; } = 10;
    }

    public class Update
    {
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public int Id { get; set; }
        [Required(ErrorMessage = "批号名称不能为空")] public string Name { get; init; } = null!;
        [Range(1, int.MaxValue, ErrorMessage = "非法id")]public int ReagentId { get; set; } = 0;
        public DateTime ExpirationDate { get; set; } = DateTime.Now;

    }

    public class Del
    {
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public  int Id { get; set; }

    }
    public class ShowAll
    {
        public int ReagentId { get; set; } = 0;
    }

}

public class ResponseLot
{


    public class Add
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public Lot? Data { get; set; }
    }
    public class ShowData
    {
        public int Id { get; set; }
        
        public  string Name { get; set; } = "";
        
        public   int ReagentId { get; set; } 
        
        public DateTime ExpirationDate { get; set; } = DateTime.Now;
        

        
        public int TeamId { get; set; } 

        public string ReagentName { get; set; } = "";
    }
    public class Show
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public List<ShowData>? Data { get; set; }
        public int TotalPage { get; set; }
        public int TotalCount { get; set; }
    }



    public class Update
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public Lot? Data { get; set; }
    }

    public class Del
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
    }
    
    public class ShowAllData
    {
        public    int Id { get; set; }
        public string Name { get; set; } = "";
    }

    public class ShowAll
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public List<ShowAllData>? Data { get; set; }

    }
}    