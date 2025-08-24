
using LabMangerAPI.DTOs;
using LabMangerAPI.Validator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LabMangerAPI.Service;
namespace LabMangerAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("team/")]
    [RequirePermission]
    public class TeamController : ControllerBase
    {
        private readonly ServiceTeam _service;
        
        public TeamController(ServiceTeam service)
        {
            _service = service;
        }
        
        
        [HttpPost("add")]
        public async Task<ResponseTeam.Add> Add([FromBody] RequestTeam.Add body)
        {
            var result = await (_service.Add(body));
            return result;
        }
        
        [HttpGet("show")]
        public async Task<ResponseTeam.Show> Show([FromQuery] RequestTeam.Show search)
        {

            var result = await (_service.Show(search));
            return result;

        }
        [HttpPut("update")]
        public async Task<ResponseTeam.Update> Post([FromBody] RequestTeam.Update body)
        {
            var result = await (_service.Update(body));
            return result;
        }
        [HttpPut("del")]
        public async Task<ResponseTeam.Del> Del ([FromBody] RequestTeam.Del body)
        {
            var result = await (_service.Del(body));
            return result;
        }
    }
    
}