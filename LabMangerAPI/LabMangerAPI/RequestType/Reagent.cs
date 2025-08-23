// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.SugarSql;
namespace LabMangerAPI.RequestType;


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
    public class Show
    {

        /// 搜索的试剂名称 支持模糊搜索
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
    public class Add
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public Reagent? Data { get; set; }
    }

    public class Show
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public List<Reagent>? Data { get; set; }
        public int TotalPage { get; set; }
        public int TotalCount { get; set; }
    }

    public class Update
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public Reagent? Data { get; set; }
    }

    public class Del
    {
         public  int Status { get; set; } = -1;
        public string Message { get; set; } = "";
    }

    public class ShowAllData
    {
    public  int Id { get; set; }
    public string Name { get; set; } = "";
    }

    public class ShowAll
    {
        public int Status { get; set; } = -1;
        public string Message { get; set; } = "";
        public List<ShowAllData>? Data { get; set; }

    }
}    
