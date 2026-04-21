namespace Blood_Bank.Models
{
    public class User
    {
        
        public int UserID { get; set; }
        public string ?Name { get; set; }
        public string ?Email { get; set; }
        public string ?Password { get; set; }
        public int ?phone { get; set; }

    }

    public class  Admin:User
    {
        
    }
}
