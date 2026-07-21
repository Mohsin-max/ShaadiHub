using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/booking-requests")]
public class BookingRequestsController : ControllerBase
{
    private readonly AppDbContext _context;

    public BookingRequestsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    [Route("/api/venues/{venueId:int}/booking-requests")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> Create(int venueId, CreateBookingRequestDto dto)
    {
        var clientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var venue = await _context.Venues.FirstOrDefaultAsync(v => v.Id == venueId);
        if (venue is null)
        {
            return NotFound(new { message = "Venue not found." });
        }

        if (dto.EventDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return BadRequest(new { message = "You can't request a date in the past." });
        }

        var alreadyBooked = await _context.BookingRequests.AnyAsync(b =>
            b.VenueId == venueId && b.EventDate == dto.EventDate && b.Status == BookingStatus.Booked);
        if (alreadyBooked)
        {
            return BadRequest(new { message = "This date is already booked for this venue." });
        }

        var request = new BookingRequest
        {
            VenueId = venueId,
            ClientId = clientId,
            EventDate = dto.EventDate,
            ListedPriceSnapshot = venue.Price,
            Status = BookingStatus.Pending,
            Turn = BookingTurn.Owner,
        };
        request.Offers.Add(new BookingOffer
        {
            OfferedBy = BookingTurn.Client,
            Price = dto.OfferPrice,
            Note = dto.Note?.Trim(),
        });

        _context.BookingRequests.Add(request);
        await _context.SaveChangesAsync();

        var created = await LoadFullAsync(request.Id);
        return Ok(BuildResponse(created!, viewerIsOwner: false));
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> ListMine()
    {
        var clientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var requests = await Query()
            .Where(b => b.ClientId == clientId)
            .OrderByDescending(b => b.UpdatedAt)
            .ToListAsync();

        return Ok(requests.Select(r => BuildResponse(r, viewerIsOwner: false)));
    }

    [HttpGet("received")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> ListReceived()
    {
        var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var requests = await Query()
            .Where(b => b.Venue.OwnerId == ownerId)
            .OrderByDescending(b => b.UpdatedAt)
            .ToListAsync();

        return Ok(requests.Select(r => BuildResponse(r, viewerIsOwner: true)));
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var request = await LoadFullAsync(id);
        if (request is null)
        {
            return NotFound(new { message = "Booking request not found." });
        }

        var isClient = request.ClientId == userId;
        var isOwner = request.Venue.OwnerId == userId;
        if (!isClient && !isOwner)
        {
            return Forbid();
        }

        return Ok(BuildResponse(request, viewerIsOwner: isOwner));
    }

    [HttpPost("{id:int}/respond")]
    [Authorize]
    public async Task<IActionResult> Respond(int id, RespondBookingRequestDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var request = await LoadFullAsync(id);
        if (request is null)
        {
            return NotFound(new { message = "Booking request not found." });
        }

        var isClient = request.ClientId == userId;
        var isOwner = request.Venue.OwnerId == userId;
        if (!isClient && !isOwner)
        {
            return Forbid();
        }

        if (request.Status is BookingStatus.Booked or BookingStatus.Rejected)
        {
            return BadRequest(new { message = "This request has already been finalized." });
        }

        var viewerRole = isOwner ? BookingTurn.Owner : BookingTurn.Client;
        if (request.Turn != viewerRole)
        {
            return BadRequest(new { message = "It's not your turn to respond to this request." });
        }

        switch (dto.Action)
        {
            case "Accept":
                var conflict = await _context.BookingRequests.AnyAsync(b =>
                    b.Id != request.Id && b.VenueId == request.VenueId &&
                    b.EventDate == request.EventDate && b.Status == BookingStatus.Booked);
                if (conflict)
                {
                    return BadRequest(new { message = "This date has already been booked by someone else." });
                }
                request.Status = BookingStatus.Booked;
                break;

            case "Reject":
                if (string.IsNullOrWhiteSpace(dto.Note))
                {
                    return BadRequest(new { message = "Please provide a short reason for rejecting." });
                }
                request.Status = BookingStatus.Rejected;
                request.RejectReason = dto.Note.Trim();
                break;

            case "Counter":
                if (dto.Price is null || dto.Price <= 0)
                {
                    return BadRequest(new { message = "Please provide a valid counter-offer price." });
                }
                request.Status = BookingStatus.Countered;
                request.Turn = viewerRole == BookingTurn.Owner ? BookingTurn.Client : BookingTurn.Owner;
                request.Offers.Add(new BookingOffer
                {
                    OfferedBy = viewerRole,
                    Price = dto.Price.Value,
                    Note = dto.Note?.Trim(),
                });
                break;

            default:
                return BadRequest(new { message = "Invalid action." });
        }

        request.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var updated = await LoadFullAsync(id);
        return Ok(BuildResponse(updated!, viewerIsOwner: isOwner));
    }

    [HttpGet]
    [Route("/api/venues/{venueId:int}/booked-dates")]
    [AllowAnonymous]
    public async Task<IActionResult> BookedDates(int venueId)
    {
        var dates = await _context.BookingRequests
            .Where(b => b.VenueId == venueId && b.Status == BookingStatus.Booked)
            .Select(b => b.EventDate)
            .ToListAsync();

        return Ok(dates.Select(d => d.ToString("yyyy-MM-dd")));
    }

    private IQueryable<BookingRequest> Query()
    {
        return _context.BookingRequests
            .Include(b => b.Venue).ThenInclude(v => v.Owner)
            .Include(b => b.Venue).ThenInclude(v => v.Images)
            .Include(b => b.Client)
            .Include(b => b.Offers);
    }

    private Task<BookingRequest?> LoadFullAsync(int id)
    {
        return Query().FirstOrDefaultAsync(b => b.Id == id);
    }

    private BookingRequestResponse BuildResponse(BookingRequest request, bool viewerIsOwner)
    {
        var baseUrl = $"{Request.Scheme}://{Request.Host}";
        var orderedOffers = request.Offers.OrderBy(o => o.CreatedAt).ToList();
        var latestOffer = orderedOffers.Last();

        var viewerRole = viewerIsOwner ? BookingTurn.Owner : BookingTurn.Client;
        var isMyTurn = (request.Status is BookingStatus.Pending or BookingStatus.Countered) && request.Turn == viewerRole;

        BookingContactInfo? contactInfo = null;
        if (request.Status == BookingStatus.Booked)
        {
            contactInfo = new BookingContactInfo
            {
                ClientName = $"{request.Client.FirstName} {request.Client.LastName}".Trim(),
                ClientPhone = string.IsNullOrWhiteSpace(request.Client.Phone) ? "Not provided" : request.Client.Phone,
                OwnerName = request.Venue.Owner.Name ?? string.Empty,
                OwnerPhone = string.IsNullOrWhiteSpace(request.Venue.Owner.Phone) ? "Not provided" : request.Venue.Owner.Phone,
            };
        }

        return new BookingRequestResponse
        {
            Id = request.Id,
            VenueId = request.VenueId,
            VenueName = request.Venue.Name,
            VenueImage = request.Venue.Images.OrderBy(i => i.SortOrder).Select(i => $"{baseUrl}{i.Url}").FirstOrDefault(),
            VenueCity = request.Venue.City,
            VenueAreaName = request.Venue.AreaName,
            ClientName = $"{request.Client.FirstName} {request.Client.LastName}".Trim(),
            OwnerName = request.Venue.Owner.Name ?? string.Empty,
            EventDate = request.EventDate,
            ListedPriceSnapshot = request.ListedPriceSnapshot,
            CurrentPrice = latestOffer.Price,
            Status = request.Status.ToString(),
            Turn = request.Turn.ToString(),
            RejectReason = request.RejectReason,
            ViewerRole = viewerRole.ToString(),
            IsMyTurn = isMyTurn,
            Offers = orderedOffers.Select(o => new BookingOfferResponse
            {
                Id = o.Id,
                OfferedBy = o.OfferedBy.ToString(),
                Price = o.Price,
                Note = o.Note,
                CreatedAt = o.CreatedAt,
            }).ToList(),
            ContactInfo = contactInfo,
            CreatedAt = request.CreatedAt,
            UpdatedAt = request.UpdatedAt,
        };
    }
}
