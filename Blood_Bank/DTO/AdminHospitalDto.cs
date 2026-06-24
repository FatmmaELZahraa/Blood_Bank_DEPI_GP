namespace Blood_Bank.DTO
{
    public class AdminHospitalDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int TotalCapacity { get; set; }
        public int CurrentUnits { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
