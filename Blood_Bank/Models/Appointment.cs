namespace Blood_Bank.Models
{
    public class Appointment
    {
        public int Id { get; set; }
       
        public DateTime AppointmentDate { get; set; }
        public string ?Location { get; set; }
        public string CenterName { get; set; } = string.Empty;
        public string CenterAddress { get; set; } = string.Empty;

        public string TimeSlot { get; set; } = string.Empty;

        public DateTime Time { get; set; }
        public Donor ?Donor { get; set; }
        public int DonorId { get; set; }
        public string Status { get; set; } = "Confirmed";
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
