using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddVenueFacilitiesAndPolicies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Catering",
                table: "Venues",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "ParkingSpaces",
                table: "Venues",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RefundPolicy",
                table: "Venues",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SpecialEntryDescription",
                table: "Venues",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "SpecialEntryEnabled",
                table: "Venues",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "SpecialEntryPrice",
                table: "Venues",
                type: "decimal(12,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Catering",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "ParkingSpaces",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "RefundPolicy",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "SpecialEntryDescription",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "SpecialEntryEnabled",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "SpecialEntryPrice",
                table: "Venues");
        }
    }
}
