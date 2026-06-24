using Blood_Bank.Data;
using Blood_Bank.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers;

[ApiController]
[Route("api/sos-requests")]
[Authorize]
public class SosRequestsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SosRequestsController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/sos-requests
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? hospitalId,
        [FromQuery] string? bloodType,
        [FromQuery] string? priority,
        [FromQuery] DateTime? from)
    {
        var query = _db.SosRequests.AsQueryable();

        if (hospitalId.HasValue)
            query = query.Where(s => s.HospitalId == hospitalId.Value);
        if (!string.IsNullOrEmpty(bloodType))
            query = query.Where(s => s.BloodType == bloodType);
        if (!string.IsNullOrEmpty(priority))
            query = query.Where(s => s.Priority == priority);
        if (from.HasValue)
            query = query.Where(s => s.RequestDate >= from.Value);

        var sosList = await query
            .OrderByDescending(s => s.RequestDate)
            .ToListAsync();

        var hospitalIds = sosList.Select(s => s.HospitalId).Distinct().ToList();
        var hospitals = await _db.Hospitals
            .Where(h => hospitalIds.Contains(h.UserID))
            .Select(h => new { h.UserID, h.Name, h.phone })
            .ToListAsync();

        var results = sosList.Select(s => new
        {
            s.SOSId,
            s.BloodType,
            s.Units,
            s.Priority,
            s.Description,
            s.RequestDate,
            s.Status,
            s.HospitalId,
            Hospital = hospitals.FirstOrDefault(h => h.UserID == s.HospitalId)
        });

        return Ok(results);
    }

    // GET /api/sos-requests/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var sos = await _db.SosRequests
            .Where(s => s.SOSId == id)
            .FirstOrDefaultAsync();

        if (sos == null)
            return NotFound(new { error = "SOS request not found." });

        var hospital = await _db.Hospitals
            .Where(h => h.UserID == sos.HospitalId)
            .Select(h => new { h.UserID, h.Name, h.phone })
            .FirstOrDefaultAsync();

        return Ok(new
        {
            sos.SOSId,
            sos.BloodType,
            sos.Units,
            sos.Priority,
            sos.Description,
            sos.RequestDate,
            sos.Status,
            sos.HospitalId,
            Hospital = hospital
        });
    }

    // POST /api/sos-requests
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateSosRequestDto dto)
    {
        if (!await _db.Hospitals.AnyAsync(h => h.UserID == dto.HospitalId))
            return BadRequest(new { error = "Hospital not found.", receivedHospitalId = dto.HospitalId });

        if (!IsValidBloodType(dto.BloodType))
            return BadRequest(new { error = "Invalid blood type.", validValues = ValidBloodTypes });

        var validPriorities = new[] { "Urgent", "Critical" };
        if (!validPriorities.Contains(dto.Priority))
            return BadRequest(new { error = "SOS priority must be Urgent or Critical." });

        var sos = new SosRequest
        {
            BloodType = dto.BloodType,
            Units = dto.Units,
            Priority = dto.Priority,
            Description = dto.Description,
            RequestDate = DateTime.UtcNow,
            HospitalId = dto.HospitalId,
            Status = "Pending"
        };

        _db.SosRequests.Add(sos);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = sos.SOSId }, new
        {
            sos.SOSId,
            sos.RequestDate,
            sos.Priority,
            sos.Status
        });
    }

    // PATCH /api/sos-requests/{id}/status
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateSosStatusDto dto)
    {
        var sos = await _db.SosRequests.FindAsync(id);
        if (sos == null)
            return NotFound(new { error = "SOS request not found." });

        var allowed = new[] { "Fulfilled", "Cancelled" };
        if (!allowed.Contains(dto.Status))
            return BadRequest(new { error = "Invalid status.", validValues = allowed });

        sos.Status = dto.Status;
        await _db.SaveChangesAsync();

        return Ok(new { sos.SOSId, sos.Status });
    }

    // DELETE /api/sos-requests/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var sos = await _db.SosRequests.FindAsync(id);
        if (sos == null)
            return NotFound(new { error = "SOS request not found." });

        _db.SosRequests.Remove(sos);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static readonly string[] ValidBloodTypes = { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" };
    private static bool IsValidBloodType(string bt) => ValidBloodTypes.Contains(bt);
}

public record CreateSosRequestDto(
    string BloodType,
    int Units,
    string Priority,
    int HospitalId,
    string? Description
);

public record UpdateSosStatusDto(string Status);