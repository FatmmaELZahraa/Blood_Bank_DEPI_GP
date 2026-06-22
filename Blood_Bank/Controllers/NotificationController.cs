using Blood_Bank.Data;
using Blood_Bank.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

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

        // Send general blood donation campaign emails to all registered donors
        [HttpPost("send-donors")]
        public async Task<IActionResult> SendToTopDonors()
        {
            var donors = await _context.Donors
                .Where(d => d.Email != null)
                .ToListAsync();

            if (!donors.Any())
                return NotFound("No Donors found in the database");

            var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Emails_Templetes", "GeneralCampaign.html");

            if (!System.IO.File.Exists(templatePath))
            {
                templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Emails_Templetes", "GeneralCampaign.html");
            }

            if (!System.IO.File.Exists(templatePath))
                return NotFound($"General Campaign HTML template file is missing. Looked in: {templatePath}");

            string baseHtml = await System.IO.File.ReadAllTextAsync(templatePath);

            foreach (var donor in donors)
            {
                string finalizedHtml = baseHtml.Replace("{{DonorName}}", donor.Name);

                await _emailService.SendEmailAsync(
                    donor.Email,
                    "Urgent Blood Donation Request ❤️",
                    finalizedHtml
                );
            }

            return Ok($"Emails sent to {donors.Count} donors");
        }

        // Send urgent shortage alerts to targeted top donors based on specific blood type
        [HttpPost("send-shortage-alert")]
        public async Task<IActionResult> SendShortageAlert(string bloodType)
        {
            var topDonors = await _context.Donors
                .Where(d => d.IsTopDonor
                         && d.Email != null
                         && EF.Functions.Like(d.BloodType, bloodType))
                .ToListAsync();

            if (!topDonors.Any())
                return NotFound("No Top Donors available");

            var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Emails_Templetes", "ShortageAlert.html");

            if (!System.IO.File.Exists(templatePath))
            {
                templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Emails_Templetes", "ShortageAlert.html");
            }

            if (!System.IO.File.Exists(templatePath))
                return NotFound($"Shortage Alert HTML template file is missing. Looked in: {templatePath}");

            string baseHtml = await System.IO.File.ReadAllTextAsync(templatePath);

            foreach (var donor in topDonors)
            {
                string finalizedHtml = baseHtml
                    .Replace("{{DonorName}}", donor.Name)
                    .Replace("{{BloodType}}", donor.BloodType);

                await _emailService.SendEmailAsync(
                    donor.Email,
                    $"🚨 Urgent Shortage Alert: Blood Type ({bloodType}) Required Immediately",
                    finalizedHtml
                );
            }

            return Ok($"Shortage alert sent to {topDonors.Count} donors");
        }
    }
}