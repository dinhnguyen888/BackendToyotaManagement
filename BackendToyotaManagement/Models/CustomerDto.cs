using System.ComponentModel.DataAnnotations;

namespace BackendToyotaManagement.Models
{
    public class CustomerDto
    {
        public int CustomerId { get; set; }
        [StringLength(50)]
        public string FullName { get; set; }

        [StringLength(100)]
        public string Address { get; set; }

        [StringLength(15)]
        public string PhoneNumber { get; set; }


        [StringLength(200)]
        public string Email { get; set; }

    }
}
