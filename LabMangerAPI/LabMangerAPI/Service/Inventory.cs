

using LabMangerAPI.Repository;
using SqlSugar;
using LabMangerAPI.DTOs;
using LabMangerAPI.Models;
using LabMangerAPI.Validator;
using LabMangerAPI.Data;
using System.Net;
namespace LabMangerAPI.Service;

public class ServiceInventory
{
    private readonly RepositoryInventory _repository;
    private readonly RepositoryOperation _repositoryoperation;

    public ServiceInventory(RepositoryInventory repository, RepositoryOperation repositoryoperation)
    {
        _repository = repository;
        _repositoryoperation = repositoryoperation;
    }

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

    public async Task<ResponseInventory.Statistics> Statistics(RequestInventory.Statistics body)
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
            
            int incount=await _repositoryoperation.InboundCount(body.ReagentId,searchstart,searchend); 
            int outcount=await _repositoryoperation.OutboundCount(body.ReagentId,searchstart,searchend);
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