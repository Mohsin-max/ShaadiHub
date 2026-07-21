using System.Text.Json;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<VenueImage> VenueImages => Set<VenueImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Venue>(entity =>
        {
            entity.HasOne(v => v.Owner)
                .WithMany()
                .HasForeignKey(v => v.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(v => v.Price).HasColumnType("decimal(12,2)");
            entity.Property(v => v.WeekendPrice).HasColumnType("decimal(12,2)");
            entity.Property(v => v.SpecialEntryPrice).HasColumnType("decimal(12,2)");

            var amenitiesComparer = new ValueComparer<List<string>>(
                (a, b) => (a ?? new()).SequenceEqual(b ?? new()),
                a => a.Aggregate(0, (hash, item) => HashCode.Combine(hash, item.GetHashCode())),
                a => a.ToList());

            entity.Property(v => v.Amenities)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>())
                .HasColumnType("json")
                .Metadata.SetValueComparer(amenitiesComparer);

            entity.HasIndex(v => v.City);
            entity.HasIndex(v => v.AreaName);
            entity.HasIndex(v => v.Type);
        });

        modelBuilder.Entity<VenueImage>(entity =>
        {
            entity.HasOne(i => i.Venue)
                .WithMany(v => v.Images)
                .HasForeignKey(i => i.VenueId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
