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
    public class MaintenancesController : ControllerBase
    {
        private readonly ToyotaDBContext _context;

        public MaintenancesController(ToyotaDBContext context)
        {
            _context = context;
        }

        // GET: api/Maintenances
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceDto>>> GetMaintenances()
        {
            return await _context.Maintenances
                .Select(m => new MaintenanceDto
                {
                    CustomerId = m.CustomerId,
                    EmployeeId = m.EmployeeId,
                    OrderId = m.OrderId
                })
                .ToListAsync();
        }

        // GET: api/Maintenances/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceDto>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances
                .Select(m => new MaintenanceDto
                {
                    CustomerId = m.CustomerId,
                    EmployeeId = m.EmployeeId,
                    OrderId = m.OrderId
                })
                .FirstOrDefaultAsync(m => m.CustomerId == id);

            if (maintenance == null)
            {
                return NotFound();
            }

            return maintenance;
        }

        // PUT: api/Maintenances/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaintenance(int id, MaintenanceDto maintenanceDTO)
        {
            if (id != maintenanceDTO.CustomerId)
            {
                return BadRequest();
            }

            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null)
            {
                return NotFound();
            }

            maintenance.CustomerId = maintenanceDTO.CustomerId;
            maintenance.EmployeeId = maintenanceDTO.EmployeeId;
            maintenance.OrderId = maintenanceDTO.OrderId;

            _context.Entry(maintenance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceExists(id))
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

        // POST: api/Maintenances
        [HttpPost]
        public async Task<ActionResult<MaintenanceDto>> PostMaintenance(MaintenanceDto maintenanceDTO)
        {
            var maintenance = new Maintenance
            {
                CustomerId = maintenanceDTO.CustomerId,
                EmployeeId = maintenanceDTO.EmployeeId,
                OrderId = maintenanceDTO.OrderId
            };

            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaintenance", new { id = maintenance.CustomerId }, maintenanceDTO);
        }

        // DELETE: api/Maintenances/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null)
            {
                return NotFound();
            }

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceExists(int id)
        {
            return _context.Maintenances.Any(e => e.CustomerId == id);
        }
    }
}
