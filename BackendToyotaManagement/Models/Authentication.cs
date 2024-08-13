namespace BackendToyotaManagement.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Authentication
{
    [Key] public int Id { get; set; }
    [StringLength(100)] public string Username { get; set; }
    [StringLength(200)] public string Password { get; set; }
    [StringLength(50)] public string Role { get; set; }
}
