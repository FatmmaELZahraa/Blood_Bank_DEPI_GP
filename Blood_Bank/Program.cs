//using Blood_Bank.Data;
//using Microsoft.EntityFrameworkCore;
//var builder = WebApplication.CreateBuilder(args);


//// Add services to the container.

//builder.Services.AddControllers();
//// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.MapOpenApi();
//}

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();

using Blood_Bank.Data;
using Blood_Bank.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJS",
        policy => policy.WithOrigins("http://localhost:3000") 
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
builder.Services.AddScoped<IEmailService, EmailService>();
var app = builder.Build();

// 4. إعداد Pipeline التشغيل
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseCors("AllowNextJS"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => "Blood Bank API is running!");

app.Run();