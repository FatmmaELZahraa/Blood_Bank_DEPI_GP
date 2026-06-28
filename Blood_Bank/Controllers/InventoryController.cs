using Blood_Bank.Data;
using Blood_Bank.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class InventoryController : ControllerBase
{
    private readonly AppDbContext _db;

    public InventoryController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("inventories")]
    public async Task<IActionResult> GetAllInventories()
    {
        var inventories = await _db.inventories
            .Include(i => i.BloodBank)
            .Include(i => i.BloodUnits)
            .Select(i => new
            {
                i.InventoryId,
                BloodBank = new
                {
                    i.BloodBank.UserID,
                    i.BloodBank.BankName,
                    i.BloodBank.Location
                },
                Summary = i.BloodUnits
                    .Where(u => u.ExpiryDate > DateTime.UtcNow)
                    .GroupBy(u => u.BloodType)
                    .Select(g => new
                    {
                        BloodType = g.Key,
                        TotalQuantity = g.Sum(u => u.Quantity)
                    })
                    .OrderBy(s => s.BloodType)
                    .ToList()
            })
            .ToListAsync();

        return Ok(inventories);
    }

    // GET /api/inventories/{id}
    [HttpGet("inventories/{id}")]
    public async Task<IActionResult> GetInventory(int id)
    {
        var inventory = await _db.inventories
            .Include(i => i.BloodBank)
            .Include(i => i.BloodUnits)
            .Where(i => i.InventoryId == id)
            .Select(i => new
            {
                i.InventoryId,
                BloodBank = new
                {
                    i.BloodBank.BankName,
                    i.BloodBank.Location
                },
                BloodUnits = i.BloodUnits.Select(u => new
                {
                    u.UnitId,
                    u.BloodType,
                    u.Quantity,
                    u.ExpiryDate
                })
            })
            .FirstOrDefaultAsync();

        if (inventory == null)
            return NotFound(new { error = "Inventory not found." });

        return Ok(inventory);
    }

    // GET /api/inventories/{id}/summary
    [HttpGet("inventories/{id}/summary")]
    public async Task<IActionResult> GetSummary(int id)
    {
        var exists = await _db.inventories.AnyAsync(i => i.InventoryId == id);
        if (!exists)
            return NotFound(new { error = "Inventory not found." });

        var summary = await _db.BloodUnits
            .Where(u => u.InventoryId == id && u.ExpiryDate > DateTime.UtcNow)
            .GroupBy(u => u.BloodType)
            .Select(g => new
            {
                BloodType = g.Key,
                TotalQuantity = g.Sum(u => u.Quantity)
            })
            .OrderBy(s => s.BloodType)
            .ToListAsync();

        return Ok(new { InventoryId = id, Summary = summary });
    }

    [HttpGet("inventories/by-bank/{bankId}")]
    public async Task<IActionResult> GetByBank(int bankId)
    {
        var inventory = await _db.inventories
            .Include(i => i.BloodBank)
            .Include(i => i.BloodUnits)
            .Where(i => i.BloodBank.UserID == bankId)
            .Select(i => new
            {
                i.InventoryId,
                BloodBank = new
                {
                    i.BloodBank.UserID,
                    i.BloodBank.BankName,
                    i.BloodBank.Location
                },
                Summary = i.BloodUnits
                    .Where(u => u.ExpiryDate > DateTime.UtcNow)
                    .GroupBy(u => u.BloodType)
                    .Select(g => new
                    {
                        BloodType = g.Key,
                        TotalQuantity = g.Sum(u => u.Quantity)
                    })
                    .OrderBy(s => s.BloodType)
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (inventory == null)
            return NotFound(new { error = "Inventory not found for this blood bank." });

        return Ok(inventory);
    }

    // POST /api/blood-units
    [HttpPost("blood-units")]
    public async Task<IActionResult> AddUnit([FromBody] CreateBloodUnitDto dto)
    {
        if (!await _db.inventories.AnyAsync(i => i.InventoryId == dto.InventoryId))
            return BadRequest(new { error = "Inventory not found." });

        if (!IsValidBloodType(dto.BloodType))
            return BadRequest(new { error = "Invalid blood type.", validValues = ValidBloodTypes });

        if (dto.ExpiryDate <= DateTime.UtcNow)
            return BadRequest(new { error = "Expiry date must be in the future." });

        if (dto.Quantity <= 0)
            return BadRequest(new { error = "Quantity must be greater than 0." });

        var unit = new BloodUnit
        {
            InventoryId = dto.InventoryId,
            BloodType = dto.BloodType,
            Quantity = dto.Quantity,
            ExpiryDate = dto.ExpiryDate
        };

        _db.BloodUnits.Add(unit);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUnit), new { id = unit.UnitId }, new
        {
            unit.UnitId,
            unit.BloodType,
            unit.Quantity,
            unit.ExpiryDate
        });
    }

    // GET /api/blood-units/{id}
    [HttpGet("blood-units/{id}")]
    public async Task<IActionResult> GetUnit(int id)
    {
        var unit = await _db.BloodUnits.FindAsync(id);
        if (unit == null)
            return NotFound(new { error = "Blood unit not found." });

        return Ok(unit);
    }

    // PUT /api/blood-units/{id}
    [HttpPut("blood-units/{id}")]
    public async Task<IActionResult> UpdateUnit(int id, [FromBody] UpdateBloodUnitDto dto)
    {
        var unit = await _db.BloodUnits.FindAsync(id);
        if (unit == null)
            return NotFound(new { error = "Blood unit not found." });

        if (dto.Quantity.HasValue)
        {
            if (dto.Quantity.Value <= 0)
                return BadRequest(new { error = "Quantity must be greater than 0." });
            unit.Quantity = dto.Quantity.Value;
        }

        if (dto.ExpiryDate.HasValue)
        {
            if (dto.ExpiryDate.Value <= DateTime.UtcNow)
                return BadRequest(new { error = "Expiry date must be in the future." });
            unit.ExpiryDate = dto.ExpiryDate.Value;
        }

        await _db.SaveChangesAsync();

        return Ok(new { unit.UnitId, unit.Quantity, unit.ExpiryDate });
    }

    // DELETE /api/blood-units/{id}
    [HttpDelete("blood-units/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUnit(int id)
    {
        var unit = await _db.BloodUnits.FindAsync(id);
        if (unit == null)
            return NotFound(new { error = "Blood unit not found." });

        _db.BloodUnits.Remove(unit);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // GET /api/blood-units/expiring
    [HttpGet("blood-units/expiring")]
    public async Task<IActionResult> GetExpiring([FromQuery] int days = 7)
    {
        var cutoff = DateTime.UtcNow.AddDays(days);

        var units = await _db.BloodUnits
            .Where(u => u.ExpiryDate <= cutoff && u.ExpiryDate > DateTime.UtcNow)
            .OrderBy(u => u.ExpiryDate)
            .Select(u => new
            {
                u.UnitId,
                u.InventoryId,  
                u.BloodType,
                u.Quantity,
                u.ExpiryDate,
                DaysLeft = (int)(u.ExpiryDate - DateTime.UtcNow).TotalDays
            })
            .ToListAsync();

        return Ok(units);
    }

    // --- Helpers ---
    private static readonly string[] ValidBloodTypes = { "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-" };
    private static bool IsValidBloodType(string bt) => ValidBloodTypes.Contains(bt);
}

public record CreateBloodUnitDto(
    int InventoryId,
    string BloodType,
    decimal Quantity,
    DateTime ExpiryDate
);

public record UpdateBloodUnitDto(
    decimal? Quantity,
    DateTime? ExpiryDate
);