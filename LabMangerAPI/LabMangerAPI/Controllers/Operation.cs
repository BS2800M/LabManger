namespace LabMangerAPI.Controllers;

using DTOs;
using Microsoft.AspNetCore.Mvc;
using Validator;   

using Service;

    [SessionAuthorize]
[ApiController]
[Route("operation/")]
[RequirePermission]
public class OperationController : ControllerBase
{
    private readonly ServiceOperation _operationService;
    
    public OperationController(ServiceOperation operationService)
    {
        _operationService = operationService;
    }
    [HttpPost("inbound")]

    public async Task<ResponseOperation.Inbound> Inbound([FromBody] RequestOperation.Inbound body)
    {
        return await _operationService.Inbound(body);
    }
    [HttpPost("outbound")]

    public async Task<ResponseOperation.Outbound> Outbound([FromBody] RequestOperation.Outbound body)
    {
        return await _operationService.Outbound(body);
    }
    
    [HttpPost("special_outbound")]

    public async Task<ResponseOperation.SpecialOutbound> SpecialOutbound([FromBody] RequestOperation.SpecialOutbound body)
    {
        return await _operationService.SpecialOutbound(body);
    }
    
    [HttpGet("show")]
    public async Task<ResponseOperation.Show> Show([FromQuery] RequestOperation.Show body)
    {
        return await _operationService.Show(body);
    }
    [HttpPut("update")]
    public async Task<ResponseOperation.Update> Update([FromBody] RequestOperation.Update body)
    {
        return await _operationService.Update(body);
    }
    
    [HttpPut("del")]
    public async Task<ResponseOperation.Del> Del([FromBody] RequestOperation.Del body)
    {
        return await _operationService.Del(body);
    }

    [HttpGet("exporttoexcel")]
    public async Task<ResponseOperation.ExportToExcel> ExportToExcel([FromQuery] RequestOperation.ExportToExcel query)
    {
        return await _operationService.ExportToExcel(query);
    }
    
    
    
    
}