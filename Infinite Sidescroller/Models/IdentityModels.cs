using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Infinite_Sidescroller.Models
{
  public class ApplicationUser : IdentityUser
  {
    // Add more user properties down here

    public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager)
    {
      var userIdentity = await manager.CreateIdentityAsync(this, DefaultAuthenticationTypes.ApplicationCookie);

      return userIdentity;
    }
  }

  public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
  {
      public ApplicationDbContext()
      : base("GameCS2", throwIfV1Schema: false)
      {
      }

      public static ApplicationDbContext Create()
      {
          return new ApplicationDbContext();
      }
  }
}