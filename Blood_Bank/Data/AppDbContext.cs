namespace Blood_Bank.Data;


using System;
using System.Collections.Generic;
using System.Numerics;
using System.Reflection.Emit;
using System.Text;
using Blood_Bank.Models;
using Microsoft.EntityFrameworkCore;


    public class AppDbContext:DbContext
    {
    public DbSet<User> User { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Donor> Donors { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Reward> Rewards { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Hospital> Hospitals { get; set; }
    public DbSet<BloodRequest> BloodRequests { get; set; }
    public DbSet<SosRequest> SosRequests { get; set; }
    public DbSet<BloodBank> BloodBank { get; set; }
    public DbSet<Inventory> inventories { get; set; }
    public DbSet<BloodUnit> BloodUnits { get; set; }
    //public object Admin { get; internal set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=.;Database=BloodBank;Trusted_Connection=True;TrustServerCertificate=True;");
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserID);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Password).IsRequired().HasMaxLength(100);
            entity.Property(e => e.phone).IsRequired();
        });

        //modelBuilder.Entity<Admin>(entity =>
        //{
        //    entity.HasKey(e => e.Id);
        //});

        modelBuilder.Entity<Donor>(entity =>
        {
            //entity.HasKey(e => e.UserID);

            entity.Property(e => e.BloodType).IsRequired().HasMaxLength(3);
            entity.Property(e => e.MedicalHistory).IsRequired();
            entity.Property(e => e.LastDonationDate).IsRequired();
            entity.Property(e => e.TotalDonations).IsRequired();

        });


        modelBuilder.Entity<Reward>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Points).IsRequired();
            entity.HasOne(r => r.Donor)
               .WithOne(d => d.Reward)
               .HasForeignKey<Reward>(r => r.DonorId)
               .OnDelete(DeleteBehavior.Cascade);

        });


        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.AppointmentDate).IsRequired();
            entity.Property(e => e.Location).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Time).IsRequired();
            entity.HasOne(e => e.Donor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(e => e.DonorId)
                .OnDelete(DeleteBehavior.Cascade);
        });


        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.NotificationId);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Date).IsRequired();
            entity.HasOne(n => n.Donor)
                .WithMany(d => d.Notifications)
                .HasForeignKey(n => n.DonorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Hospital>(entity =>
        {

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(150);

            entity.Property(e => e.Address)
                .IsRequired()
                .HasMaxLength(250);


            entity.Property(e => e.phone)
                .HasMaxLength(20);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<BloodRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId);
            entity.Property(e => e.BloodType).IsRequired().HasMaxLength(5);
            entity.Property(e => e.Quantity).IsRequired();
            entity.Property(e => e.Notes)
                .HasMaxLength(500);
            entity.Property(e => e.priority)
                .IsRequired();

            entity.Property(e => e.Status)
                .IsRequired();
            entity.Property(e => e.RequestDate)
                .IsRequired();

            entity.HasOne(e => e.Hospital)
                .WithMany(h => h.BloodRequests)
                .HasForeignKey(e => e.UserID)
               .OnDelete(DeleteBehavior.NoAction);


        });


        modelBuilder.Entity<BloodBank>(entity =>
        {
            entity.Property(e => e.BankName).IsRequired().HasMaxLength(150);
            entity.Property(e => e.Location).IsRequired().HasMaxLength(250);

            entity.HasOne(b => b.Inventory)
                  .WithOne(i => i.BloodBank)
                  .HasForeignKey<BloodBank>(b => b.InventoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasKey(e => e.InventoryId);

            entity.HasMany(i => i.BloodUnits)
                  .WithOne(u => u.Inventory)
                  .HasForeignKey(u => u.InventoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BloodUnit>(entity =>
        {
            entity.HasKey(e => e.UnitId);
            entity.Property(e => e.BloodType).IsRequired().HasMaxLength(3);
            entity.Property(e => e.Quantity).IsRequired().HasColumnType("decimal(18,2)");
            entity.Property(e => e.ExpiryDate).IsRequired();
        });
        modelBuilder.Entity<SosRequest>(entity =>
        {
            entity.HasKey(e => e.SOSId);
            entity.Property(e => e.BloodType).IsRequired().HasMaxLength(5);
            entity.Property(e => e.Description)
                .HasMaxLength(500);
            entity.Property(e => e.Priority)
                .IsRequired();
            entity.Property(e => e.Units)
                .IsRequired();
            entity.Property(e => e.RequestDate)
                .IsRequired();
            entity.HasOne(e => e.Hospital)
                .WithMany(h => h.SosRequests)
                .HasForeignKey(e => e.HospitalId)
                .OnDelete(DeleteBehavior.Cascade);

        });
    }
}

