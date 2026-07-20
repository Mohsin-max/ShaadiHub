using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.DTOs;

public class CreateVenueRequest
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Type { get; set; } = string.Empty;

    [Required, Range(1, 100000)]
    public int Capacity { get; set; }

    [Required]
    public string GoogleMapsLink { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string AreaName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string City { get; set; } = string.Empty;

    [Required, Range(0, 100000000)]
    public decimal Price { get; set; }

    public decimal? WeekendPrice { get; set; }

    public string? Description { get; set; }

    public List<string> Amenities { get; set; } = new();

    public List<IFormFile> Images { get; set; } = new();
}

public class VenueImageResponse
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
}

public class VenueResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public string GoogleMapsLink { get; set; } = string.Empty;
    public string AreaName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? WeekendPrice { get; set; }
    public string? Description { get; set; }
    public List<string> Amenities { get; set; } = new();
    public List<VenueImageResponse> Images { get; set; } = new();
    public int OwnerId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
