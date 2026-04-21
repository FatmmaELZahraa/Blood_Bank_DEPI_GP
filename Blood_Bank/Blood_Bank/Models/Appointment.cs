namespace Blood_Bank.Models
{
    public class Appointment
    {
        public int Id { get; set; }
       
        public DateTime AppointmentDate { get; set; }
        public string ?Location { get; set; }

        public DateTime Time { get; set; }
        public Donor ?Donor { get; set; }
        public int DonorId { get; set; }
    }
}
