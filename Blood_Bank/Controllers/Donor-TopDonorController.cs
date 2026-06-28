using Blood_Bank.Data;
using Blood_Bank.DTO;
using Blood_Bank.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DonorController(AppDbContext context)
        {
            _context = context;
        }

     
        [HttpPost("complete-profile/{id}")]
        public async Task<IActionResult> CompleteProfile(int id, [FromBody] CompleteProfileDto dto)
        {
            var donor = await _context.Donors.FindAsync(id);

            if (donor == null)
                return NotFound("Donor not found");

            donor.BloodType = dto.BloodType;
            donor.MedicalHistory = dto.MedicalHistory;
            donor.LastDonationDate = dto.LastDonationDate;

            await _context.SaveChangesAsync();

            return Ok("Profile completed successfully");
        }

      
        [HttpPost("mark-top/{id}")]
        public async Task<IActionResult> MarkTopDonor(int id)
        {
            var donor = await _context.Donors.FindAsync(id);

            if (donor == null)
                return NotFound("Donor not found");

            if (donor.IsTopDonor)
                return BadRequest("Already marked as Top Donor");

            donor.IsTopDonor = true;

            await _context.SaveChangesAsync();

            return Ok("Marked as Top Donor");
        }

      
        [HttpGet("all")]
        public async Task<IActionResult> GetAllDonors()
        {
            var donors = await _context.Donors
                .OrderByDescending(d => d.TotalDonations)
                .Select(d => new {
                    userID = d.UserID,
                    name = d.Name,
                    email = d.Email,
                    phone = d.phone,
                    bloodType = d.BloodType,
                    totalDonations = d.TotalDonations,
                    points = d.Points,
                    lastDonationDate = d.LastDonationDate,
                    status = d.IsTopDonor ? "Top Donor" : "Regular",
                    currentLevel = d.CurrentLevel
                })
                .ToListAsync();

            return Ok(donors);
        }

      
        [HttpGet("top-donors")]
        public async Task<IActionResult> GetTopDonors()
        {
            var donors = await _context.Donors
                .Where(d => d.IsTopDonor)
                .ToListAsync();

            return Ok(donors);
        }
    }
}