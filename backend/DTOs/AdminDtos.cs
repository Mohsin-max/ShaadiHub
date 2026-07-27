namespace backend.DTOs;

public class AdminDashboardResponse
{
    public int TotalVenueOwners { get; set; }
    public int TotalClients { get; set; }
    public int TotalVenues { get; set; }
    public int PendingActivityCount { get; set; }
    public List<AdminActivityItem> RecentActivity { get; set; } = new();
}

public class AdminActivityItem
{
    public int Id { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
}

public class AdminUserResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public int? VenueCount { get; set; }
}

public class AdminVenueResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string AreaName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SetActiveStatusDto
{
    public bool IsActive { get; set; }
}
