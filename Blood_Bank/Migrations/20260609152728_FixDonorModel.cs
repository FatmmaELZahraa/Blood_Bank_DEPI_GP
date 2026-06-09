using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blood_Bank.Migrations
{
    /// <inheritdoc />
    public partial class FixDonorModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsTopDonor",
                table: "User",
                type: "bit",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsTopDonor",
                table: "User");
        }
    }
}
