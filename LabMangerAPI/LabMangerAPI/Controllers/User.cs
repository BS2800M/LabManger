using LabMangerAPI.RequestType;
using LabMangerAPI.Validator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LabMangerAPI.Service;
namespace LabMangerAPI.Controllers
{
    [ApiController]
    [Authorize]
    [Route("user/")]
    [RequirePermission]
    public class UserController : ControllerBase
    {
        private readonly ServiceUser _service;
        
        public UserController(ServiceUser service)
        {
            _service = service;
        }
        
        
        [HttpPost("add")]
        public async Task<ResponseUser.Add> Add([FromBody] RequestUser.Add body)
        {
            var result = await (_service.Add(body));
            return result;
        }
        
        [HttpGet("show")]
        public async Task<ResponseUser.Show> Show([FromQuery] RequestUser.Show search)
        {

            var result = await (_service.Show(search));
            return result;

        }
        [HttpPut("update")]
        public async Task<ResponseUser.Update> Post([FromBody] RequestUser.Update body)
        {
            var result = await (_service.Update(body));
            return result;
        }
        [HttpPut("del")]
        public async Task<ResponseUser.Del> Del ([FromBody] RequestUser.Del body)
        {
            var result = await (_service.Del(body));
            return result;
        }
    }
    
}