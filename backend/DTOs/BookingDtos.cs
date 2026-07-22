using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateBookingRequestDto
{
    [Required]
    public DateOnly EventDate { get; set; }

    [Required, Range(0, 100000000)]
    public decimal OfferPrice { get; set; }

    public string? Note { get; set; }
}

public class RespondBookingRequestDto
{
    [Required]
    public string Action { get; set; } = string.Empty; // Accept | Reject | Counter

    public decimal? Price { get; set; }

    public string? Note { get; set; }
}

public class CancelBookingRequestDto
{
    [Required]
    public string Reason { get; set; } = string.Empty;
}

public class RequestDateChangeDto
{
    [Required]
    public DateOnly NewDate { get; set; }

    public string? Note { get; set; }
}

public class RespondDateChangeDto
{
    [Required]
    public string Action { get; set; } = string.Empty; // Accept | Reject
}

public class AddBlockedDateDto
{
    [Required]
    public DateOnly Date { get; set; }
}

public class BookedDateResponse
{
    public string Date { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty; // Request | Manual
    public int? RequestId { get; set; }
}

public class BookingOfferResponse
{
    public int Id { get; set; }
    public string OfferedBy { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class BookingContactInfo
{
    public string ClientName { get; set; } = string.Empty;
    public string ClientPhone { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string OwnerPhone { get; set; } = string.Empty;
}

public class BookingRequestResponse
{
    public int Id { get; set; }

    public int VenueId { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public string? VenueImage { get; set; }
    public string VenueCity { get; set; } = string.Empty;
    public string VenueAreaName { get; set; } = string.Empty;

    public string ClientName { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;

    public DateOnly EventDate { get; set; }
    public decimal ListedPriceSnapshot { get; set; }
    public decimal CurrentPrice { get; set; }

    public string Status { get; set; } = string.Empty;
    public string Turn { get; set; } = string.Empty;
    public string? RejectReason { get; set; }

    public string? CancelledBy { get; set; }
    public string? CancelReason { get; set; }

    public DateOnly? PendingNewDate { get; set; }
    public string? DateChangeNote { get; set; }

    public string ViewerRole { get; set; } = string.Empty;
    public bool IsMyTurn { get; set; }
    public bool CanCancel { get; set; }
    public bool CanRequestDateChange { get; set; }
    public bool CanRespondToDateChange { get; set; }

    public List<BookingOfferResponse> Offers { get; set; } = new();
    public BookingContactInfo? ContactInfo { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
