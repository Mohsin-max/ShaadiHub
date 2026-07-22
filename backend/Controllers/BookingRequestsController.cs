using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/booking-requests")]
public class BookingRequestsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<NotificationHub> _hub;

    public BookingRequestsController(AppDbContext context, IHubContext<NotificationHub> hub)
    {
        _context = context;
        _hub = hub;
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

        request.ClientViewedAt = DateTime.UtcNow;

        _context.BookingRequests.Add(request);
        await _context.SaveChangesAsync();

        var created = await LoadFullAsync(request.Id);
        await PushNotificationCountAsync(venue.OwnerId, "VenueOwner");
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

    [HttpGet("notifications/count")]
    [Authorize]
    public async Task<IActionResult> NotificationCount()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var count = await GetNotificationCountAsync(userId, role);
        return Ok(new { count });
    }

    private async Task<int> GetNotificationCountAsync(int userId, string? role)
    {
        // "Unseen" = the request has changed since this role last opened its detail page
        // (or they've never opened it at all). This covers every kind of update — a new
        // request, a counter-offer, an accept/reject, a cancellation, a date-change
        // request/response — not just the narrower "it's your turn to act" case.
        if (role == "Client")
        {
            return await _context.BookingRequests.CountAsync(b =>
                b.ClientId == userId && (b.ClientViewedAt == null || b.UpdatedAt > b.ClientViewedAt));
        }
        if (role == "VenueOwner")
        {
            return await _context.BookingRequests.CountAsync(b =>
                b.Venue.OwnerId == userId && (b.OwnerViewedAt == null || b.UpdatedAt > b.OwnerViewedAt));
        }
        return 0;
    }

    private async Task PushNotificationCountAsync(int userId, string role)
    {
        var count = await GetNotificationCountAsync(userId, role);
        await _hub.Clients.User(userId.ToString()).SendAsync("notificationCount", count);
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

        if (isClient)
        {
            request.ClientViewedAt = DateTime.UtcNow;
        }
        if (isOwner)
        {
            request.OwnerViewedAt = DateTime.UtcNow;
        }
        await _context.SaveChangesAsync();
        await PushNotificationCountAsync(userId, isOwner ? "VenueOwner" : "Client");

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

        if (request.Status is BookingStatus.Booked or BookingStatus.Rejected or BookingStatus.Cancelled)
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
        if (isOwner)
        {
            request.OwnerViewedAt = request.UpdatedAt;
        }
        else
        {
            request.ClientViewedAt = request.UpdatedAt;
        }
        await _context.SaveChangesAsync();

        var updated = await LoadFullAsync(id);
        await PushNotificationCountAsync(request.ClientId, "Client");
        await PushNotificationCountAsync(request.Venue.OwnerId, "VenueOwner");
        return Ok(BuildResponse(updated!, viewerIsOwner: isOwner));
    }

    [HttpPost("{id:int}/cancel")]
    [Authorize]
    public async Task<IActionResult> Cancel(int id, CancelBookingRequestDto dto)
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

        if (request.Status != BookingStatus.Booked)
        {
            return BadRequest(new { message = "Only a booked reservation can be cancelled." });
        }

        if (string.IsNullOrWhiteSpace(dto.Reason))
        {
            return BadRequest(new { message = "Please provide a short reason for cancelling." });
        }

        request.Status = BookingStatus.Cancelled;
        request.CancelledBy = isOwner ? BookingTurn.Owner : BookingTurn.Client;
        request.CancelReason = dto.Reason.Trim();
        request.UpdatedAt = DateTime.UtcNow;
        if (isOwner)
        {
            request.OwnerViewedAt = request.UpdatedAt;
        }
        else
        {
            request.ClientViewedAt = request.UpdatedAt;
        }
        await _context.SaveChangesAsync();

        var updated = await LoadFullAsync(id);
        await PushNotificationCountAsync(request.ClientId, "Client");
        await PushNotificationCountAsync(request.Venue.OwnerId, "VenueOwner");
        return Ok(BuildResponse(updated!, viewerIsOwner: isOwner));
    }

    [HttpPost("{id:int}/request-date-change")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> RequestDateChange(int id, RequestDateChangeDto dto)
    {
        var clientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var request = await LoadFullAsync(id);
        if (request is null)
        {
            return NotFound(new { message = "Booking request not found." });
        }
        if (request.ClientId != clientId)
        {
            return Forbid();
        }
        if (request.Status != BookingStatus.Booked)
        {
            return BadRequest(new { message = "Only a booked reservation's date can be changed." });
        }
        if (request.PendingNewDate is not null)
        {
            return BadRequest(new { message = "A date change request is already pending." });
        }
        if (dto.NewDate < DateOnly.FromDateTime(DateTime.UtcNow))
        {
            return BadRequest(new { message = "You can't request a date in the past." });
        }
        if (dto.NewDate == request.EventDate)
        {
            return BadRequest(new { message = "That's already the current date." });
        }

        var conflict = await _context.BookingRequests.AnyAsync(b =>
            b.Id != request.Id && b.VenueId == request.VenueId &&
            b.EventDate == dto.NewDate && b.Status == BookingStatus.Booked);
        var manualConflict = await _context.ManualBlockedDates.AnyAsync(m =>
            m.VenueId == request.VenueId && m.Date == dto.NewDate);
        if (conflict || manualConflict)
        {
            return BadRequest(new { message = "That date is already booked for this venue." });
        }

        request.PendingNewDate = dto.NewDate;
        request.DateChangeNote = dto.Note?.Trim();
        request.UpdatedAt = DateTime.UtcNow;
        request.ClientViewedAt = request.UpdatedAt;
        await _context.SaveChangesAsync();

        var updated = await LoadFullAsync(id);
        await PushNotificationCountAsync(request.Venue.OwnerId, "VenueOwner");
        return Ok(BuildResponse(updated!, viewerIsOwner: false));
    }

    [HttpPost("{id:int}/respond-date-change")]
    [Authorize(Roles = "VenueOwner")]
    public async Task<IActionResult> RespondDateChange(int id, RespondDateChangeDto dto)
    {
        var ownerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var request = await LoadFullAsync(id);
        if (request is null)
        {
            return NotFound(new { message = "Booking request not found." });
        }
        if (request.Venue.OwnerId != ownerId)
        {
            return Forbid();
        }
        if (request.Status != BookingStatus.Booked || request.PendingNewDate is null)
        {
            return BadRequest(new { message = "There is no pending date change to respond to." });
        }

        if (dto.Action == "Accept")
        {
            var conflict = await _context.BookingRequests.AnyAsync(b =>
                b.Id != request.Id && b.VenueId == request.VenueId &&
                b.EventDate == request.PendingNewDate && b.Status == BookingStatus.Booked);
            if (conflict)
            {
                return BadRequest(new { message = "That date has since been booked by someone else." });
            }
            request.EventDate = request.PendingNewDate.Value;
        }
        else if (dto.Action != "Reject")
        {
            return BadRequest(new { message = "Invalid action." });
        }

        request.PendingNewDate = null;
        request.DateChangeNote = null;
        request.UpdatedAt = DateTime.UtcNow;
        request.OwnerViewedAt = request.UpdatedAt;
        await _context.SaveChangesAsync();

        var updated = await LoadFullAsync(id);
        await PushNotificationCountAsync(request.ClientId, "Client");
        return Ok(BuildResponse(updated!, viewerIsOwner: true));
    }

    [HttpGet]
    [Route("/api/venues/{venueId:int}/booked-dates")]
    [AllowAnonymous]
    public async Task<IActionResult> BookedDates(int venueId)
    {
        var requestDates = await _context.BookingRequests
            .Where(b => b.VenueId == venueId && b.Status == BookingStatus.Booked)
            .Select(b => new BookedDateResponse { Date = b.EventDate.ToString("yyyy-MM-dd"), Source = "Request", RequestId = b.Id })
            .ToListAsync();

        var manualDates = await _context.ManualBlockedDates
            .Where(m => m.VenueId == venueId)
            .Select(m => new BookedDateResponse { Date = m.Date.ToString("yyyy-MM-dd"), Source = "Manual" })
            .ToListAsync();

        return Ok(requestDates.Concat(manualDates));
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
        var canCancel = request.Status == BookingStatus.Booked;
        var canRequestDateChange = request.Status == BookingStatus.Booked && request.PendingNewDate is null && viewerRole == BookingTurn.Client;
        var canRespondToDateChange = request.Status == BookingStatus.Booked && request.PendingNewDate is not null && viewerRole == BookingTurn.Owner;

        BookingContactInfo? contactInfo = null;
        if (request.Status is BookingStatus.Booked or BookingStatus.Cancelled)
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
            CancelledBy = request.CancelledBy?.ToString(),
            CancelReason = request.CancelReason,
            PendingNewDate = request.PendingNewDate,
            DateChangeNote = request.DateChangeNote,
            ViewerRole = viewerRole.ToString(),
            IsMyTurn = isMyTurn,
            CanCancel = canCancel,
            CanRequestDateChange = canRequestDateChange,
            CanRespondToDateChange = canRespondToDateChange,
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
