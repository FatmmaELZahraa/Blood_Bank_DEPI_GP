namespace Blood_Bank.Models
{

    public class Reward
    {
        public int Id { get; set; }
        public int Points { get; set; }


        public int DonorId { get; set; }
        public Donor? Donor { get; set; }

    }
}