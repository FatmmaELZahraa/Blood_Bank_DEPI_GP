namespace Blood_Bank.DTO
{
    public class AdminSettingsDto
    {
        public string SiteName { get; set; } = string.Empty;
        public string SiteEmail { get; set; } = string.Empty;

        public bool SosNotifications { get; set; }
        public bool LowStockAlerts { get; set; }
        public bool NewDonorNotifications { get; set; }
        public bool WeeklyReports { get; set; }

        public int CriticalThreshold { get; set; }
        public int LowThreshold { get; set; }
        public int DonationCooldown { get; set; }

        public bool MaintenanceMode { get; set; }

        public string Timezone { get; set; } = string.Empty;
    }
}