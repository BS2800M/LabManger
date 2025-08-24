namespace LabMangerAPI.DTOs.Common;

/// <summary>
/// 通用API响应基类
/// </summary>
public class ApiResponse
{
    /// <summary>
    /// 响应状态码
    /// </summary>
    public int Status { get; set; } = -1;
    
    /// <summary>
    /// 响应消息
    /// </summary>
    public string Message { get; set; } = "";
}

/// <summary>
/// 带数据的通用API响应基类
/// </summary>
/// <typeparam name="T">数据类型</typeparam>
public class ApiResponse<T> : ApiResponse
{
    /// <summary>
    /// 响应数据
    /// </summary>
    public T? Data { get; set; }
}

/// <summary>
/// 分页响应基类
/// </summary>
/// <typeparam name="T">数据类型</typeparam>
public class PaginatedResponse<T> : ApiResponse<List<T>>
{
    /// <summary>
    /// 总页数
    /// </summary>
    public int TotalPage { get; set; }
    
    /// <summary>
    /// 总记录数
    /// </summary>
    public int TotalCount { get; set; }
}




