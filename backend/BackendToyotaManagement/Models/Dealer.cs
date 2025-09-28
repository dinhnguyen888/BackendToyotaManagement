using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using BackendToyotaManagement.Models;

namespace BackendToyotaManagement.Models
{
    public class Dealer
    {
        [Key] public int DealerId { get; set; }

        [StringLength(50)]
        public string DealerName { get; set; }

        [StringLength(50)]
        public string Address { get; set; }

        [StringLength(50)]
        public string Email { get; set; }

        [StringLength(15)]
        public string PhoneNumber { get; set; }

        public ICollection<Car> Car { get; set; }
    }
}
