namespace Blood_Bank.Models
{
    public class BloodRequest
    {
        public int RequestId { get; set; }
        public string? BloodType { get; set; }
        public decimal Quantity { get; set; }
        public string? Status { get; set; }
        public DateTime RequestDate { get; set; }

        public ICollection<Hospital>? Hospital { get; set; }
        public ICollection<BloodBank>? BloodBank { get; set; }
       
    }
}