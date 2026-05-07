using MimeKit;
using MailKit.Net.Smtp;

namespace Blood_Bank.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            // Get sender details from appsettings.json
            email.From.Add(new MailboxAddress(
                _config["EmailSettings:SenderName"],
                _config["EmailSettings:SenderEmail"]
            ));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = body };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(
                    _config["EmailSettings:SmtpServer"],
                    int.Parse(_config["EmailSettings:SmtpPort"]),
                    MailKit.Security.SecureSocketOptions.StartTls
                );

                await smtp.AuthenticateAsync(
                    _config["EmailSettings:SenderEmail"],
                    _config["EmailSettings:Password"]
                );

                await smtp.SendAsync(email);
            }
            finally
            {
                await smtp.DisconnectAsync(true);
            }
        }
    
}
}
