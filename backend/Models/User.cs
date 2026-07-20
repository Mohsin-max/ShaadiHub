namespace backend.Models;

public enum UserRole
{
    Client,
    VenueOwner,
    Admin,
}

public class User
{
    public int Id { get; set; }
    public UserRole Role { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Client-only fields
    public string? FirstName { get; set; }
    public string? LastName { get; set; }

    // Venue Owner-only fields
    public string? Name { get; set; }
    public string? Phone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
