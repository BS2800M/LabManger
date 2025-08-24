// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.Models;
using LabMangerAPI.DTOs.Common;

namespace LabMangerAPI.DTOs;


/// 添加试剂的请求模型
public class RequestReagent
{
    
    public class Add
    {
        [Required(ErrorMessage = "试剂名称不能为空")] public string Name { get; init; } = null!;
        public  string Specifications { get; set; } = "";
        public int Price { get; set; } = 0;
        public string StorageCondition { get; set; } = "";
        public string Manufacturer { get; set; } = "";
        public string Note { get; set; } = "";
        public int WarnNumber { get; set; } = 0;
        public int WarnDays { get; set; } = 0;
        public bool GenerateLot { get; set; } = false; //是否生成一个默认批号
    }

    /// 查询试剂的请求模型
    public class Show : SearchablePaginationDto
    {
        /// 搜索的试剂名称 支持模糊搜索
        public string? Name { get; set; } = "";
    }

    public class Update
    {
        // 修改id
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public  int Id { get; set; }
        [Required(ErrorMessage = "试剂名称不能为空")] public string Name { get; init; } = null!;
        public string Specifications { get; set; } = "";
        public int Price { get; set; } = 0;
        public string StorageCondition { get; set; } = "";
        public string Manufacturer { get; set; } = "";
        public string Note { get; set; } = "";
        public int WarnNumber { get; set; } = 0;
        public int WarnDays { get; set; } = 0;

    }
    
    public class Del
    {
        // 修改id
        [Range(1, int.MaxValue, ErrorMessage = "非法id")] public int Id { get; set; }


    }
}

public class ResponseReagent
{
    public class Add : ApiResponse<Reagent>
    {
    }

    public class Show : PaginatedResponse<Reagent>
    {
    }

    public class Update : ApiResponse<Reagent>
    {
    }
    public class Del : ApiResponse
    {
    }
    public class ShowAllData
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
    }

    public class ShowAll : ApiResponse<List<ShowAllData>>
    {

    }
}    
