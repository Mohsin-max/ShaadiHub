using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> Dashboard()
    {
        var totalVenueOwners = await _context.Users.CountAsync(u => u.Role == UserRole.VenueOwner);
        var totalClients = await _context.Users.CountAsync(u => u.Role == UserRole.Client);
        var totalVenues = await _context.Venues.CountAsync();

        var pendingStatuses = new List<BookingStatus> { BookingStatus.Pending, BookingStatus.Countered };
        var pendingActivityCount = await _context.BookingRequests.CountAsync(b => pendingStatuses.Contains(b.Status));

        var recentActivity = await _context.BookingRequests
            .Include(b => b.Venue)
            .Include(b => b.Client)
            .OrderByDescending(b => b.UpdatedAt)
            .Take(8)
            .Select(b => new AdminActivityItem
            {
                Id = b.Id,
                VenueName = b.Venue.Name,
                ClientName = (b.Client.FirstName + " " + b.Client.LastName).Trim(),
                Status = b.Status.ToString(),
                UpdatedAt = b.UpdatedAt,
            })
            .ToListAsync();

        return Ok(new AdminDashboardResponse
        {
            TotalVenueOwners = totalVenueOwners,
            TotalClients = totalClients,
            TotalVenues = totalVenues,
            PendingActivityCount = pendingActivityCount,
            RecentActivity = recentActivity,
        });
    }

    [HttpGet("venue-owners")]
    public async Task<IActionResult> VenueOwners()
    {
        var owners = await _context.Users
            .Where(u => u.Role == UserRole.VenueOwner)
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id,
                Name = u.Name ?? string.Empty,
                Email = u.Email,
                Phone = u.Phone,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                VenueCount = _context.Venues.Count(v => v.OwnerId == u.Id),
            })
            .ToListAsync();

        return Ok(owners);
    }

    [HttpGet("clients")]
    public async Task<IActionResult> Clients()
    {
        var clients = await _context.Users
            .Where(u => u.Role == UserRole.Client)
            .OrderByDescending(u => u.CreatedAt)
            .Select(u => new AdminUserResponse
            {
                Id = u.Id,
                Name = (u.FirstName + " " + u.LastName).Trim(),
                Email = u.Email,
                Phone = u.Phone,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt,
                VenueCount = null,
            })
            .ToListAsync();

        return Ok(clients);
    }

    [HttpGet("venues")]
    public async Task<IActionResult> Venues([FromQuery] string? search)
    {
        var query = _context.Venues.Include(v => v.Owner).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(v =>
                v.Name.Contains(term) ||
                v.AreaName.Contains(term) ||
                v.City.Contains(term) ||
                (v.Owner.Name ?? string.Empty).Contains(term));
        }

        var venues = await query
            .OrderByDescending(v => v.CreatedAt)
            .Select(v => new AdminVenueResponse
            {
                Id = v.Id,
                Name = v.Name,
                OwnerName = v.Owner.Name ?? string.Empty,
                AreaName = v.AreaName,
                City = v.City,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
            })
            .ToListAsync();

        return Ok(venues);
    }

    [HttpPatch("venues/{id:int}/status")]
    public async Task<IActionResult> SetVenueStatus(int id, SetActiveStatusDto dto)
    {
        var venue = await _context.Venues.FindAsync(id);
        if (venue is null)
        {
            return NotFound(new { message = "Venue not found." });
        }

        venue.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { id = venue.Id, isActive = venue.IsActive });
    }

    [HttpPatch("users/{id:int}/status")]
    public async Task<IActionResult> SetUserStatus(int id, SetActiveStatusDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null)
        {
            return NotFound(new { message = "User not found." });
        }
        if (user.Role == UserRole.Admin)
        {
            return BadRequest(new { message = "Admin accounts can't be deactivated here." });
        }

        user.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { id = user.Id, isActive = user.IsActive });
    }
}
