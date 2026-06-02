using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blood_Bank.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BloodRequests_Hospitals_HospitalId",
                table: "BloodRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_BloodUnits_Hospitals_HospitalId",
                table: "BloodUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Hospitals_HospitalId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_SosRequests_Hospitals_HospitalId",
                table: "SosRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_SosRequests_Hospitals_HospitalId1",
                table: "SosRequests");

            migrationBuilder.DropTable(
                name: "Hospitals");

            migrationBuilder.RenameColumn(
                name: "HospitalId1",
                table: "SosRequests",
                newName: "HospitalUserID");

            migrationBuilder.RenameIndex(
                name: "IX_SosRequests_HospitalId1",
                table: "SosRequests",
                newName: "IX_SosRequests_HospitalUserID");

            migrationBuilder.RenameColumn(
                name: "HospitalId",
                table: "Notifications",
                newName: "HospitalUserID");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_HospitalId",
                table: "Notifications",
                newName: "IX_Notifications_HospitalUserID");

            migrationBuilder.RenameColumn(
                name: "HospitalId",
                table: "BloodUnits",
                newName: "HospitalUserID");

            migrationBuilder.RenameIndex(
                name: "IX_BloodUnits_HospitalId",
                table: "BloodUnits",
                newName: "IX_BloodUnits_HospitalUserID");

            migrationBuilder.RenameColumn(
                name: "HospitalId",
                table: "BloodRequests",
                newName: "UserID");

            migrationBuilder.RenameIndex(
                name: "IX_BloodRequests_HospitalId",
                table: "BloodRequests",
                newName: "IX_BloodRequests_UserID");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "User",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "User",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "User",
                type: "datetime2",
                nullable: true,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<int>(
                name: "CurrentUnits",
                table: "User",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TotalCapacity",
                table: "User",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Priority",
                table: "SosRequests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_BloodRequests_User_UserID",
                table: "BloodRequests",
                column: "UserID",
                principalTable: "User",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_BloodUnits_User_HospitalUserID",
                table: "BloodUnits",
                column: "HospitalUserID",
                principalTable: "User",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_User_HospitalUserID",
                table: "Notifications",
                column: "HospitalUserID",
                principalTable: "User",
                principalColumn: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_SosRequests_User_HospitalId",
                table: "SosRequests",
                column: "HospitalId",
                principalTable: "User",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SosRequests_User_HospitalUserID",
                table: "SosRequests",
                column: "HospitalUserID",
                principalTable: "User",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BloodRequests_User_UserID",
                table: "BloodRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_BloodUnits_User_HospitalUserID",
                table: "BloodUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_User_HospitalUserID",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_SosRequests_User_HospitalId",
                table: "SosRequests");

            migrationBuilder.DropForeignKey(
                name: "FK_SosRequests_User_HospitalUserID",
                table: "SosRequests");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "User");

            migrationBuilder.DropColumn(
                name: "CurrentUnits",
                table: "User");

            migrationBuilder.DropColumn(
                name: "TotalCapacity",
                table: "User");

            migrationBuilder.RenameColumn(
                name: "HospitalUserID",
                table: "SosRequests",
                newName: "HospitalId1");

            migrationBuilder.RenameIndex(
                name: "IX_SosRequests_HospitalUserID",
                table: "SosRequests",
                newName: "IX_SosRequests_HospitalId1");

            migrationBuilder.RenameColumn(
                name: "HospitalUserID",
                table: "Notifications",
                newName: "HospitalId");

            migrationBuilder.RenameIndex(
                name: "IX_Notifications_HospitalUserID",
                table: "Notifications",
                newName: "IX_Notifications_HospitalId");

            migrationBuilder.RenameColumn(
                name: "HospitalUserID",
                table: "BloodUnits",
                newName: "HospitalId");

            migrationBuilder.RenameIndex(
                name: "IX_BloodUnits_HospitalUserID",
                table: "BloodUnits",
                newName: "IX_BloodUnits_HospitalId");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "BloodRequests",
                newName: "HospitalId");

            migrationBuilder.RenameIndex(
                name: "IX_BloodRequests_UserID",
                table: "BloodRequests",
                newName: "IX_BloodRequests_HospitalId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "User",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(150)",
                oldMaxLength: 150);

            migrationBuilder.AlterColumn<int>(
                name: "Priority",
                table: "SosRequests",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Hospitals",
                columns: table => new
                {
                    HospitalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    CurrentUnits = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HospitalName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TotalCapacity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospitals", x => x.HospitalId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_BloodRequests_Hospitals_HospitalId",
                table: "BloodRequests",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_BloodUnits_Hospitals_HospitalId",
                table: "BloodUnits",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Hospitals_HospitalId",
                table: "Notifications",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId");

            migrationBuilder.AddForeignKey(
                name: "FK_SosRequests_Hospitals_HospitalId",
                table: "SosRequests",
                column: "HospitalId",
                principalTable: "Hospitals",
                principalColumn: "HospitalId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SosRequests_Hospitals_HospitalId1",
                table: "SosRequests",
                column: "HospitalId1",
                principalTable: "Hospitals",
                principalColumn: "HospitalId");
        }
    }
}
