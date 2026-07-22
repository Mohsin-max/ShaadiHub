namespace backend.Models;

public enum BookingStatus
{
    Pending,
    Countered,
    Booked,
    Rejected,
    Cancelled,
}

public enum BookingTurn
{
    Client,
    Owner,
}

public class BookingRequest
{
    public int Id { get; set; }

    public int VenueId { get; set; }
    public Venue Venue { get; set; } = null!;

    public int ClientId { get; set; }
    public User Client { get; set; } = null!;

    public DateOnly EventDate { get; set; }
    public decimal ListedPriceSnapshot { get; set; }

    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public BookingTurn Turn { get; set; } = BookingTurn.Owner;
    public string? RejectReason { get; set; }

    public BookingTurn? CancelledBy { get; set; }
    public string? CancelReason { get; set; }

    public DateOnly? PendingNewDate { get; set; }
    public string? DateChangeNote { get; set; }

    public List<BookingOffer> Offers { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class ManualBlockedDate
{
    public int Id { get; set; }

    public int VenueId { get; set; }
    public Venue Venue { get; set; } = null!;

    public DateOnly Date { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class BookingOffer
{
    public int Id { get; set; }

    public int BookingRequestId { get; set; }
    public BookingRequest BookingRequest { get; set; } = null!;

    public BookingTurn OfferedBy { get; set; }
    public decimal Price { get; set; }
    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
