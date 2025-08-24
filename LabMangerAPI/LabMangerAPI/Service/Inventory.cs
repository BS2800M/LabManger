
using LabMangerAPI.Repository;
using SqlSugar;
using LabMangerAPI.DTOs;
namespace LabMangerAPI.Service;

public class ServiceInventory
{
    private readonly RepositoryInventory _repository;
    private readonly RepositoryOperation _repositoryoperation;

    public ServiceInventory(RepositoryInventory repository,RepositoryOperation repositoryoperation)
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

    public  async Task<ResponseInventory.AuditAll> AuditAll(RequestInventory.AuditAll search)
    {
       var  alllist = await _repository.ShowAll();
       foreach (var item in alllist)
       {
        var inboundcount= await _repositoryoperation.InboundCount(item.ReagentId, item.LotId);
        var outboundcount= await _repositoryoperation.OutboundCount(item.ReagentId, item.LotId);
        var number=inboundcount-outboundcount;
        await _repository.Update(item.Id, number);
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


}