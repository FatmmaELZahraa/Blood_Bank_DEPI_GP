namespace Blood_Bank.Models
{
    public class Inventory
    {
        
        public int InventoryId { get; set; }

        public BloodStatus Status { get; set; }

        public int BankId { get; set; }
        public BloodBank? BloodBank { get; set; }
        public List<BloodUnit>? BloodUnits { get; set; }

    }
    public enum BloodStatus
    {
        Available,
        Low,
        Reserved,
        Expired,
        Used
    }
}