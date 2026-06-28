using System.Numerics;

namespace Blood_Bank.Models
{
    public class BloodRequest
    {
        public int RequestId { get; set; }
        public int UserID { get; set; }
        public Hospital? Hospital { get; set; }
        public string? BloodType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public string? Notes { get; set; }
        public string? patientName { get; set; }
        public string? DoctorName { get; set; }
        public string? Department { get; set; }
        public string? priority { get; set; }

        public String? Status { get; set; }
        public ICollection<BloodBank>? BloodBank { get; set; }
       
    }
    
}