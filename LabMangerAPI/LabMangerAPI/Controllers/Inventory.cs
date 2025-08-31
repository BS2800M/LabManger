using LabMangerAPI.Service;
using LabMangerAPI.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using LabMangerAPI.Validator;

namespace LabMangerAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("inventory/")]
    [RequirePermission]
    public class InventoryController : ControllerBase
    {
        private readonly ServiceInventory _inventoryservice;
        
        public InventoryController(ServiceInventory inventoryservice)
        {
            _inventoryservice = inventoryservice;
        }
        
        [HttpGet("show")]
        public async Task<ResponseInventory.Show> Show([FromQuery] RequestInventory.Show query)
        {
            return await _inventoryservice.Show(query);
        }
        [HttpPut("auditall")]
        public async Task<ResponseInventory.AuditAll> AuditAll([FromBody] RequestInventory.AuditAll body)
        {
            return await _inventoryservice.AuditAll(body);
        }
        [HttpGet("dashboard")]
        public async Task<ResponseInventory.DashBoard> DashBoard([FromQuery] RequestInventory.DashBoard query)
        {
            return await _inventoryservice.DashBoard(query);
        }

        [HttpGet("statistics")]
        public async Task<ResponseInventory.Statistics> Statistics([FromQuery] RequestInventory.Statistics query)
        {
            return await _inventoryservice.Statistics(query);
        }

    }
}