

using LabMangerAPI.Repository;
using SqlSugar;
using LabMangerAPI.DTOs;
using LabMangerAPI.Models;
using LabMangerAPI.Validator;
using LabMangerAPI.Data;
using System.Net;
namespace LabMangerAPI.Service;
/// <summary>
/// 库存类(服务层)
/// </summary>
public class ServiceInventory
{
    private readonly RepositoryInventory _repository;
    private readonly RepositoryOperation _repositoryoperation;
    /// <summary>
    /// 构建库存类(服务层)
    /// </summary>
    /// <param name="repositoryinventory">库存仓储层</param>
    /// <param name="repositoryoperation">操作仓储层</param>
    /// <param name="userContext">用户和权限验证接口</param>
    public ServiceInventory(RepositoryInventory repositoryinventory, RepositoryOperation repositoryoperation)
    {
        _repository = repositoryinventory;
        _repositoryoperation = repositoryoperation;
    }

    /// <summary>
    /// 展示多个库存
    /// </summary>
    /// <param name="search">展示库存时请求的数据</param>
    ///  <returns>展示多个库存时返回的数据</returns>
    public async Task<ResponseInventory.Show> Show(RequestInventory.Show search)
    {

        RefAsync<int> totalcount = new RefAsync<int>();
        RefAsync<int> totalpage = new RefAsync<int>();

        // 调用仓储层
        var result = await _repository.Show(search, totalcount, totalpage);

        return new ResponseInventory.Show
        {
            Status = 0,
            Message = "查询成功",
            Data = result,
            TotalPage = totalpage,
            TotalCount = totalcount
        };
    }

    /// <summary>
    /// 修正所有库存数量（需要大量数据库查询操作）
    /// </summary>
    /// <param name="search">暂无用处</param>
    public async Task<ResponseInventory.AuditAll> AuditAll(RequestInventory.AuditAll search)
    {
        var alllist = await _repository.ShowAll();
        foreach (var item in alllist)
        {
            var inboundcount = await _repositoryoperation.InboundCount(item.ReagentId, item.LotId);
            var outboundcount = await _repositoryoperation.OutboundCount(item.ReagentId, item.LotId);
            var number = inboundcount - outboundcount;
            await _repository.Audit(item.Id, number);
        }

        return new ResponseInventory.AuditAll
        {

            Status = 0,
            Message = "成功"
        };

    }
    /// <summary>
    /// 展示仪表盘（主页数据）
    /// </summary>
    /// <param name="search">仪表盘请求数据</param>
    /// <returns>仪表盘返回数据</returns>
    public async Task<ResponseInventory.DashBoard> DashBoard(RequestInventory.DashBoard body)
    {
        var result = await _repository.DashBoard();
        return new ResponseInventory.DashBoard
        {
            Status = 0,
            Message = "成功",
            Data = result,

        };
    }
    /// <summary>
    /// 统计一段时间内的库存趋势（用于展示折线图）
    /// </summary>
    /// <param name="search">请求数据</param>
    /// <returns>返回数据</returns>
    public async Task<ResponseInventory.Statistics> Statistics(RequestInventory.Statistics body) //统计图标数据生成
    {
        if (!await ResourceVerification.CheckResourceExist<Reagent>(MySqlSugar.Db, body.ReagentId)) //资源存在性验证
        {
            throw new HttpRequestException("不存在的资源批号id", null, HttpStatusCode.Forbidden);
        }

        if (body.StartTime >= body.EndTime)
        {
            throw new HttpRequestException("开始时间不能比结束时间晚", null, HttpStatusCode.Forbidden);
        }
        
        DateTime searchstart = body.StartTime;
        DateTime searchend = body.StartTime.AddDays(body.IntervalDay);
        int number = 0;
        var resultdata = new ResponseInventory.StatisticsData
        {
            XAxisLabels = new List<DateTime>(),
            DataSet = new List<ResponseInventory.DataSet>(),
        };
        resultdata.DataSet.Add(new  ResponseInventory.DataSet{Name = "库存",Number = new List<int>()});
        resultdata.DataSet.Add(new  ResponseInventory.DataSet{Name = "入库",Number =new List<int>()});
        resultdata.DataSet.Add(new  ResponseInventory.DataSet{Name = "出库",Number =new List<int>()});

        while (searchend<=body.EndTime)
        {
            
            int incount=await _repositoryoperation.InboundCount(body.ReagentId,body.LotId,body.OnlyLot,searchstart,searchend); 
            int outcount=await _repositoryoperation.OutboundCount(body.ReagentId,body.LotId,body.OnlyLot,searchstart,searchend);
            number=number+incount-outcount;
            resultdata.XAxisLabels.Add(searchstart);
            resultdata.DataSet[0].Number.Add(number);
            resultdata.DataSet[1].Number.Add(incount);
            resultdata.DataSet[2].Number.Add(outcount);
            searchstart=searchend;
            searchend=searchend.AddDays(body.IntervalDay);
        }
        return new ResponseInventory.Statistics
        {
            Status = 0,
            Message = "成功",
            Data = resultdata,
        };

    }

}