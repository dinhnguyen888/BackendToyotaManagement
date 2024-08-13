using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendToyotaManagement.Models
{
    public class Staff
    {
        [Key] public int StaffId { get; set; }

        [StringLength(20)] public string Performance { get; set; }

        [StringLength(25)] public string Name { get; set; }

        [StringLength(50)] public string Address { get; set; }

        [StringLength(15)] public string Phone { get; set; }

        [StringLength(10)] public string Salary { get; set; }

        public string WorkSchedule { get; set; }

        [StringLength(50)] public string Position { get; set; }
    }
}
