// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.Models;
using LabMangerAPI.DTOs.Common;

namespace LabMangerAPI.DTOs;

public class RequestTeam
{
    /// 添加团队的请求模型
    public class Add
    {
        [Required(ErrorMessage = "团队名称必须填写")]
        /// 团队名称
        public string Name { get; set; } = null!;

        /// 联系电话
        [StringLength(50, ErrorMessage = "电话长度不能超过50个字符")]
        public string Phone { get; set; } = "";

        /// 备注信息
        [StringLength(500, ErrorMessage = "备注信息长度不能超过500个字符")]
        public string Note { get; set; } = "";


    }

    /// 查询团队的请求模型
    public class Show : SearchablePaginationDto
    {
        /// 搜索的团队名称 支持模糊搜索
        public string? Name { get; set; } = "";
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
    public class Add : ApiResponse<Team>
    {
    }

    public class Show : PaginatedResponse<Team>
    {
    }
    
    public class Update : ApiResponse<Team>
    {
    }
    
    public class Del : ApiResponse
    {
    }
}



    
