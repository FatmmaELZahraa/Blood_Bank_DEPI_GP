using Blood_Bank.Data;
using Blood_Bank.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/admin/overview
        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var totalDonors = await _context.Donors.CountAsync();
            var totalHospitals = await _context.Hospitals.CountAsync();
            var totalBloodUnits = await _context.BloodUnits.SumAsync(u => u.Quantity);
            var activeSOS = await _context.SosRequests.CountAsync();

            var recentActivity = await _context.Appointments
                .Include(a => a.Donor)
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .Select(a => new RecentActivityDto
                {
                    Description = a.Donor!.Name + " donated blood",
                    Time = a.CreatedAt
                })
                .ToListAsync();

            var result = new AdminOverviewDto
            {
                TotalDonors = totalDonors,
                TotalHospitals = totalHospitals,
                TotalBloodUnits = totalBloodUnits,
                ActiveSOS = activeSOS,
                RecentActivity = recentActivity
            };

            return Ok(result);
        }

        // GET /api/admin/donors
        [HttpGet("donors")]
        public async Task<IActionResult> GetAllDonors()
        {
            var donors = await _context.Donors
                .Select(d => new AdminDonorDto
                {
                    Id = d.UserID,
                    Name = d.Name,
                    Email = d.Email,
                    Phone = d.phone.ToString(),
                    BloodType = d.BloodType ?? string.Empty,
                    TotalDonations = d.TotalDonations,
                    Points = d.Points,
                    Status = d.IsTopDonor ? "Top Donor" : "Active",
                    LastDonationDate = d.LastDonationDate
                })
                .ToListAsync();

            return Ok(donors);
        }

        // PUT /api/admin/donors/{id}/status
        [HttpPut("donors/{id}/status")]
        public async Task<IActionResult> UpdateDonorStatus(int id, UpdateDonorStatusDto dto)
        {
            var donor = await _context.Donors.FindAsync(id);
            if (donor == null)
                return NotFound(new { message = "Donor not found" });

            donor.IsTopDonor = dto.IsTopDonor;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully" });
        }

        // DELETE /api/admin/donors/{id}
        [HttpDelete("donors/{id}")]
        public async Task<IActionResult> DeleteDonor(int id)
        {
            var donor = await _context.Donors.FindAsync(id);
            if (donor == null)
                return NotFound(new { message = "Donor not found" });

            _context.Donors.Remove(donor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Donor deleted successfully" });
        }

        // GET /api/admin/hospitals
        [HttpGet("hospitals")]
        public async Task<IActionResult> GetAllHospitals()
        {
            var hospitals = await _context.Hospitals
                .Select(h => new AdminHospitalDto
                {
                    Id = h.UserID,
                    Name = h.Name,
                    Email = h.Email,
                    Phone = h.phone.ToString(),
                    Address = h.Address ?? string.Empty,
                    TotalCapacity = h.TotalCapacity ,
                    CurrentUnits = h.CurrentUnits ,
                    CreatedAt = h.CreatedAt
                })
                .ToListAsync();

            return Ok(hospitals);
        }

        // DELETE /api/admin/hospitals/{id}
        [HttpDelete("hospitals/{id}")]
        public async Task<IActionResult> DeleteHospital(int id)
        {
            var hospital = await _context.Hospitals.FindAsync(id);
            if (hospital == null)
                return NotFound(new { message = "Hospital not found" });

            _context.Hospitals.Remove(hospital);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Hospital deleted successfully" });
        }

        // GET /api/admin/reports
        [HttpGet("reports")]
        public async Task<IActionResult> GetReports()
        {
            var totalDonors = await _context.Donors.CountAsync();
            var newDonors = await _context.Donors.CountAsync();
            var totalDonations = await _context.Appointments
                .CountAsync(a => a.Status == "Completed");
            var totalBloodRequests = await _context.BloodRequests.CountAsync();
            var totalSosRequests = await _context.SosRequests.CountAsync();

            var bloodTypeDistribution = await _context.BloodUnits
                .GroupBy(u => u.BloodType)
                .Select(g => new BloodTypeUsageDto
                {
                    Type = g.Key ?? string.Empty,
                    Donated = (int)g.Sum(u => u.Quantity),
                    Used = 0
                })
                .ToListAsync();

            var monthlyDonations = await _context.Appointments
                .Where(a => a.Status == "Completed" && a.CreatedAt >= DateTime.UtcNow.AddMonths(-6))
                .GroupBy(a => new { a.CreatedAt.Year, a.CreatedAt.Month })
                .Select(g => new MonthlyDonationDto
                {
                    Month = g.Key.Year + "-" + g.Key.Month,
                    Donations = g.Count(),
                    Target = 100
                })
                .ToListAsync();

            var result = new AdminReportsResponseDto
            {
                KeyMetrics = new MainStatsDto
                {
                    TotalDonations = totalDonations,
                    NewDonors = newDonors
                },
                MonthlyDonations = monthlyDonations,
                BloodTypeSupplyDemand = bloodTypeDistribution,
                RegionalDistribution = new List<RegionalPerformanceDto>()
            };

            return Ok(result);
        }

        // GET /api/admin/settings
        [HttpGet("settings")]
        public IActionResult GetSettings()
        {
            var settings = new AdminSettingsDto
            {
                SiteName = "BloodLink",
                SiteEmail = "admin@bloodlink.com",
                SosNotifications = true,
                LowStockAlerts = true,
                NewDonorNotifications = true,
                WeeklyReports = false,
                CriticalThreshold = 10,
                LowThreshold = 20,
                DonationCooldown = 90,
                MaintenanceMode = false,
                Timezone = "UTC"
            };

            return Ok(settings);
        }

        // PUT /api/admin/settings
        [HttpPut("settings")]
        public IActionResult UpdateSettings(AdminSettingsDto dto)
        {
            return Ok(new { message = "Settings updated successfully", settings = dto });
        }

        // GET /api/admin/appointments
        [HttpGet("appointments")]
        public async Task<IActionResult> GetAllAppointments()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Donor)
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new
                {
                    a.Id,
                    DonorName = a.Donor!.Name,
                    DonorEmail = a.Donor!.Email,
                    a.AppointmentDate,
                    a.TimeSlot,
                    a.CenterName,
                    a.CenterAddress,
                    a.Status
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // PUT /api/admin/appointments/{id}/approve
        [HttpPut("appointments/{id}/approve")]
        public async Task<IActionResult> ApproveAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            if (appointment.Status != "Pending")
                return BadRequest(new { message = "Only pending appointments can be approved" });

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment approved successfully" });
        }

        // PUT /api/admin/appointments/{id}/reject
        [HttpPut("appointments/{id}/reject")]
        public async Task<IActionResult> RejectAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            if (appointment.Status != "Pending")
                return BadRequest(new { message = "Only pending appointments can be rejected" });

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment rejected" });
        }
    }
}