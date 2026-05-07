using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blood_Bank.Migrations
{
    /// <inheritdoc />
    public partial class Resetpassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordResetToken",
                table: "User",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ResetTokenExpires",
                table: "User",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordResetToken",
                table: "User");

            migrationBuilder.DropColumn(
                name: "ResetTokenExpires",
                table: "User");
        }
    }
}
