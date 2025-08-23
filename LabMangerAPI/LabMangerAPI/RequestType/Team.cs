// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.SugarSql;

namespace LabMangerAPI.RequestType;

public class RequestTeam
{
    /// 添加团队的请求模型
    public class Add
    {
        /// 团队名称
        public string Name { get; set; } = "";

        /// 联系电话
        [StringLength(50, ErrorMessage = "电话长度不能超过50个字符")]
        public string Phone { get; set; } = "";

        /// 备注信息
        [StringLength(500, ErrorMessage = "备注信息长度不能超过500个字符")]
        public string Note { get; set; } = "";


    }

    /// 查询团队的请求模型
    public class Show
    {

        /// 搜索的团队名称 支持模糊搜索
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

        //团队名称
        public string Name { get; set; } = "";

        ///联系电话
        [StringLength(50, ErrorMessage = "电话长度不能超过50个字符")]
        public string Phone { get; set; } = "";

        // 备注信息
        [StringLength(500, ErrorMessage = "备注信息长度不能超过500个字符")]
        public string Note { get; set; } = "";



    }

    public class Del
    {
        // 修改id
        [Range(1, int.MaxValue, ErrorMessage = "非法id")]public  int Id { get; set; }

    }
}

public class ResponseTeam
{
    public class Add
    {
        public int Status { get; set; } = -1;
        public string Message {get;set;} = "";
        public Team? Data { get; set; } 
    }

    public class Show
    {
        public int Status { get; set; } = -1;
        public string Message {get;set;} = "";
        public List<Team>? Data { get; set; } 
        public int TotalPage {get;set;}
        public int TotalCount {get;set;}
    }
    public class Update
    {
        public int Status { get; set; } = -1;
        public string Message {get;set;} = "";
        public Team? Data {get;set;}
    }
    public class Del{
        public int Status { get; set; } = -1;
        public string Message {get;set;} = "";
    }
}



    
