using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendToyotaManagement.Models;

public class OrderDto
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int OrderId { get; set; }
    public int CustomerId { get; set; }
    public int CarId { get; set; }
    public string OrderDate { get; set; }
    public int Deposit { get; set; }
    public string WarrantyPolicy { get; set; }
    public int TotalCost { get; set; }
    public int Quantity { get; set; }
    public OrderStatus OrderStatus { get; set; }
    public CarDto Car { get; set; }
}
