namespace backend.Models;

public class VenueImage
{
    public int Id { get; set; }
    public int VenueId { get; set; }
    public Venue Venue { get; set; } = null!;

    public string Url { get; set; } = string.Empty;
    public int SortOrder { get; set; }
}
