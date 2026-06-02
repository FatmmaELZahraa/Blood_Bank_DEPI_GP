using Blood_Bank.Data;
using Blood_Bank.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers;

[ApiController]
[Route("api/blood-requests")]
[Authorize]
public class BloodRequestsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BloodRequestsController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/blood-requests
    [HttpGet]
    [HttpGet]
    public async Task<IActionResult> GetAll(
    [FromQuery] int? UserID,
    [FromQuery] string? bloodType,
    [FromQuery] string? status,
    [FromQuery] string? priority)
    {
        var query = _db.BloodRequests.AsQueryable();

        if (UserID.HasValue)
            query = query.Where(r => r.UserID == UserID.Value);
        if (!string.IsNullOrEmpty(bloodType))
            query = query.Where(r => r.BloodType == bloodType);
        if (!string.IsNullOrEmpty(status))
            query = query.Where(r => r.Status == status);
        if (!string.IsNullOrEmpty(priority))
            query = query.Where(r => r.priority == priority);

        // جيب الـ requests الأول
        var requests = await query
            .OrderByDescending(r => r.RequestDate)
            .ToListAsync();

        // جيب الـ hospitals منفصلة
        var userIds = requests.Select(r => r.UserID).Distinct().ToList();
        var hospitals = await _db.Hospitals
            .Where(h => userIds.Contains(h.UserID))
            .Select(h => new { h.UserID, h.Name })
            .ToListAsync();

        // دمجهم في الـ response
        var results = requests.Select(r => new
        {
            r.RequestId,
            r.BloodType,
            r.Quantity,
            r.priority,
            r.Status,
            r.RequestDate,
            r.Notes,
            r.UserID,
            Hospital = hospitals.FirstOrDefault(h => h.UserID == r.UserID)
        });

        return Ok(results);
    }
    // GET /api/blood-requests/{id}
    [HttpGet("{id}")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var request = await _db.BloodRequests
            .Where(r => r.RequestId == id)
            .FirstOrDefaultAsync();

        if (request == null)
            return NotFound(new { error = "Blood request not found." });

        var hospital = await _db.Hospitals
            .Where(h => h.UserID == request.UserID)
            .Select(h => new { h.UserID, h.Name })
            .FirstOrDefaultAsync();

        return Ok(new
        {
            request.RequestId,
            request.BloodType,
            request.Quantity,
            request.priority,
            request.Status,
            request.RequestDate,
            request.Notes,
            request.UserID,
            Hospital = hospital
        });
    }

    // POST /api/blood-requests
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBloodRequestDto dto)
    {
        // تحقق من الـ hospital عن طريق User table مباشرة
        var hospitalExists = await _db.Hospitals
            .AnyAsync(h => h.UserID == dto.UserID);

        if (!hospitalExists)
            return BadRequest(new { error = "Hospital not found.", receivedUserID = dto.UserID });

        if (!IsValidBloodType(dto.BloodType))
            return BadRequest(new { error = "Invalid blood type.", validValues = ValidBloodTypes });

        var request = new BloodRequest
        {
            BloodType = dto.BloodType,
            Quantity = dto.Quantity,
            priority = dto.Priority,
            Status = "Pending",
            RequestDate = DateTime.UtcNow,
            Notes = dto.Notes,
            UserID = dto.UserID
        };

        _db.BloodRequests.Add(request);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = request.RequestId }, new
        {
            request.RequestId,
            request.Status,
            request.RequestDate
        });
    }

    // PATCH /api/blood-requests/{id}/status
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var request = await _db.BloodRequests.FindAsync(id);
        if (request == null)
            return NotFound(new { error = "Blood request not found." });

        var allowed = new[] { "Approved", "Fulfilled", "Rejected" };
        if (!allowed.Contains(dto.Status))
            return BadRequest(new { error = "Invalid status.", validValues = allowed });

        request.Status = dto.Status;
        await _db.SaveChangesAsync();

        return Ok(new { request.RequestId, request.Status });
    }

    // DELETE /api/blood-requests/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var request = await _db.BloodRequests.FindAsync(id);
        if (request == null)
            return NotFound(new { error = "Blood request not found." });

        if (request.Status != "Pending")
            return Conflict(new { error = "Only Pending requests can be deleted." });

        _db.BloodRequests.Remove(request);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static readonly string[] ValidBloodTypes = { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" };
    private static bool IsValidBloodType(string bt) => ValidBloodTypes.Contains(bt);
}

public record CreateBloodRequestDto(
    string BloodType,
    int Quantity,
    string Priority,
    int UserID,
    string? Notes
);

public record UpdateStatusDto(string Status);