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

        // =========================
        // 1) COMPLETE PROFILE
        // =========================
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

        // =========================
        // 2) MARK AS TOP DONOR
        // =========================
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

        // =========================
        // 3) GET TOP DONORS
        // =========================
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