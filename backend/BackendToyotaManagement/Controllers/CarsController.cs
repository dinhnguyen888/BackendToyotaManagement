using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BackendToyotaManagement.Data;
using BackendToyotaManagement.Models;

namespace BackendToyotaManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarsController : ControllerBase
    {
        private readonly ToyotaDBContext _context;

        public CarsController(ToyotaDBContext context)
        {
            _context = context;
        }

        // GET: api/Cars
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetCars()
        {
            return await _context.Cars.ToListAsync();
        }

        // GET: api/Cars/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> GetCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);

            if (car == null)
            {
                return NotFound();
            }

            return car;
        }

        // PUT: api/Cars/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCar(int id, [FromBody] CarDto carDto)
        {
            if (id != carDto.CarId)
            {
                return BadRequest();
            }

            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            // Map from CarDto to Car
            car.Goodwill = carDto.Goodwill;
            car.Price = carDto.Price;
            car.CarName = carDto.CarName;
            car.DealerId = carDto.DealerId;
            car.Specifications = carDto.Specifications;
            car.CarType = carDto.CarType;
            car.Thumbnail = carDto.Thumbnail;
            car.Description = carDto.Description;
            car.Quantity = carDto.Quantity;

            _context.Entry(car).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CarExists(id))
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

        // POST: api/Cars
        [HttpPost]
        public async Task<IActionResult> PostCar([FromBody] CarDto carDto)
        {
            // Check if DealerId exists in the Dealers table
            var dealerExists = await _context.Dealers.AnyAsync(d => d.DealerId == carDto.DealerId);
            if (!dealerExists)
            {
                return BadRequest("Invalid DealerId");
            }

            // Map from CarDto to Car
            var car = new Car
            {
                Goodwill = carDto.Goodwill,
                Price = carDto.Price,
                CarName = carDto.CarName,
                DealerId = carDto.DealerId,
                Specifications = carDto.Specifications,
                CarType = carDto.CarType,
                Thumbnail = carDto.Thumbnail,
                Description = carDto.Description,
                Quantity = carDto.Quantity
            };

            _context.Cars.Add(car);
            await _context.SaveChangesAsync();
            var response = new
            {
                Id = car.CarId,
                Thumbnail = car.Thumbnail
            };

            return CreatedAtAction(nameof(GetCar), new { id = car.CarId }, response);
        }

        // DELETE: api/Cars/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCar(int id)
        {
            var car = await _context.Cars.FindAsync(id);
            if (car == null)
            {
                return NotFound();
            }

            _context.Cars.Remove(car);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CarExists(int id)
        {
            return _context.Cars.Any(e => e.CarId == id);
        }
    }
}
