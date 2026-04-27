namespace Blood_Bank.Models
{
    public class Hospital : User
    {

        public string? HospitalName { get; set; }
        public string? address { get; set; }
        public List<BloodRequest>? BloodRequests { get; set; }

    }
}
