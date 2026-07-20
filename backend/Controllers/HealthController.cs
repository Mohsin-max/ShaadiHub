using backend.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly AppDbContext _context;

    public HealthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var canConnect = await _context.Database.CanConnectAsync();

        if (!canConnect)
        {
            return StatusCode(503, new { status = "error", database = "unreachable" });
        }

        return Ok(new { status = "ok", database = "connected" });
    }
}
