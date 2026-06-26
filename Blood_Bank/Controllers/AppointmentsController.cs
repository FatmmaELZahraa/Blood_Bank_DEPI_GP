//using Blood_Bank.Data;
//using Blood_Bank.DTO;
//using Blood_Bank.Models;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using System.Security.Claims;

//namespace Blood_Bank.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AppointmentsController : ControllerBase
//    {
//        private readonly AppDbContext _context;

//        public AppointmentsController(AppDbContext context)
//        {
//            _context = context;
//        }

//        [HttpGet("my-appointments")]
//        [Authorize] 
//        public async Task<ActionResult<IEnumerable<Appointment>>> GetMyAppointments()
//        {
//            try
//            {
//                var claimValue = User.FindFirstValue(ClaimTypes.NameIdentifier)
//                                 ?? User.FindFirstValue("uid")
//                                 ?? User.FindFirstValue("id")
//                                 ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;

//                if (string.IsNullOrEmpty(claimValue))
//                {
//                    return Unauthorized(new { error = "لم يتم العثور على معرف المستخدم داخل التوكن (Token Claims)." });
//                }

//                if (!int.TryParse(claimValue, out int userId))
//                {
//                    return BadRequest(new { error = "صيغة معرف المستخدم داخل التوكن غير صحيحة." });
//                }

//                var today = DateTime.Today;
//                var appointments = await _context.Appointments
//                    .Where(a => a.DonorId == userId && a.AppointmentDate >= today)
//                    .OrderBy(a => a.AppointmentDate)
//                    .ToListAsync();

//                return Ok(appointments);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"[ERROR IN APPOINTMENTS]: {ex.Message}");
//                if (ex.InnerException != null)
//                {
//                    Console.WriteLine($"[INNER EXCEPTION]: {ex.InnerException.Message}");
//                }

//                return StatusCode(500, new
//                {
//                    error = "حدث خطأ داخلي في السيرفر أثناء جلب المواعيد.",
//                    details = ex.Message,
//                    innerError = ex.InnerException?.Message
//                });
//            }
//        }

//        //[HttpPost("book")]
//        //public async Task<ActionResult> BookAppointment(BookAppointmentDto dto)
//        //{
//        //    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//        //    var donor = await _context.Donors.FindAsync(userId);

//        //    if (donor == null) return BadRequest("Only Donors can book appointments.");

//        //    bool alreadyBooked = await _context.Appointments
//        //        .AnyAsync(a => a.DonorId == userId && a.AppointmentDate.Date == dto.AppointmentDate.Date && a.Status == "Confirmed");

//        //    if (alreadyBooked)
//        //        return BadRequest("You already have a confirmed appointment on this date.");

//        //    var newAppointment = new Appointment
//        //    {
//        //        DonorId = userId,
//        //        Location = dto.Location,
//        //        CenterName = dto.CenterName,
//        //        CenterAddress = dto.CenterAddress,
//        //        AppointmentDate = dto.AppointmentDate,
//        //        TimeSlot = dto.TimeSlot,
//        //        Status = "Completed" 
//        //    };

//        //    donor.Points += 1000;
//        //    donor.TotalDonations += 1;
//        //    donor.LastDonationDate = dto.AppointmentDate;

//        //    _context.Appointments.Add(newAppointment);
//        //    await _context.SaveChangesAsync();

//        //    return Ok(new { message = "Appointment booked and 1000 points granted!", points = donor.Points });
//        //}

//        [HttpPost("book")]
//        public async Task<ActionResult> BookAppointment([FromBody] BookAppointmentDto dto) // Added [FromBody]
//        {
//            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//            var donor = await _context.Donors.FindAsync(userId);

//            if (donor == null) return BadRequest("Only Donors can book appointments.");

//            // Make sure this matches the status you actually save
//            bool alreadyBooked = await _context.Appointments
//                .AnyAsync(a => a.DonorId == userId && a.AppointmentDate.Date == dto.AppointmentDate.Date && a.Status == "Confirmed");

//            if (alreadyBooked)
//                return BadRequest("You already have a confirmed appointment on this date.");

//            var newAppointment = new Appointment
//            {
//                DonorId = userId,
//                Location = dto.Location,
//                CenterName = dto.CenterName,
//                CenterAddress = dto.CenterAddress,
//                AppointmentDate = dto.AppointmentDate,
//                TimeSlot = dto.TimeSlot,
//                Status = "Confirmed" // Changed from "Completed" to match your verification check
//            };

//            donor.Points += 1000;
//            donor.TotalDonations += 1;
//            donor.LastDonationDate = dto.AppointmentDate;

//            _context.Appointments.Add(newAppointment);
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Appointment booked and 1000 points granted!", points = donor.Points });
//        }

//        [HttpDelete("cancel/{id}")]
//        public async Task<ActionResult> CancelAppointment(int id)
//        {
//            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//            var appointment = await _context.Appointments.FirstOrDefaultAsync(a => a.Id == id && a.DonorId == userId);

//            if (appointment == null) return NotFound("Appointment not found.");

//            appointment.Status = "Cancelled";
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Appointment cancelled." });
//        }

//        [HttpGet("donation-history")]
//        [Authorize]
//        public async Task<ActionResult> GetDonationHistory()
//        {
//            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
//            var donor = await _context.Donors.FindAsync(userId);

//            var pastConfirmedAppointments = await _context.Appointments
//                .Where(a => a.DonorId == userId && a.Status == "Confirmed" && a.AppointmentDate < DateTime.Now)
//                .ToListAsync();

//            if (pastConfirmedAppointments.Any() && donor != null)
//            {
//                foreach (var apt in pastConfirmedAppointments)
//                {
//                    apt.Status = "Completed";
//                    donor.Points += 1000;
//                    donor.TotalDonations += 1;
//                }
//                await _context.SaveChangesAsync();
//            }

//            var history = await _context.Appointments
//                .Where(a => a.DonorId == userId && a.Status == "Completed")
//                .OrderByDescending(a => a.AppointmentDate)
//                .Select(a => new {
//                    a.Id,
//                    a.AppointmentDate,
//                    a.CenterName,
//                    a.CenterAddress,
//                    a.Status,
//                    type = "Whole Blood",
//                    volume = "450 ml"
//                })
//                .ToListAsync();

//            var stats = new
//            {
//                totalDonations = donor?.TotalDonations ?? 0,
//                totalVolume = (history.Count * 450) + " ml",
//                livesImpacted = (donor?.TotalDonations ?? 0) * 3
//            };

//            return Ok(new { history, stats });
//        }

//    }
//}
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

            // التحقق مما إذا كان هناك موعد مؤكد أو قيد الانتظار في نفس اليوم لمنع التكرار
            bool alreadyBooked = await _context.Appointments
                .AnyAsync(a => a.DonorId == userId &&
                               a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                               (a.Status == "Confirmed" || a.Status == "Pending"));

            if (alreadyBooked)
                return BadRequest("You already have an appointment on this date.");

            // التعديل هنا: تحديد الحالة بناءً على التاريخ الحالي
            string initialStatus = dto.AppointmentDate >= DateTime.Now ? "Pending" : "Completed";

            var newAppointment = new Appointment
            {
                DonorId = userId,
                Location = dto.Location,
                CenterName = dto.CenterName,
                CenterAddress = dto.CenterAddress,
                AppointmentDate = dto.AppointmentDate,
                TimeSlot = dto.TimeSlot,
                Status = initialStatus // إسناد الحالة الديناميكية
            };

            // نمنح النقاط ونزيد العداد فقط إذا كان الموعد قد اكتمل بالفعل
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

        [HttpGet("donation-history")]
        [Authorize]
        public async Task<ActionResult> GetDonationHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var donor = await _context.Donors.FindAsync(userId);

            // 1. تحديث تلقائي للمواعيد الـ Pending التي مر تاريخها لتصبح Completed
            var pastPendingAppointments = await _context.Appointments
                .Where(a => a.DonorId == userId && a.Status == "Pending" && a.AppointmentDate < DateTime.Now)
                .ToListAsync();

            if (pastPendingAppointments.Any() && donor != null)
            {
                foreach (var apt in pastPendingAppointments)
                {
                    apt.Status = "Completed";
                    donor.Points += 1000; // إضافة النقاط عند اكتمال الموعد فعلياً
                    donor.TotalDonations += 1;
                }
                await _context.SaveChangesAsync();
            }

            // 2. التعديل هنا: جلب المواعيد المكتملة والقيد الانتظار معاً ليظهر كل شيء في السجل
            var history = await _context.Appointments
                .Where(a => a.DonorId == userId && (a.Status == "Completed" || a.Status == "Pending"))
                .OrderByDescending(a => a.AppointmentDate)
                .Select(a => new {
                    a.Id,
                    a.AppointmentDate,
                    a.CenterName,
                    a.CenterAddress,
                    a.Status, // ستظهر هنا للمستخدم إما Pending أو Completed
                    type = "Whole Blood",
                    volume = "450 ml"
                })
                .ToListAsync();

            // 3. حساب الإحصائيات بناءً على التبرعات المكتملة فقط (Completed) لضمان دقة الأرقام
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