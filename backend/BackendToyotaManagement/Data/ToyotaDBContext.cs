using Microsoft.EntityFrameworkCore;
using BackendToyotaManagement.Data;
using BackendToyotaManagement.Models;

namespace BackendToyotaManagement.Data
{
    public class ToyotaDBContext : DbContext
    {
        public ToyotaDBContext(DbContextOptions<ToyotaDBContext> options) : base(options)
        {
        }

        public DbSet<Staff> Staff { get; set; }  // NhanVien -> Staff

        public DbSet<Car> Cars { get; set; }          // Xe -> Car

        public DbSet<Customer> Customers { get; set; }  // KhachHang -> Customer

        public DbSet<Order> Orders { get; set; }        // DonDatHang -> Order

        public DbSet<Dealer> Dealers { get; set; }       // DaiLy -> Dealer

        public DbSet<Maintenance> Maintenances { get; set; }  // BaoDuong -> Maintenance

        public DbSet<Authentication> Authentications { get; set; } // XacThuc -> Authentication

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Car>()
                .HasOne(car => car.Dealer)
                .WithMany(dealer => dealer.Car)
                .HasForeignKey(car => car.DealerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Customer>()
                .HasMany(customer => customer.Cars)
                .WithMany(car => car.Customers);

            modelBuilder.Entity<Order>()
                .HasOne(order => order.Customer)
                .WithMany(customer => customer.Orders)
                .HasForeignKey(order => order.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(order => order.Car)
                .WithMany(car => car.Orders)
                .HasForeignKey(order => order.CarId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Maintenance>()
                .HasOne(maintenance => maintenance.Customer)
                .WithOne()
                .HasForeignKey<Maintenance>(maintenance => maintenance.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Maintenance>()
                .HasOne(maintenance => maintenance.Staff)
                .WithMany()
                .HasForeignKey(maintenance => maintenance.EmployeeId)
                .OnDelete(DeleteBehavior.SetNull);

            // ... (remaining relationships can be similarly adjusted)
        }
    }
}
