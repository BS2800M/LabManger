using LabMangerAPI.Service;
using LabMangerAPI.DTOs;
using Microsoft.AspNetCore.Mvc;

using LabMangerAPI.Validator;

namespace LabMangerAPI.Controllers
{
    [SessionAuthorize]
    [ApiController]
    [Route("lot/")]
    [RequirePermission]
    public class LotController : ControllerBase
    {
        private readonly ServiceLot _lotService;
        
        public LotController(ServiceLot lotService)
        {
            _lotService = lotService;
        }
        
        [HttpPost("add")]
        public async Task<ResponseLot.Add> Add([FromBody] RequestLot.Add request)
        {
            return await _lotService.Add(request);
        }
        
        [HttpGet("show")]
        public async Task<ResponseLot.Show> Show([FromQuery] RequestLot.Show query)
        {
            return await _lotService.Show(query);
        }
        
        [HttpPut("update")]
        public async Task<ResponseLot.Update> Update([FromBody] RequestLot.Update request)
        {
            return await _lotService.Update(request);
        }
        
        [HttpPut("del")]
        public async Task<ResponseLot.Del> Del([FromBody] RequestLot.Del request)
        {
            return await _lotService.Del(request);
        }
        
        [HttpGet("showall")]
        public async Task<ResponseLot.ShowAll> ShowAll([FromQuery] RequestLot.ShowAll query)
        {
            return await _lotService.ShowAll(query);
        }
    }
}