using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendToyotaManagement.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderId { get; set; }

        public int CustomerId { get; set; }
        public Customer Customer { get; set; }

        public int CarId { get; set; }
        public Car Car { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderDate { get; set; }

        [Required]
        public int Deposit { get; set; }

        public string WarrantyPolicy { get; set; }

        [Required]
        public int TotalCost { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [EnumDataType(typeof(OrderStatus))]
        public OrderStatus OrderStatus { get; set; }
    }

    public enum OrderStatus
    {
        Delivering,
        Delivered
    }
}
