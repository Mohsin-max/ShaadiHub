namespace backend.Models;

public class Venue
{
    public int Id { get; set; }
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;

    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; }

    public string GoogleMapsLink { get; set; } = string.Empty;
    public string AreaName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;

    public decimal Price { get; set; }
    public decimal? WeekendPrice { get; set; }
    public string? Description { get; set; }

    public string Catering { get; set; } = "Internal";
    public int? ParkingSpaces { get; set; }
    public string RefundPolicy { get; set; } = "Non-Refundable";

    public bool SpecialEntryEnabled { get; set; }
    public decimal? SpecialEntryPrice { get; set; }
    public string? SpecialEntryDescription { get; set; }

    public List<string> Amenities { get; set; } = new();
    public List<VenueImage> Images { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
