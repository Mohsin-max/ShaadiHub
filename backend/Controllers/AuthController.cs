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
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly AuthService _authService;

    public AuthController(AppDbContext context, AuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost("signup/client")]
    public async Task<IActionResult> SignupClient(ClientSignupRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Email == normalizedEmail))
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        var user = new User
        {
            Role = UserRole.Client,
            Email = normalizedEmail,
            PasswordHash = _authService.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim(),
            Phone = request.Phone.Trim(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(BuildAuthResponse(user));
    }

    [HttpPost("signup/provider")]
    public async Task<IActionResult> SignupProvider(ProviderSignupRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        if (await _context.Users.AnyAsync(u => u.Email == normalizedEmail))
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        var user = new User
        {
            Role = UserRole.VenueOwner,
            Email = normalizedEmail,
            PasswordHash = _authService.HashPassword(request.Password),
            Name = request.Name.Trim(),
            Phone = request.Phone.Trim(),
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(BuildAuthResponse(user));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user is null || !_authService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(BuildAuthResponse(user));
    }

    [HttpPut("phone")]
    [Authorize]
    public async Task<IActionResult> UpdatePhone(UpdatePhoneRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user is null)
        {
            return NotFound(new { message = "User not found." });
        }

        user.Phone = request.Phone.Trim();
        await _context.SaveChangesAsync();

        return Ok(BuildAuthResponse(user));
    }

    private AuthResponse BuildAuthResponse(User user)
    {
        var displayName = user.Role == UserRole.Client
            ? $"{user.FirstName} {user.LastName}".Trim()
            : user.Name ?? string.Empty;

        return new AuthResponse
        {
            Id = user.Id,
            Token = _authService.GenerateToken(user),
            Role = user.Role.ToString(),
            DisplayName = displayName,
            Email = user.Email,
            Phone = user.Phone,
        };
    }
}
