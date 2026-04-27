namespace Blood_Bank.Models
{
    public class BloodUnit
    {
       
        public int UnitId { get; set; }
        public string? BloodType { get; set; }
        public decimal Quantity { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int InventoryId { get; set; }
        public Inventory? inventory { get; set; }

    }
}