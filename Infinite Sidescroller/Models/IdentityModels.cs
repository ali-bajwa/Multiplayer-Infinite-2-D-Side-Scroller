using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Infinite_Sidescroller.Models
{
  public class ApplicationUser : IdentityUser
  {
		// Add more user properties down here - currently we only need Alias
    public string Alias { get; set; }

    public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
    {
      var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);

      return userIdentity;
    }
  }

  public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
  {
    public ApplicationDbContext()
			: base("DefaultConnection")
    {
    }

    static ApplicationDbContext()
    {
      // Set the database intializer which is run once during application start
      Database.SetInitializer<ApplicationDbContext>(new Infinite_Sidescroller.Models.ApplicationUserManager.ApplicationDbInitializer());
    }

    public static ApplicationDbContext Create()
    {
      return new ApplicationDbContext();
    }
  }
}