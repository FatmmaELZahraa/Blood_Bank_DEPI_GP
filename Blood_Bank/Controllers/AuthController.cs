using Blood_Bank.Data;
using Blood_Bank.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Blood_Bank.DTO.Authenticationdto;
using Microsoft.EntityFrameworkCore;

namespace Blood_Bank.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
        {
            if (await _context.User.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email Already Exists Please Login");

            User newUser;

            if (dto.Role.ToLower() == "admin")
            {
                newUser = new Admin { Name = dto.Name, Email = dto.Email, Password = dto.Password, phone = dto.Phone };
                _context.Admin.Add((Admin)newUser);
            }
            else
            {
                newUser = new Donor
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = dto.Password,
                    phone = dto.Phone,
                 
                };
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
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);

            if (user == null) return Unauthorized("Invalid login credentials.");

            string role = user is Admin ? "Admin" : "Donor";

            return Ok(new AuthResponseDto
            {
                Name = user.Name,
                Role = role,
                Token = GenerateJwtToken(user, role)
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logged out successfully" });
        }
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
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
