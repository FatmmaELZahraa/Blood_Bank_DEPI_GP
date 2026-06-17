namespace Blood_Bank.DTO
{
    public class CompleteProfileDto
    {
        public string? BloodType { get; set; }
        public string? MedicalHistory { get; set; }
        public DateTime LastDonationDate { get; set; }
        public int Age { get; set; }
        public double DistanceKM { get; set; }
        public int LastDonationDays { get; set; }
        public double HistoricalResponseRate { get; set; } = 1.0; 
        public double BloodQualityScore { get; set; } = 10.0;     
    }
}