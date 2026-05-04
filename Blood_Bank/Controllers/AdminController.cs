using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Admin Controller");
        }
    }
}
