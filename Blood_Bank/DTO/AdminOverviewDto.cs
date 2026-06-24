namespace Blood_Bank.DTO
{
    public class AdminOverviewDto
    {
        public int TotalDonors { get; set; }
        public int TotalHospitals { get; set; }
        public decimal TotalBloodUnits { get; set; }
        public int ActiveSOS { get; set; }
        public List<RecentActivityDto> RecentActivity { get; set; } = new();
    }

    public class RecentActivityDto
    {
        public string Description { get; set; } = string.Empty;
        public DateTime Time { get; set; }
    }
}
