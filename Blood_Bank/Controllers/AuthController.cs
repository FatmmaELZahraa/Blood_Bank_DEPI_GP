//using BCrypt.Net;
//using Blood_Bank.Data;
//using Blood_Bank.Models;
//using Blood_Bank.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Security.Cryptography;
//using System.Text;
//using static Blood_Bank.DTO.Authenticationdto;
//using static Blood_Bank.DTO.ForgotPasswordDto;
//using static Blood_Bank.DTO.ResetPasswordDto;

//namespace Blood_Bank.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly AppDbContext _context;
//        private readonly IConfiguration _config;
//        private readonly IEmailService _emailService;
//        public AuthController(AppDbContext context, IConfiguration config, IEmailService emailService)
//        {
//            _context = context;
//            _config = config;
//            _emailService = emailService;
//        }

//        [HttpPost("forgot-password")]
//        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
//        {
//            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email);
//            if (user == null) return BadRequest("If that email exists in our system, a reset link has been sent.");

//            // 1. Generate Secure Token
//            user.PasswordResetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
//            user.ResetTokenExpires = DateTime.Now.AddHours(1);

//            await _context.SaveChangesAsync();

//            // 2. Prepare Email
//            var resetLink = $"http://localhost:3000/reset-password?token={user.PasswordResetToken}";
//            string emailBody = $@"
//        <div style='font-family: sans-serif; border: 1px solid #eee; padding: 20px;'>
//            <h2 style='color: #e11d48;'>BloodLink Password Reset</h2>
//            <p>You requested a password reset. Click the button below to set a new password:</p>
//            <a href='{resetLink}' style='background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a>
//            <p style='margin-top: 20px; font-size: 0.8em; color: #666;'>This link expires in 1 hour.</p>
//        </div>";

//            await _emailService.SendEmailAsync(user.Email, "Reset Your Password", emailBody);

//            return Ok(new { message = "Reset link sent to your email." });
//        }
//        [HttpGet("profile")]
//        [Authorize]
//        public async Task<ActionResult> GetProfile()
//        {
//            var email = User.FindFirstValue(ClaimTypes.Email);

//            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);

//            if (user == null) return NotFound("User not found");

//            if (user is Donor donor)
//            {
//                return Ok(new
//                {


//                    name = donor.Name,
//                    email = donor.Email,
//                    phone = donor.phone,
//                    role = "Donor",
//                    totalDonations = donor.TotalDonations,
//                    bloodType = donor.BloodType,
//                    lastDonationDate = donor.LastDonationDate,
//                    points = donor.Points,
//                    medicalHistory= donor.MedicalHistory
//                });
//            }

//            return Ok(new
//            {
//                name = user.Name,
//                email = user.Email,
//                phone = user.phone,
//                role = "Admin"
//            });
//        }
//        public AuthController(AppDbContext context, IConfiguration config)
//        {
//            _context = context;
//            _config = config;
//        }
//        [HttpPost("register")]
//        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
//        {
//            if (await _context.User.AnyAsync(u => u.Email == dto.Email))
//                return BadRequest("Email Already Exists Please Login");

//            User newUser;

//            if (dto.Role.ToLower() == "admin")
//            {
//                newUser = new Admin { Name = dto.Name, Email = dto.Email, Password = dto.Password, phone = dto.Phone };
//                _context.Admin.Add((Admin)newUser);
//            }
//            else
//            {
//                newUser = new Donor
//                {
//                    Name = dto.Name,
//                    Email = dto.Email,
//                    Password = dto.Password,
//                    phone = dto.Phone,

//                };
//                _context.Donors.Add((Donor)newUser);
//            }

//            await _context.SaveChangesAsync();
//            return Ok(new AuthResponseDto
//            {
//                Name = newUser.Name,
//                Role = dto.Role,
//                Token = GenerateJwtToken(newUser, dto.Role)
//            });
//        }

//        [HttpPost("login")]
//        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
//        {
//            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);

//            if (user == null) return Unauthorized("Invalid login credentials.");

//            string role = user is Admin ? "Admin" : "Donor";

//            return Ok(new AuthResponseDto
//            {
//                Name = user.Name,
//                Role = role,
//                Token = GenerateJwtToken(user, role)
//            });
//        }

//        [HttpPost("logout")]
//        public IActionResult Logout()
//        {
//            return Ok(new { message = "Logged out successfully" });
//        }

//        private string GenerateJwtToken(User user, string role)
//        {
//            var claims = new[] {
//        new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
//        new Claim(ClaimTypes.Email, user.Email),
//        new Claim(ClaimTypes.Role, role)
//    };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: _config["Jwt:Issuer"],
//                audience: _config["Jwt:Audience"], 
//                claims: claims,
//                expires: DateTime.Now.AddDays(7),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}

using BCrypt.Net;
using Blood_Bank.Data;
using Blood_Bank.Models;
using Blood_Bank.Services;
using Blood_Bank.DTO; // تأكدي من أن الـ DTOs موجودة هنا
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

        // تم دمج الـ Constructor ليكون واحداً فقط (ضروري جداً لعمل الـ API)
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

            // 1. إنشاء توكن آمن
            user.PasswordResetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
            user.ResetTokenExpires = DateTime.Now.AddHours(1);

            await _context.SaveChangesAsync();

            // 2. تجهيز وإرسال البريد
            var resetLink = $"http://localhost:3000/reset-password?token={user.PasswordResetToken}";
            string emailBody = $@"
                <div style='font-family: sans-serif; border: 1px solid #eee; padding: 20px; text-align: center;'>
                    <h2 style='color: #e11d48;'>BloodLink Password Reset</h2>
                    <p>You requested a password reset. Click the button below to set a new password:</p>
                    <a href='{resetLink}' style='background: #e11d48; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;'>Reset Password</a>
                    <p style='font-size: 0.8em; color: #666;'>This link expires in 1 hour.</p>
                </div>";

            await _emailService.SendEmailAsync(user.Email, "Reset Your Password", emailBody);

            return Ok(new { message = "Reset link sent to your email." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _context.User.FirstOrDefaultAsync(u =>
                u.PasswordResetToken == dto.Token && u.ResetTokenExpires > DateTime.Now);

            if (user == null) return BadRequest("Invalid or expired token.");

            // 3. تشفير كلمة المرور الجديدة باستخدام BCrypt
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
                    medicalHistory = donor.MedicalHistory
                });
            }

            return Ok(new { name = user.Name, email = user.Email, phone = user.phone, role = "Admin" });
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _context.User.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email Already Exists Please Login");

            // تشفير كلمة المرور عند التسجيل لضمان الأمان
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            User newUser;
            if (dto.Role.ToLower() == "admin")
            {
                newUser = new Admin { Name = dto.Name, Email = dto.Email, Password = hashedPassword, phone = dto.Phone };
                _context.Admin.Add((Admin)newUser);
            }
            else
            {
                newUser = new Donor { Name = dto.Name, Email = dto.Email, Password = hashedPassword, phone = dto.Phone };
                _context.Donors.Add((Donor)newUser);
            }

            await _context.SaveChangesAsync();
            return Ok(new AuthResponseDto
            {
                Name = newUser.Name,
                Role = dto.Role,
                Token = GenerateJwtToken(newUser, dto.Role)
            });
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
        {
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email);

            // التحقق من كلمة المرور المشفرة (BCrypt)
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                return Unauthorized("Invalid login credentials.");

            string role = user is Admin ? "Admin" : "Donor";

            return Ok(new AuthResponseDto
            {
                Name = user.Name,
                Role = role,
                Token = GenerateJwtToken(user, role)
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout() => Ok(new { message = "Logged out successfully" });

        private string GenerateJwtToken(User user, string role)
        {
            var claims = new[] {
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
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
