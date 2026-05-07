using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Blood_Bank.Data;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RewardsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RewardsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet("user-points")]
        public async Task<ActionResult> GetUserPoints()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            if (donor == null) return NotFound();

            // Calculate next level logic
            var levels = new[]
            {
                new { Name = "Bronze", Min = 0 },
                new { Name = "Silver", Min = 1000 },
                new { Name = "Gold", Min = 2000 },
                new { Name = "Platinum", Min = 3000 },
                new { Name = "Diamond", Min = 5000 }
            };

            var currentLevel = donor.CurrentLevel;
            var nextLevelObj = levels.FirstOrDefault(l => l.Min > donor.Points);

            return Ok(new
            {
                totalPoints = donor.Points,
                currentLevel = currentLevel,
                nextLevel = nextLevelObj?.Name ?? "Max Level",
                pointsToNextLevel = nextLevelObj != null ? nextLevelObj.Min - donor.Points : 0,
                lifetimeDonations = donor.TotalDonations
            });
        }

        [HttpPost("redeem/{rewardId}")]
        public async Task<ActionResult> RedeemReward(int rewardId, [FromBody] int cost)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            if (donor == null) return NotFound();
            if (donor.Points < cost) return BadRequest("Insufficient points.");

            donor.Points -= cost;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Reward redeemed successfully!", remainingPoints = donor.Points });
        }
    
}
}
