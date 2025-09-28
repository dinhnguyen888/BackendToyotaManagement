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
    public class DealersController : ControllerBase
    {
        private readonly ToyotaDBContext _context;

        public DealersController(ToyotaDBContext context)
        {
            _context = context;
        }

        // GET: api/Dealers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DealerDto>>> GetDealers()
        {
            var dealers = await _context.Dealers.ToListAsync();
            var dealerDTOs = dealers.Select(dl => new DealerDto
            {
                DealerId = dl.DealerId,
                DealerName = dl.DealerName,
                Address = dl.Address,
                Email = dl.Email,
                PhoneNumber = dl.PhoneNumber
            }).ToList();
            return dealerDTOs;
        }

        // GET: api/Dealers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DealerDto>> GetDealer(int id)
        {
            var dealer = await _context.Dealers.FindAsync(id);

            if (dealer == null)
            {
                return NotFound();
            }

            var dealerDTO = new DealerDto
            {
                DealerId = dealer.DealerId,
                DealerName = dealer.DealerName,
                Address = dealer.Address,
                Email = dealer.Email,
                PhoneNumber = dealer.PhoneNumber
            };

            return dealerDTO;
        }

        // PUT: api/Dealers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDealer(int id, DealerDto dealerDTO)
        {
            if (id != dealerDTO.DealerId)
            {
                return BadRequest();
            }

            var dealer = new Dealer
            {
                DealerId = dealerDTO.DealerId,
                DealerName = dealerDTO.DealerName,
                Address = dealerDTO.Address,
                Email = dealerDTO.Email,
                PhoneNumber = dealerDTO.PhoneNumber
            };

            _context.Entry(dealer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DealerExists(id))
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

        // POST: api/Dealers
        [HttpPost]
        public async Task<ActionResult<DealerDto>> PostDealer(DealerDto dealerDTO)
        {
            var dealer = new Dealer
            {
                DealerName = dealerDTO.DealerName,
                Address = dealerDTO.Address,
                Email = dealerDTO.Email,
                PhoneNumber = dealerDTO.PhoneNumber
            };

            _context.Dealers.Add(dealer);
            await _context.SaveChangesAsync();

            dealerDTO.DealerId = dealer.DealerId;

            return CreatedAtAction(nameof(GetDealer), new { id = dealerDTO.DealerId }, dealerDTO);
        }

        // DELETE: api/Dealers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDealer(int id)
        {
            var dealer = await _context.Dealers.FindAsync(id);
            if (dealer == null)
            {
                return NotFound();
            }

            _context.Dealers.Remove(dealer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DealerExists(int id)
        {
            return _context.Dealers.Any(e => e.DealerId == id);
        }
    }
}
