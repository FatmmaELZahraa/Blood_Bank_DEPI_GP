namespace Blood_Bank.Models
{
    public class Hospital : User
    {

        public string? Address { get; set; }

        public int TotalCapacity { get; set; }

        public int CurrentUnits { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public List<BloodRequest>? BloodRequests { get; set; }

        public List<SosRequest>? SOSRequests { get; set; }

        public List<Notification>? Notifications { get; set; }

        public List<BloodUnit>? BloodUnits { get; set; }
        public List<SosRequest>? SosRequests { get; set; }
    }
}