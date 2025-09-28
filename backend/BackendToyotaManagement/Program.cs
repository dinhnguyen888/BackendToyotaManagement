using BackendToyotaManagement.Data;
using Microsoft.EntityFrameworkCore;
var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ToyotaDBContext>(options => options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002"
               ).AllowAnyHeader().AllowAnyMethod();
        });
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors(MyAllowSpecificOrigins);
app.MapControllers();
//thêm vào để có thể fetch api từ react project
app.UseDefaultFiles();
app.UseStaticFiles();
// Kiểm tra kết nối với MySQL
using (var serviceScope = app.Services.CreateScope())
{
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<ToyotaDBContext>();

    try
    {
        // Thử kết nối
        var canConnect = dbContext.Database.CanConnect();
        if (canConnect)
        {
            Console.WriteLine("Ket noi thanh cong den CSDL MySQL!");
        }
        else
        {
            Console.WriteLine("Khong the ket noi den CSDL MySQL!");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Lỗi kết nối: " + ex.Message);
    }
}

app.Run();