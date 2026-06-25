using Blood_Bank.Data;
using Blood_Bank.Models;
using Blood_Bank.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public NotificationController(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // ===============================
        // 1) Send Emails to ALL Top Donors
        // ===============================
        [HttpPost("send-top-donors")]
        public async Task<IActionResult> SendToTopDonors()
        {
            var donors = await _context.Donors
                .Where(d => d.IsTopDonor && d.Email != null)
                .ToListAsync();

            if (!donors.Any())
                return NotFound("No Top Donors found");

            foreach (var donor in donors)
            {
                await _emailService.SendEmailAsync(
                    donor.Email,
                    "Urgent Blood Donation Request ❤️",
                    $"Hello {donor.Name},\nWe need your help urgently for a blood donation request."
                );
            }

            return Ok($"Emails sent to {donors.Count} top donors");
        }

        // ===============================
        // 2) Send Emails for Shortage Event (optional trigger)
        // ===============================
        [HttpPost("send-shortage-alert")]
        public async Task<IActionResult> SendShortageAlert()
        {
            var topDonors = await _context.Donors
                .Where(d => d.IsTopDonor && d.Email != null)
                .ToListAsync();

            if (!topDonors.Any())
                return NotFound("No Top Donors available");

            foreach (var donor in topDonors)
            {
                await _emailService.SendEmailAsync(
                    donor.Email,
                    "🚨 Blood Shortage Alert",
                    $"Dear {donor.Name},\nThere is an urgent blood shortage. Please consider donating if possible."
                );
            }

            return Ok($"Shortage alert sent to {topDonors.Count} donors");
        }
    }
}
