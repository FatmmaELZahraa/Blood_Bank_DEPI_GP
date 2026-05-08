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
        public async Task<ActionResult<IEnumerable<Appointment>>> GetMyAppointments()
        {
                
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var appointments = await _context.Appointments
                .Where(a => a.DonorId == userId && a.AppointmentDate >= DateTime.Today)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();

            return Ok(appointments);
        }

        // 2. Book a new appointment
        //[HttpPost("book")]
        //public async Task<ActionResult> BookAppointment(BookAppointmentDto dto)
        //{
        //    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        //    var donor = await _context.Donors.FindAsync(userId);
        //    if (donor == null) return BadRequest("Only Donors can book appointments.");

        //    bool alreadyBooked = await _context.Appointments
        //        .AnyAsync(a => a.DonorId == userId && a.AppointmentDate.Date == dto.AppointmentDate.Date && a.Status == "Confirmed");

        //    if (alreadyBooked)
        //        return BadRequest("You already have a confirmed appointment on this date.");

        //    var newAppointment = new Appointment
        //    {
        //        DonorId = userId,
        //        Location = dto.Location,
        //        CenterName = dto.CenterName,
        //        CenterAddress = dto.CenterAddress,
        //        AppointmentDate = dto.AppointmentDate,
        //        TimeSlot = dto.TimeSlot,
        //        Status = "Confirmed"
        //    };

        //    _context.Appointments.Add(newAppointment);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Appointment booked successfully!", appointmentId = newAppointment.Id });
        //}
        [HttpPost("book")]
        public async Task<ActionResult> BookAppointment(BookAppointmentDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            if (donor == null) return BadRequest("Only Donors can book appointments.");

            bool alreadyBooked = await _context.Appointments
                .AnyAsync(a => a.DonorId == userId && a.AppointmentDate.Date == dto.AppointmentDate.Date && a.Status == "Confirmed");

            if (alreadyBooked)
                return BadRequest("You already have a confirmed appointment on this date.");

            var newAppointment = new Appointment
            {
                DonorId = userId,
                Location = dto.Location,
                CenterName = dto.CenterName,
                CenterAddress = dto.CenterAddress,
                AppointmentDate = dto.AppointmentDate,
                TimeSlot = dto.TimeSlot,
                Status = "Completed" 
            };

            donor.Points += 1000;
            donor.TotalDonations += 1;
            donor.LastDonationDate = dto.AppointmentDate;

            _context.Appointments.Add(newAppointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked and 1000 points granted!", points = donor.Points });
        }

        // 3. Cancel an appointment
        [HttpDelete("cancel/{id}")]
        public async Task<ActionResult> CancelAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.DonorId == userId);

            if (appointment == null) return NotFound("Appointment not found.");

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment cancelled." });
        }

        [HttpGet("donation-history")]
        [Authorize]
        public async Task<ActionResult> GetDonationHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            // 1. العثور على المواعيد التي مر تاريخها ولم يتم تحديثها بعد
            var pastConfirmedAppointments = await _context.Appointments
                .Where(a => a.DonorId == userId && a.Status == "Confirmed" && a.AppointmentDate < DateTime.Now)
                .ToListAsync();

            // 2. تحديث النقاط تلقائياً لكل موعد مر تاريخه
            if (pastConfirmedAppointments.Any() && donor != null)
            {
                foreach (var apt in pastConfirmedAppointments)
                {
                    apt.Status = "Completed";
                    donor.Points += 1000;
                    donor.TotalDonations += 1;
                }
                await _context.SaveChangesAsync();
            }

            var history = await _context.Appointments
                .Where(a => a.DonorId == userId && a.Status == "Completed")
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

            var stats = new
            {
                totalDonations = donor?.TotalDonations ?? 0,
                totalVolume = (history.Count * 450) + " ml",
                livesImpacted = (donor?.TotalDonations ?? 0) * 3
            };

            return Ok(new { history, stats });
        }
        //[HttpGet("donation-history")]
        //[Authorize]
        //public async Task<ActionResult> GetDonationHistory()
        //{
        //    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        //    var history = await _context.Appointments
        //        .Where(a => a.DonorId == userId && (a.Status == "Completed" || a.AppointmentDate < DateTime.Now))
        //        .OrderByDescending(a => a.AppointmentDate) 
        //        .Select(a => new {
        //            a.Id,
        //            a.AppointmentDate,
        //            a.CenterName,
        //            a.CenterAddress,
        //            a.Status,
        //            type = "Whole Blood",
        //            volume = "450 ml"
        //        })
        //        .ToListAsync();

        //    var stats = new
        //    {
        //        totalDonations = history.Count,
        //        totalVolume = (history.Count * 450) + " ml",
        //        livesImpacted = history.Count * 3
        //    };

        //    return Ok(new { history, stats });
        //}
    }
}
