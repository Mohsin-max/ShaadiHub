using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminPanelSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Venues",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Users",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "IsActive", "LastName", "Name", "PasswordHash", "Phone", "Role" },
                values: new object[] { 999, new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@shaadihub.pk", null, true, null, "Platform Admin", "$2a$11$qpMyC844PVglx4jHV9NTrejydUpgBnYgwscOVb9tWEmMqlugvoPSe", null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 999);

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Venues");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Users");
        }
    }
}
