using LabMangerAPI.DTOs;
using LabMangerAPI.Service;
using Microsoft.AspNetCore.Mvc;



namespace LabMangerAPI.Controllers
{
    [ApiController]
    [Route("/signinout")]
    public class LogController : ControllerBase
    {
        private readonly ServiceSigninout _repositorysigninout;
        public LogController(ServiceSigninout repositorysigninout)
        {
            _repositorysigninout = repositorysigninout;
        }

        [HttpPost("signin")]
        public async Task<ResponseSigninout.Signin> SigninoutSignin([FromBody] RequestSigninout.Signin query)
        {
            var result= await  _repositorysigninout.Signin(query);
            return result;
        }
        [HttpGet("signout")]
        public ResponseSigninout.Signout SigninoutSignout([FromQuery] RequestSigninout.Signout query)
        {
            var result=  _repositorysigninout.Signout(query);
            return result;
        }

    }




    
}