
using Blood_Bank.Data;
using Blood_Bank.DTO;
using Blood_Bank.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("my-appointments")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetMyAppointments()
        {
            try
            {
                var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
                                 ?? User.FindFirstValue("uid")
                                 ?? User.FindFirstValue("id")
                                 ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

                if (string.IsNullOrEmpty(claimValue))
                {
                    return Unauthorized(new { error = "لم يتم العثور على معرف المستخدم داخل التوكن (Token Claims)." });
                }

                if (!int.TryParse(claimValue, out int userId))
                {
                    return BadRequest(new { error = "صيغة معرف المستخدم داخل التوكن غير صحيحة." });
                }

                var today = DateTime.Today;
                var appointments = await _context.Appointments
                    .Where(a => a.DonorId == userId && a.AppointmentDate >= today)
                    .OrderBy(a => a.AppointmentDate)
                    .ToListAsync();

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR IN APPOINTMENTS]: {ex.Message}");
                return StatusCode(500, new { error = "حدث خطأ داخلي في السيرفر.", details = ex.Message });
            }
        }

        [HttpPost("book")]
        [Authorize]
        public async Task<ActionResult> BookAppointment([FromBody] BookAppointmentDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            if (donor == null) return BadRequest("Only Donors can book appointments.");

            bool alreadyBooked = await _context.Appointments
                .AnyAsync(a => a.DonorId == userId &&
                               a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                               (a.Status == "Confirmed" || a.Status == "Pending"));

            if (alreadyBooked)
                return BadRequest("You already have an appointment on this date.");

            string initialStatus = dto.AppointmentDate >= DateTime.Now ? "Pending" : "Completed";

            var newAppointment = new Appointment
            {
                DonorId = userId,
                Location = dto.Location,
                CenterName = dto.CenterName,
                CenterAddress = dto.CenterAddress,
                AppointmentDate = dto.AppointmentDate,
                TimeSlot = dto.TimeSlot,
                Status = initialStatus 
            };

            if (initialStatus == "Completed")
            {
                donor.Points += 1000;
                donor.TotalDonations += 1;
                donor.LastDonationDate = dto.AppointmentDate;
            }

            _context.Appointments.Add(newAppointment);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = initialStatus == "Pending" ? "Appointment booked and is pending." : "Past appointment recorded as completed!",
                status = initialStatus,
                points = donor.Points
            });
        }

        [HttpDelete("cancel/{id}")]
        [Authorize]
        public async Task<ActionResult> CancelAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.DonorId == userId);

            if (appointment == null) return NotFound("Appointment not found.");

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment cancelled." });
        }

 [HttpGet("all")]
[Authorize]  
public async Task<ActionResult> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new {
                    a.Id,
                    a.DonorId,
                    a.CenterName,
                    a.CenterAddress,
                    a.Location,
                    a.AppointmentDate,
                    a.TimeSlot,
                    a.Status,
                    DonorName = _context.Donors
                        .Where(d => d.UserID == a.DonorId)
                        .Select(d => d.Name)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // PATCH /api/Appointments/{id}/status (Admin only)
        [HttpPatch("{id}/status")]
        [Authorize]
        public async Task<ActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateAppointmentStatusDto dto)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound(new { error = "Appointment not found." });

            var allowed = new[] { "Confirmed", "Completed", "Cancelled" };
            if (!allowed.Contains(dto.Status))
                return BadRequest(new { error = "Invalid status.", validValues = allowed });

            appointment.Status = dto.Status;
            await _context.SaveChangesAsync();

            return Ok(new { appointment.Id, appointment.Status });
        }

        [HttpGet("donation-history")]
        [Authorize]
        public async Task<ActionResult> GetDonationHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            var pastPendingAppointments = await _context.Appointments
                .Where(a => a.DonorId == userId && a.Status == "Pending" && a.AppointmentDate < DateTime.Now)
                .ToListAsync();

            if (pastPendingAppointments.Any() && donor != null)
            {
                foreach (var apt in pastPendingAppointments)
                {
                    apt.Status = "Completed";
                    donor.Points += 1000; 
                    donor.TotalDonations += 1;
                }
                await _context.SaveChangesAsync();
            }

            var history = await _context.Appointments
                .Where(a => a.DonorId == userId && (a.Status == "Completed" || a.Status == "Pending"))
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new {
                    a.Id,
                    a.AppointmentDate,
                    a.CenterName,
                    a.CenterAddress,
                    a.Status, 
                    type = "Whole Blood",
                    volume = "450 ml"
                })
                .ToListAsync();

            int completedCount = history.Count(a => a.Status == "Completed");

            var stats = new
            {
                totalDonations = donor?.TotalDonations ?? completedCount,
                totalVolume = (completedCount * 450) + " ml",
                livesImpacted = (donor?.TotalDonations ?? completedCount) * 3
            };

            return Ok(new { history, stats });
        }

    }
}