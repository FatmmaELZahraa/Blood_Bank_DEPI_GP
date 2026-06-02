using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Blood_Bank.Migrations
{
    /// <inheritdoc />
    public partial class updateHospital : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BloodRequestHospital");

            migrationBuilder.DropColumn(
                name: "HospitalName",
                table: "User");

            migrationBuilder.DropColumn(
                name: "address",
                table: "User");

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Notifications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "inventories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "BloodUnits",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "BloodRequests",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldDefaultValue: "Pending");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestDate",
                table: "BloodRequests",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETDATE()");

            migrationBuilder.AlterColumn<string>(
                name: "BloodType",
                table: "BloodRequests",
                type: "nvarchar(5)",
                maxLength: 5,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(3)",
                oldMaxLength: 3);

            migrationBuilder.AddColumn<string>(
                name: "Department",
                table: "BloodRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DoctorName",
                table: "BloodRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "BloodRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "BloodRequests",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "patientName",
                table: "BloodRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "priority",
                table: "BloodRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Hospitals",
                columns: table => new
                {
                    HospitalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HospitalName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    TotalCapacity = table.Column<int>(type: "int", nullable: false),
                    CurrentUnits = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospitals", x => x.HospitalId);
                });

            migrationBuilder.CreateTable(
                name: "SosRequests",
                columns: table => new
                {
                    SOSId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HospitalId = table.Column<int>(type: "int", nullable: false),
                    BloodType = table.Column<string>(type: "nvarchar(5)", maxLength: 5, nullable: false),
                    Units = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    RequestDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HospitalId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SosRequests", x => x.SOSId);
                    table.ForeignKey(
                        name: "FK_SosRequests_Hospitals_HospitalId",
                        column: x => x.HospitalId,
                        principalTable: "Hospitals",
                        principalColumn: "HospitalId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SosRequests_Hospitals_HospitalId1",
                        column: x => x.HospitalId1,
                        principalTable: "Hospitals",
                        principalColumn: "HospitalId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_HospitalId",
                table: "Notifications",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodUnits_HospitalId",
                table: "BloodUnits",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_BloodRequests_HospitalId",
                table: "BloodRequests",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_SosRequests_HospitalId",
                table: "SosRequests",
                column: "HospitalId");

            migrationBuilder.CreateIndex(
                name: "IX_SosRequests_HospitalId1",
                table: "SosRequests",
                column: "HospitalId1");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropTable(
                name: "SosRequests");

            migrationBuilder.DropTable(
                name: "Hospitals");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_HospitalId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_BloodUnits_HospitalId",
                table: "BloodUnits");

            migrationBuilder.DropIndex(
                name: "IX_BloodRequests_HospitalId",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "inventories");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "BloodUnits");

            migrationBuilder.DropColumn(
                name: "Department",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "DoctorName",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "HospitalId",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "patientName",
                table: "BloodRequests");

            migrationBuilder.DropColumn(
                name: "priority",
                table: "BloodRequests");

            migrationBuilder.AddColumn<string>(
                name: "HospitalName",
                table: "User",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "address",
                table: "User",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "BloodRequests",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Pending",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "RequestDate",
                table: "BloodRequests",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<string>(
                name: "BloodType",
                table: "BloodRequests",
                type: "nvarchar(3)",
                maxLength: 3,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(5)",
                oldMaxLength: 5);

            migrationBuilder.CreateTable(
                name: "BloodRequestHospital",
                columns: table => new
                {
                    BloodRequestsRequestId = table.Column<int>(type: "int", nullable: false),
                    HospitalUserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BloodRequestHospital", x => new { x.BloodRequestsRequestId, x.HospitalUserID });
                    table.ForeignKey(
                        name: "FK_BloodRequestHospital_BloodRequests_BloodRequestsRequestId",
                        column: x => x.BloodRequestsRequestId,
                        principalTable: "BloodRequests",
                        principalColumn: "RequestId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BloodRequestHospital_User_HospitalUserID",
                        column: x => x.HospitalUserID,
                        principalTable: "User",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BloodRequestHospital_HospitalUserID",
                table: "BloodRequestHospital",
                column: "HospitalUserID");
        }
    }
}
