namespace Blood_Bank.Models
{
    public class Donor : User
    {
        public string ?BloodType { get; set; }
        public string ? MedicalHistory { get; set; } 
        public DateTime LastDonationDate { get; set; }
        public int TotalDonations { get; set; }
        public int Points { get; set; }
        public Reward? Reward { get; set; }
        public ICollection<Appointment> ?Appointments { get; set; }  
        public ICollection<Notification> ?Notifications { get; set; }

        

    }
}
