using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendToyotaManagement.Data;
using BackendToyotaManagement.Models;

namespace BackendToyotaManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ToyotaDBContext _context;

        public OrdersController(ToyotaDBContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .Include(o => o.Car)
                .Select(o => new OrderDto
                {
                    OrderId = o.OrderId,
                    CustomerId = o.CustomerId,
                    CarId = o.CarId,
                    OrderDate = o.OrderDate,
                    Deposit = o.Deposit,
                    WarrantyPolicy = o.WarrantyPolicy,
                    TotalCost = o.TotalCost,
                    Quantity = o.Quantity,
                    OrderStatus = o.OrderStatus,
                    Car = new CarDto
                    {
                        CarId = o.Car.CarId,
                        Price = o.Car.Price,
                        CarName = o.Car.CarName,
                        DealerId = o.Car.DealerId,
                        Specifications = o.Car.Specifications,
                        CarType = o.Car.CarType,
                        Thumbnail = o.Car.Thumbnail,
                        Description = o.Car.Description,
                        Quantity = o.Car.Quantity
                    }
                })
                .ToListAsync();
        }

        // GET: api/Orders/customer/{customerId}
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrdersByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Include(o => o.Car)
                .Where(o => o.CustomerId == customerId)
                .Select(o => new OrderDto
                {
                    OrderId = o.OrderId,
                    CustomerId = o.CustomerId,
                    CarId = o.CarId,
                    OrderDate = o.OrderDate,
                    Deposit = o.Deposit,
                    WarrantyPolicy = o.WarrantyPolicy,
                    TotalCost = o.TotalCost,
                    Quantity = o.Quantity,
                    OrderStatus = o.OrderStatus,
                    Car = new CarDto
                    {
                        CarId = o.Car.CarId,
                        Price = o.Car.Price,
                        CarName = o.Car.CarName,
                        DealerId = o.Car.DealerId,
                        Specifications = o.Car.Specifications,
                        CarType = o.Car.CarType,
                        Thumbnail = o.Car.Thumbnail,
                        Description = o.Car.Description,
                        Quantity = o.Car.Quantity
                    }
                })
                .ToListAsync();

            if (!orders.Any())
            {
                return NotFound();
            }

            return orders;
        }

        // PUT: api/Orders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, OrderDto orderDto)
        {
            if (id != orderDto.OrderId)
            {
                return BadRequest();
            }

            var order = await _context.Orders.Include(o => o.Car).FirstOrDefaultAsync(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            order.CustomerId = orderDto.CustomerId;
            order.CarId = orderDto.CarId;
            order.OrderDate = orderDto.OrderDate;
            order.Deposit = orderDto.Deposit;
            order.WarrantyPolicy = orderDto.WarrantyPolicy;
            order.TotalCost = orderDto.TotalCost;
            order.Quantity = orderDto.Quantity;
            order.OrderStatus = orderDto.OrderStatus;

            if (order.Car != null)
            {
                order.Car.Price = orderDto.Car.Price;
                order.Car.CarName = orderDto.Car.CarName;
                order.Car.DealerId = orderDto.Car.DealerId;
                order.Car.Specifications = orderDto.Car.Specifications;
                order.Car.CarType = orderDto.Car.CarType;
                order.Car.Thumbnail = orderDto.Car.Thumbnail;
                order.Car.Description = orderDto.Car.Description;
                order.Car.Quantity = orderDto.Car.Quantity;
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OrderExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<OrderDto>> PostOrder(OrderDto orderDto)
        {
            var order = new Order
            {
                CustomerId = orderDto.CustomerId,
                CarId = orderDto.CarId,
                OrderDate = orderDto.OrderDate,
                Deposit = orderDto.Deposit,
                WarrantyPolicy = orderDto.WarrantyPolicy,
                TotalCost = orderDto.TotalCost,
                Quantity = orderDto.Quantity,
                OrderStatus = orderDto.OrderStatus
            };

            var car = await _context.Cars.FindAsync(orderDto.CarId);
            if (car != null)
            {
                order.Car = car;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            orderDto.OrderId = order.OrderId;

            orderDto.Car = new CarDto
            {
                CarId = order.Car.CarId,
                Price = order.Car.Price,
                CarName = order.Car.CarName,
                DealerId = order.Car.DealerId,
                Specifications = order.Car.Specifications,
                CarType = order.Car.CarType,
                Thumbnail = order.Car.Thumbnail,
                Description = order.Car.Description,
                Quantity = order.Car.Quantity
            };

            return CreatedAtAction("GetOrder", new { id = order.OrderId }, orderDto);
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.Car).FirstOrDefaultAsync(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { Quantity = order.Quantity, Price = order.Car.Price });
        }

        private bool OrderExists(int id)
        {
            return _context.Orders.Any(e => e.OrderId == id);
        }
    }
}
