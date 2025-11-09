
using LabMangerAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using LabMangerAPI.Validator;   

using LabMangerAPI.Service;


namespace LabMangerAPI.Controllers;
[SessionAuthorize]
[ApiController]
[Route("reagent/")]
[RequirePermission]
public class ReagentController : ControllerBase
{
    private readonly ServiceReagent _reagentService;
    
    public ReagentController(ServiceReagent reagentService)
    {
        _reagentService = reagentService;
    }
    
    [HttpPost("add")]
    public async Task<ResponseReagent.Add> Add([FromBody] RequestReagent.Add request)
    {
        return await _reagentService.Add(request);
    }
    
    [HttpGet("show")]
    public async Task<ResponseReagent.Show> Show([FromQuery] RequestReagent.Show query)
    {
        return await _reagentService.Show(query);
    }
    
    [HttpPut("update")]
    public async Task<ResponseReagent.Update> Update([FromBody] RequestReagent.Update request)
    {
        return await _reagentService.Update(request);
    }
    
    [HttpPut("del")]
    
    public async Task<ResponseReagent.Del> Del([FromBody] RequestReagent.Del request)
    {
        return await _reagentService.Del(request);
    }
    
    [HttpGet("showall")]
    public async Task<ResponseReagent.ShowAll> ShowAll()
    {
        return await _reagentService.ShowAll();
    }
}