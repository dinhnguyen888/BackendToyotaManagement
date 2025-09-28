using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendToyotaManagement.Models
{
    public class Car
    {
        [Key] public int CarId { get; set; }

        public int Goodwill { get; set; }

        public int Price { get; set; }
        [StringLength(100)] public string CarName { get; set; }
        public int DealerId { get; set; }

        [StringLength(1500)] public string Specifications { get; set; }

        [StringLength(50)] public string CarType { get; set; }

        [StringLength(100)] public string Thumbnail { get; set; }

        [StringLength(1500)] public string Description { get; set; }

        public int Quantity { get; set; }
        [ForeignKey("DealerId")]
        public Dealer Dealer { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}
