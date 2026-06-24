namespace Blood_Bank.DTO
{
    public class AdminDonorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string BloodType { get; set; } = string.Empty;
        public int TotalDonations { get; set; }
        public int Points { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? LastDonationDate { get; set; }
    }

    public class UpdateDonorStatusDto
    {
        public bool IsTopDonor { get; set; }
    }
}
