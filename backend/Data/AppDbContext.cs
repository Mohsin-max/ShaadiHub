using System.Text.Json;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<VenueImage> VenueImages => Set<VenueImage>();
    public DbSet<BookingRequest> BookingRequests => Set<BookingRequest>();
    public DbSet<BookingOffer> BookingOffers => Set<BookingOffer>();
    public DbSet<ManualBlockedDate> ManualBlockedDates => Set<ManualBlockedDate>();

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        // MySQL/Pomelo returns DateTime columns with Kind=Unspecified, but every DateTime we
        // write is DateTime.UtcNow — without this, JSON serialization omits the "Z" suffix and
        // browsers misinterpret the timestamp as local time instead of UTC.
        configurationBuilder.Properties<DateTime>().HaveConversion<UtcDateTimeConverter>();
        configurationBuilder.Properties<DateTime?>().HaveConversion<UtcNullableDateTimeConverter>();
    }

    private class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
    {
        public UtcDateTimeConverter() : base(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc))
        {
        }
    }

    private class UtcNullableDateTimeConverter : ValueConverter<DateTime?, DateTime?>
    {
        public UtcNullableDateTimeConverter()
            : base(v => v, v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : v)
        {
        }
    }

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

        modelBuilder.Entity<BookingRequest>(entity =>
        {
            entity.Property(b => b.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(b => b.Turn).HasConversion<string>().HasMaxLength(10);
            entity.Property(b => b.CancelledBy).HasConversion<string>().HasMaxLength(10);
            entity.Property(b => b.ListedPriceSnapshot).HasColumnType("decimal(12,2)");

            entity.HasOne(b => b.Venue)
                .WithMany()
                .HasForeignKey(b => b.VenueId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(b => b.Client)
                .WithMany()
                .HasForeignKey(b => b.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(b => new { b.VenueId, b.EventDate });
        });

        modelBuilder.Entity<BookingOffer>(entity =>
        {
            entity.Property(o => o.OfferedBy).HasConversion<string>().HasMaxLength(10);
            entity.Property(o => o.Price).HasColumnType("decimal(12,2)");

            entity.HasOne(o => o.BookingRequest)
                .WithMany(b => b.Offers)
                .HasForeignKey(o => o.BookingRequestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ManualBlockedDate>(entity =>
        {
            entity.HasOne(m => m.Venue)
                .WithMany()
                .HasForeignKey(m => m.VenueId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(m => new { m.VenueId, m.Date }).IsUnique();
        });
    }
}
