// ReSharper disable UnusedAutoPropertyAccessor.Global

using System.ComponentModel.DataAnnotations;
using LabMangerAPI.SugarSql;

namespace LabMangerAPI.RequestType;



    public class RequestUser
    {
        public class Add
        {
            /// 用户名
            [Required(ErrorMessage = "用户名必须填写")]
            public string UserName { get; init; } = null!;
            /// 密码
            public string PassWord { get; set; } = "";
            [Range(1, int.MaxValue, ErrorMessage = "非法id")] public int TeamId { get; set; } = 0;
            ///角色
            [Required(ErrorMessage = "角色必须填写")] public required string Role { get; set; } 

        }
    
        /// 查询用户的请求模型
        public class Show
        {
            /// 搜索的用户名称 支持模糊搜索
            public string? Name { get; set; } = "";
            /// 页码
            [Range(1, int.MaxValue, ErrorMessage = "页码必须大于0")] public int Page { get; set; } = 1;
            /// 每页大小
            [Range(1, 1000, ErrorMessage = "每页大小必须在1-1000之间")] public int PageSize { get; set; } = 10;
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
            [Required(ErrorMessage = "角色必须填写")] public  required string Role { get; set; } 

        
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
        public class Add
        {
            public int Status { get; set; } = -1;
            public string Message {get;set;} = "";
            public User? Data { get; set; } 
        }

        public class Show
        {
            public int Status { get; set; } = -1;
            public string Message {get;set;} = "";
            public List<ShowData>? Data { get; set; } 
            public int TotalPage {get;set;}
            public int TotalCount {get;set;}
        }

        public class ShowData
        {
            public int Id { get; set; }
            public string UserName { get; set; } = "";
            public int TeamId { get; set; }
            public string Role { get; set; } = "";
            public string TeamName { get; set; } = "";
            

        }

        public class Update
        {
            public int Status { get; set; } = -1;
            public string Message {get;set;} = "";
            public User? Data {get;set;}
        }
        public class Del{
            public int Status { get; set; } = -1;
            public string Message {get;set;} = "";
        }

    }
