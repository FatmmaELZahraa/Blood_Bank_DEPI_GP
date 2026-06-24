namespace Blood_Bank.Models
{
    public class SosRequest
    {
        public int SOSId { get; set; }
        public int HospitalId { get; set; }
        public Hospital Hospital { get; set; }
        public string? BloodType { get; set; }

        public int? Units { get; set; }

        public string Priority { get; set; }

        public string? Description { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        public string Status { get; set; } = "Pending";

    }
}