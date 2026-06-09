namespace Blood_Bank.DTO
{
    public class EditProfileDto
    {
        // بيانات أساسية
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        // اختياري
        public string? Email { get; set; }

        // اختياري لو المستخدم هيغير الباسورد
        public string? Password { get; set; }

        // Donor
        public string? BloodType { get; set; }
        public string? City { get; set; }
        public string? MedicalHistory { get; set; }

        // Hospital
        public string? Address { get; set; }
    }
}