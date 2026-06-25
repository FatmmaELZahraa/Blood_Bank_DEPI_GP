namespace Blood_Bank.DTO
{
    public class ReportFilterDto
    {
        public string TimeRange { get; set; } = string.Empty;
    }

    public class AdminReportsResponseDto
    {
        public MainStatsDto KeyMetrics { get; set; } = new();

        public List<MonthlyDonationDto> MonthlyDonations { get; set; } = new();

        public List<BloodTypeUsageDto> BloodTypeSupplyDemand { get; set; } = new();

        public List<RegionalPerformanceDto> RegionalDistribution { get; set; } = new();
    }

    public class MainStatsDto
    {
        public int TotalDonations { get; set; }
        public int NewDonors { get; set; }
    }

    public class MonthlyDonationDto
    {
        public string Month { get; set; } = string.Empty;
        public int Donations { get; set; }
        public int Target { get; set; }
    }

    public class BloodTypeUsageDto
    {
        public string Type { get; set; } = string.Empty;
        public int Donated { get; set; }
        public int Used { get; set; }
    }

    public class RegionalPerformanceDto
    {
        public string Region { get; set; } = string.Empty;
        public int Value { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}