using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCancelDateChangeAndManualBlocks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CancelReason",
                table: "BookingRequests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CancelledBy",
                table: "BookingRequests",
                type: "varchar(10)",
                maxLength: 10,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DateChangeNote",
                table: "BookingRequests",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateOnly>(
                name: "PendingNewDate",
                table: "BookingRequests",
                type: "date",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ManualBlockedDates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    VenueId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ManualBlockedDates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ManualBlockedDates_Venues_VenueId",
                        column: x => x.VenueId,
                        principalTable: "Venues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_ManualBlockedDates_VenueId_Date",
                table: "ManualBlockedDates",
                columns: new[] { "VenueId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ManualBlockedDates");

            migrationBuilder.DropColumn(
                name: "CancelReason",
                table: "BookingRequests");

            migrationBuilder.DropColumn(
                name: "CancelledBy",
                table: "BookingRequests");

            migrationBuilder.DropColumn(
                name: "DateChangeNote",
                table: "BookingRequests");

            migrationBuilder.DropColumn(
                name: "PendingNewDate",
                table: "BookingRequests");
        }
    }
}
