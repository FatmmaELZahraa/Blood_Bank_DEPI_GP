using Blood_Bank.Data;
using Blood_Bank.DTO;
using Blood_Bank.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EditProfileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EditProfileController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/edit-profile
        // Get current logged-in user's profile data
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var email = User.FindFirstValue(ClaimTypes.Email);

                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "User email not found in token" });

                var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                // Return profile based on user type
                if (user is Donor donor)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Profile retrieved successfully",
                        data = new
                        {
                            userId = donor.UserID,
                            name = donor.Name,
                            email = donor.Email,
                            phone = donor.phone,
                            bloodType = donor.BloodType,
                            city = "", // City not in Donor model, can be added
                            medicalHistory = donor.MedicalHistory,
                            role = "Donor"
                        }
                    });
                }
                else if (user is Hospital hospital)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Profile retrieved successfully",
                        data = new
                        {
                            userId = hospital.UserID,
                            name = hospital.Name,
                            email = hospital.Email,
                            phone = hospital.phone,
                            address = hospital.Address,
                            role = "Hospital"
                        }
                    });
                }
                else if (user is Admin admin)
                {
                    return Ok(new
                    {
                        success = true,
                        message = "Profile retrieved successfully",
                        data = new
                        {
                            userId = admin.UserID,
                            name = admin.Name,
                            email = admin.Email,
                            phone = admin.phone,
                            role = "Admin"
                        }
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Profile retrieved successfully",
                    data = new
                    {
                        userId = user.UserID,
                        name = user.Name,
                        email = user.Email,
                        phone = user.phone,
                        role = "User"
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // PUT /api/edit-profile
        // Update user profile (name, phone, email, blood type, city, medical history, address)
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] EditProfileDto dto)
        {
            try
            {
                var email = User.FindFirstValue(ClaimTypes.Email);

                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "User email not found in token" });

                var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                // Update common fields (only if provided, not null)
                if (!string.IsNullOrEmpty(dto.Name))
                    user.Name = dto.Name;

                if (!string.IsNullOrEmpty(dto.Phone))
                    user.phone = int.Parse(dto.Phone);

                if (!string.IsNullOrEmpty(dto.Email) && dto.Email != user.Email)
                {
                    // Check if email already exists
                    var existingUser = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email);
                    if (existingUser != null)
                        return BadRequest(new { success = false, message = "Email already in use" });

                    user.Email = dto.Email;
                }

                // Update password if provided
                if (!string.IsNullOrEmpty(dto.Password))
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
                }

                // Update donor-specific fields
                if (user is Donor donor)
                {
                    if (!string.IsNullOrEmpty(dto.BloodType))
                        donor.BloodType = dto.BloodType;

                    if (!string.IsNullOrEmpty(dto.City))
                    {
                        // Note: City is not in Donor model, can be added as property if needed
                        // For now, we'll add it to MedicalHistory context or create a new property
                    }

                    if (!string.IsNullOrEmpty(dto.MedicalHistory))
                        donor.MedicalHistory = dto.MedicalHistory;
                }

                // Update hospital-specific fields
                if (user is Hospital hospital)
                {
                    if (!string.IsNullOrEmpty(dto.Address))
                        hospital.Address = dto.Address;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Profile updated successfully",
                    data = new { userId = user.UserID }
                });
            }
            catch (FormatException)
            {
                return BadRequest(new { success = false, message = "Invalid phone number format" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // PUT /api/edit-profile/password
        // Update password only (with validation)
        [HttpPut("password")]
        public async Task<IActionResult> UpdatePassword([FromBody] dynamic request)
        {
            try
            {
                var email = User.FindFirstValue(ClaimTypes.Email);

                if (string.IsNullOrEmpty(email))
                    return Unauthorized(new { success = false, message = "User email not found in token" });

                var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

                if (user == null)
                    return NotFound(new { success = false, message = "User not found" });

                // Get current and new password from request
                string currentPassword = request?.currentPassword??" ";
                string newPassword = request?.newPassword??" ";
                string confirmPassword = request?.confirmPassword??" ";

                if (string.IsNullOrEmpty(currentPassword) || string.IsNullOrEmpty(newPassword))
                    return BadRequest(new { success = false, message = "Current password and new password are required" });

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.Password))
                    return BadRequest(new { success = false, message = "Current password is incorrect" });

                // Check if passwords match
                if (newPassword != confirmPassword)
                    return BadRequest(new { success = false, message = "New passwords do not match" });

                // Update password
                user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Password updated successfully",
                    data = new { userId = user.UserID }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
