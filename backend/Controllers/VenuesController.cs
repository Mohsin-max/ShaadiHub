using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/venues")]
public class VenuesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ImageStorageService _imageStorage;

    public VenuesController(AppDbContext context, ImageStorageService imageStorage)
    {
        _context = context;
        _imageStorage = imageStorage;
    }

    [HttpPost]
    [Authorize(Roles = "VenueOwner")]
    [RequestSizeLimit(50_000_000)]
    public async Task<IActionResult> Create([FromForm] CreateVenueRequest request)
    {
        var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var venue = new Venue
        {
            OwnerId = ownerId,
            Name = request.Name.Trim(),
            Type = request.Type.Trim(),
            Capacity = request.Capacity,
            GoogleMapsLink = request.GoogleMapsLink.Trim(),
            AreaName = request.AreaName.Trim(),
            City = request.City.Trim(),
            Price = request.Price,
            WeekendPrice = request.WeekendPrice,
            Description = request.Description?.Trim(),
            Amenities = request.Amenities
                .Select(a => a.Trim())
                .Where(a => a.Length > 0)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList(),
        };

        _context.Venues.Add(venue);
        await _context.SaveChangesAsync();

        if (request.Images.Count > 0)
        {
            var urls = await _imageStorage.SaveVenueImagesAsync(venue.Id, request.Images);
            for (var i = 0; i < urls.Count; i++)
            {
                _context.VenueImages.Add(new VenueImage { VenueId = venue.Id, Url = urls[i], SortOrder = i });
            }
            await _context.SaveChangesAsync();
        }

        var created = await _context.Venues
            .Include(v => v.Owner)
            .Include(v => v.Images)
            .FirstAsync(v => v.Id == venue.Id);

        return Ok(BuildResponse(created));
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List([FromQuery] string[]? city, [FromQuery] string[]? area, [FromQuery] string[]? type)
    {
        var query = _context.Venues.Include(v => v.Owner).Include(v => v.Images).AsQueryable();

        if (city is { Length: > 0 })
        {
            var cities = city.ToList();
            query = query.Where(v => cities.Contains(v.City));
        }
        if (area is { Length: > 0 })
        {
            var areas = area.ToList();
            query = query.Where(v => areas.Contains(v.AreaName));
        }
        if (type is { Length: > 0 })
        {
            var types = type.ToList();
            query = query.Where(v => types.Contains(v.Type));
        }

        var venues = await query.OrderByDescending(v => v.CreatedAt).ToListAsync();
        return Ok(venues.Select(BuildResponse));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var venue = await _context.Venues
            .Include(v => v.Owner)
            .Include(v => v.Images)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (venue is null)
        {
            return NotFound(new { message = "Venue not found." });
        }

        return Ok(BuildResponse(venue));
    }

    private VenueResponse BuildResponse(Venue venue)
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}";

        return new VenueResponse
        {
            Id = venue.Id,
            Name = venue.Name,
            Type = venue.Type,
            Capacity = venue.Capacity,
            GoogleMapsLink = venue.GoogleMapsLink,
            AreaName = venue.AreaName,
            City = venue.City,
            Price = venue.Price,
            WeekendPrice = venue.WeekendPrice,
            Description = venue.Description,
            Amenities = venue.Amenities,
            Images = venue.Images
                .OrderBy(i => i.SortOrder)
                .Select(i => new VenueImageResponse { Id = i.Id, Url = $"{baseUrl}{i.Url}" })
                .ToList(),
            OwnerId = venue.OwnerId,
            OwnerName = venue.Owner.Role == UserRole.VenueOwner
                ? venue.Owner.Name ?? string.Empty
                : $"{venue.Owner.FirstName} {venue.Owner.LastName}".Trim(),
            CreatedAt = venue.CreatedAt,
        };
    }
}
