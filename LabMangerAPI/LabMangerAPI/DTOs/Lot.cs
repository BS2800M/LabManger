// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.Models;
using LabMangerAPI.DTOs.Common;

namespace LabMangerAPI.DTOs;


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
    public class Show : SearchablePaginationDto
    {

        /// 搜索的批号名称 支持模糊搜索
        public string? Name { get; set; } = "";

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


    public class Add : ApiResponse<Lot>
    {
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
    public class Show : PaginatedResponse<ShowData>
    {
    }



    public class Update : ApiResponse<Lot>
    {
    }

    public class Del : ApiResponse
    {
    }
    
    public class ShowAllData
    {
        public    int Id { get; set; }
        public string Name { get; set; } = "";
    }

    public class ShowAll : ApiResponse<List<ShowAllData>>
    {


    }
}    