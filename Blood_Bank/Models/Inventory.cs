namespace Blood_Bank.Models
{
    public class Inventory
    {
        
        public int InventoryId { get; set; }
        public int BankId { get; set; }
        public BloodBank? BloodBank { get; set; }
        public List<BloodUnit>? bloodUnits { get; set; }

    }

}