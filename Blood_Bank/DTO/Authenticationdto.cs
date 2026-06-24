namespace Blood_Bank.DTO
{
    public class Authenticationdto
    {
        public class RegisterDto
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public int Phone { get; set; }
            public string Role { get; set; } 
        }
        public class LoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class AuthResponseDto
        {
            public int UserId { get; set; }
            public string Name { get; set; }
            public string Token { get; set; }
            public string Role { get; set; }
        }
    }
}
