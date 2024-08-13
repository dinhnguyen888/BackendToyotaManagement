using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendToyotaManagement.Models
{
    public class Maintenance
    {
        [Key]
        [ForeignKey("Customer")]
        public int CustomerId { get; set; }

        [ForeignKey("Employee")]
        public int? EmployeeId { get; set; }
        [ForeignKey("Order")]

        public int OrderId { get; set; }

        public Customer Customer { get; set; }
        public Staff Staff { get; set; }

        public Order Order { get; set; }
    }
}
