// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.Models;
using LabMangerAPI.DTOs.Common;

namespace LabMangerAPI.DTOs;



    public class RequestUser
    {
        public class Add
        {
            /// 用户名
            [Required(ErrorMessage = "用户名必须填写")]
            public string UserName { get; init; } = null!;
            /// 密码
            public string PassWord { get; set; } = "";
            [Range(1, int.MaxValue, ErrorMessage = "非法id")]
            public int TeamId { get; set; } = 0;
            ///角色
            [Required(ErrorMessage = "角色必须填写")] public  UserRole Role { get; set; } = UserRole.Member;

        }
    
        /// 查询用户的请求模型
        public class Show : SearchablePaginationDto
        {
            /// 搜索的用户名称 支持模糊搜索
            public string? Name { get; set; } = "";
        }
    
        /// 更新用户的请求模型
        public class Update
        {
            // 修改id
            [Range(1, int.MaxValue, ErrorMessage = "非法id")] public   int Id { get; set; }
            /// 用户名
            [Required(ErrorMessage = "用户名必须填写")] public required string UserName { get; set; } 
            /// 密码
            public string PassWord { get; set; } = "";
            /// 团队id
            [Range(1, int.MaxValue, ErrorMessage = "非法团队id")]public int TeamId { get; set; } = 0;
            ///角色
            [Required(ErrorMessage = "角色必须填写")] public  UserRole Role { get; set; } = UserRole.Member;

        
        }
        /// 删除用户的请求模型
        public class Del
        {
            // 修改id
            [Range(1, int.MaxValue, ErrorMessage = "非法id")]public   int Id { get; set; }
        
        }
        
    }

    public class ResponseUser
    {
        public class Add : ApiResponse<User>
        {
        }

        public class Show : PaginatedResponse<ShowData>
        {
        }


        public class ShowData
        {
            public int Id { get; set; }
            public string UserName { get; set; } = "";
            public int TeamId { get; set; }
            public UserRole Role { get; set; } = UserRole.Member;
            public string TeamName { get; set; } = "";

        }

        public class Update : ApiResponse<User>
        {
        }
        public class Del : ApiResponse
        {
        }

    }
