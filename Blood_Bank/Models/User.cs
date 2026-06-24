namespace Blood_Bank.Models
{
    public class User
    {
        
        public int UserID { get; set; }
        public string ?Name { get; set; }
        public string ?Email { get; set; }
        public string ?Password { get; set; }
        public int ?phone { get; set; }

        public string? PasswordResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }


        public bool IsVerified { get; set; } = false; 
        public string? VerificationToken { get; set; } 
        public DateTime? VerificationTokenExpires { get; set; }

    }
}
