namespace Blood_Bank.Models;

public class Notification
{
    public int NotificationId { get; set; }
    public string? Message { get; set; }
    public DateTime Date { get; set; }

    public int DonorId { get; set; }
    public Donor? Donor { get; set; }
}
