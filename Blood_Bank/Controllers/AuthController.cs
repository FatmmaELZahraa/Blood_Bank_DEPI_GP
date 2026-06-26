using BCrypt.Net;
using Blood_Bank.Data;
using Blood_Bank.Models;
using Blood_Bank.Services;
using Blood_Bank.DTO; 
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using static Blood_Bank.DTO.Authenticationdto;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthController(AppDbContext context, IConfiguration config, IEmailService emailService)
        {
            _context = context;
            _config = config;
            _emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return BadRequest("If that email exists in our system, a reset link has been sent.");

            user.PasswordResetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
            user.ResetTokenExpires = DateTime.Now.AddHours(1);

            await _context.SaveChangesAsync();

            var resetLink = $"http://localhost:3000/reset-password?token={user.PasswordResetToken}";
            string emailBody = $@"
                <div style='font-family: sans-serif; border: 1px solid #eee; padding: 20px; text-align: center;'>
                    <h2 style='color: #e11d48;'>BloodLink Password Reset</h2>
                    <p>You requested a password reset. Click the button below to set a new password:</p>
                    <a href='{resetLink}' style='background: #e11d48; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;'>Reset Password</a>
                    <p style='font-size: 0.8em; color: #666;'>This link expires in 1 hour.</p>
                </div>";

            await _emailService.SendEmailAsync(user.Email??" ", "Reset Your Password", emailBody);

            return Ok(new { message = "Reset link sent to your email." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _context.User.FirstOrDefaultAsync(u =>
                u.PasswordResetToken == dto.Token && u.ResetTokenExpires > DateTime.Now);

            if (user == null) return BadRequest("Invalid or expired token.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Password updated successfully." });
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult> GetProfile()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return NotFound("User not found");

            if (user is Donor donor)
            {
                return Ok(new
                {
                    name = donor.Name,
                    email = donor.Email,
                    phone = donor.phone,
                    role = "Donor",
                    totalDonations = donor.TotalDonations,
                    bloodType = donor.BloodType,
                    lastDonationDate = donor.LastDonationDate,
                    points = donor.Points,
                    medicalHistory = donor.MedicalHistory,
                    isProfileCompleted = !string.IsNullOrEmpty(donor.BloodType) && donor.BloodType != "N/A"
                });
            }

            if (user is Hospital hospital)
            {
                return Ok(new
                {
                    name = hospital.Name,
                    email = hospital.Email,
                    phone = hospital.phone,
                    role = "Hospital"
                });
            }

            return Ok(new { name = user.Name, email = user.Email, phone = user.phone, role = "Admin" });
        }

        // GET /api/Auth/hospitals-count
        [HttpGet("hospitals-count")]
        [Authorize]
        public async Task<IActionResult> GetHospitalsCount()
        {
            var count = await _context.Hospitals.CountAsync();
            return Ok(new { count });
        }

        // GET /api/admin/hospitals
        [HttpGet("/api/admin/hospitals")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetHospitals()
        {
            var hospitals = await _context.Hospitals
                .Select(h => new
                {
                    id            = h.UserID,
                    name          = h.Name,
                    email         = h.Email,
                    phone         = h.phone,
                    address       = h.Address,
                    totalCapacity = h.TotalCapacity,
                    currentUnits  = h.CurrentUnits,
                    isVerified    = h.IsVerified,
                    createdAt     = h.CreatedAt
                })
                .ToListAsync();

            return Ok(hospitals);
        }
        // GET /api/bloodbank/hospitals
[HttpGet("/api/bloodbank/hospitals")]
[Authorize(Roles = "BloodBank")]
public async Task<IActionResult> GetHospitalsForBloodBank()
{
    var hospitals = await _context.Hospitals
        .Select(h => new
        {
            id      = h.UserID,
            name    = h.Name,
            phone   = h.phone,
            address = h.Address,
            currentUnits  = h.CurrentUnits,
            totalCapacity = h.TotalCapacity,
        })
        .ToListAsync();

    return Ok(hospitals);
}

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _context.User.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email Already Exists Please Login");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            string verificationToken = Convert.ToHexString(System.Security.Cryptography.RandomNumberGenerator.GetBytes(64));
            DateTime tokenExpires = DateTime.UtcNow.AddHours(24);

            User newUser;
            if (dto.Role.ToLower() == "bloodbank" || dto.Role.ToLower() == "blood_bank")
            {
                var targetInventory = new Inventory();
                _context.inventories.Add(targetInventory);
                await _context.SaveChangesAsync();

                newUser = new BloodBank
                {
                    Name = dto.Name,
                    BankName = dto.Name,
                    Email = dto.Email,
                    Password = hashedPassword,
                    phone = dto.Phone,
                    Location = "Not Specified Yet",
                    InventoryId = targetInventory.InventoryId,
                    IsVerified = false,
                    VerificationToken = verificationToken,
                    VerificationTokenExpires = tokenExpires
                };
                _context.BloodBank.Add((BloodBank)newUser);
            }
            else if (dto.Role.ToLower() == "hospital")
            {
                newUser = new Hospital
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = hashedPassword,
                    phone = dto.Phone,
                    IsVerified = false,
                    VerificationToken = verificationToken,
                    VerificationTokenExpires = tokenExpires
                };
                _context.Hospitals.Add((Hospital)newUser);
            }
            else
            {
                newUser = new Donor
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = hashedPassword,
                    phone = dto.Phone,
                    IsVerified = false,
                    VerificationToken = verificationToken,
                    VerificationTokenExpires = tokenExpires
                };
                _context.Donors.Add((Donor)newUser);
            }

            await _context.SaveChangesAsync();

            string confirmationLink = $"http://localhost:3000/verify-email?token={verificationToken}";

            string emailBody = $@"
    <div style='font-family: sans-serif; border: 1px solid #eee; padding: 20px; text-align: center; max-width: 500px; margin: 0 auto; border-radius: 10px;'>
        <h2 style='color: #c20000;'>Welcome to BloodLink!</h2>
        <p style='color: #333; font-size: 1.1em;'>Thank you for registering. Please confirm your email address to activate your account:</p>
        
        <a href='{confirmationLink}' style='background: #c20000; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; font-weight: bold;'>
            Verify Account
        </a>
        
        <p style='font-size: 0.85em; color: #666;'>This link will expire in 24 hours.</p>
        <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;' />
        <p style='font-size: 0.8em; color: #999;'>If you didn't create an account, you can safely ignore this email.</p>
    </div>";

            await _emailService.SendEmailAsync(newUser.Email, "Confirm your email - BloodLink", emailBody);

            return Ok(new
            {
                Message = "Registration successful! Please check your email to verify your account.",
                UserId = newUser.UserID,
                Email = newUser.Email
            });
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
                return BadRequest("Token is required.");

            var user = await _context.User.FirstOrDefaultAsync(u => u.VerificationToken == token);

            if (user == null)
                return BadRequest("Invalid verification token.");

            user.IsVerified = true;
            user.VerificationToken = null;
            user.VerificationTokenExpires = null;

            await _context.SaveChangesAsync();

            return Ok("Email verified successfully.");
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDto dto)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid login credentials.");

            string role = user is Admin ? "Admin" : user is BloodBank ? "BloodBank" : user is Hospital ? "Hospital" : "Donor";

            return Ok(new
            {
                name   = user.Name,
                role   = role,
                userId = user.UserID,
                token  = GenerateJwtToken(user, role)
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout() => Ok(new { message = "Logged out successfully" });

        private string GenerateJwtToken(User user, string role)
        {
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Email, user.Email?? " "),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]?? " "));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}