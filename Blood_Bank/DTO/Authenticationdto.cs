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
            public string Role { get; set; } // "Admin" أو "Donor"

            //// حقول اختيارية للمتبرع بناءً على مخطط الفئات (Class Diagram)
            //public string? BloodType { get; set; }
            //public string? MedicalHistory { get; set; }
        }
        public class LoginDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
        public class AuthResponseDto
        {
            public string Name { get; set; }
            public string Token { get; set; }
            public string Role { get; set; }
        }
    }
}
