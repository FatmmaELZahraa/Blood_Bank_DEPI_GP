namespace Blood_Bank.Models
{ 
    public class BloodBank : User
    {

        public string? BankName { get; set; }    
        public string? Location { get; set; }

        public int InventoryId { get; set; }
        public Inventory? Inventory { get; set; }

        public ICollection<BloodRequest>? BloodRequests { get; set; }
        public ICollection<Notification>? notfications { get; set; }


    }
}