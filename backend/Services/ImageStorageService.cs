namespace backend.Services;

public class ImageStorageService
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp", "image/gif",
    };

    private readonly string _webRootPath;

    public ImageStorageService(IWebHostEnvironment env)
    {
        _webRootPath = env.WebRootPath;
    }

    public async Task<List<string>> SaveVenueImagesAsync(int venueId, IEnumerable<IFormFile> files)
    {
        var urls = new List<string>();
        var targetDir = Path.Combine(_webRootPath, "uploads", "venues", venueId.ToString());
        Directory.CreateDirectory(targetDir);

        foreach (var file in files)
        {
            if (file.Length == 0 || !AllowedContentTypes.Contains(file.ContentType))
            {
                continue;
            }

            var extension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(targetDir, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            urls.Add($"/uploads/venues/{venueId}/{fileName}");
        }

        return urls;
    }
}
