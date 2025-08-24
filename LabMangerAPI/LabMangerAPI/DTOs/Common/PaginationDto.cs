using System.ComponentModel.DataAnnotations;

namespace LabMangerAPI.DTOs.Common;

/// <summary>
/// 通用分页查询基类
/// </summary>
public abstract class PaginationDto
{
    /// <summary>
    /// 页码
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "页码必须大于0")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// 每页大小
    /// </summary>
    [Range(1, 1000, ErrorMessage = "每页大小必须在1-1000之间")]
    public int PageSize { get; set; } = 10;
}

/// <summary>
/// 带搜索功能的分页查询基类
/// </summary>
public abstract class SearchablePaginationDto : PaginationDto
{
    /// <summary>
    /// 搜索关键词
    /// </summary>
    public string? SearchKeyword { get; set; } = "";
}

/// <summary>
/// 带时间范围的分页查询基类
/// </summary>
public abstract class TimeRangePaginationDto : PaginationDto
{
    /// <summary>
    /// 开始时间
    /// </summary>
    public DateTime? StartTime { get; set; }
    
    /// <summary>
    /// 结束时间
    /// </summary>
    public DateTime? EndTime { get; set; }
}
