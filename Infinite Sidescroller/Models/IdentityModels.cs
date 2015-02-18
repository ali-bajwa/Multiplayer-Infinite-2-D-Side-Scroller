using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infinite_Sidescroller.Models
{
  // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
  public class ApplicationUser : IdentityUser
  {
      [StringLength(250)]
      public string alias { get; set; }
      [StringLength(250)]
      public string image_path { get; set; }
  }

  public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
  {
    public ApplicationDbContext()
          : base("DefaultConnection", throwIfV1Schema: false)
      {
      }
  }
}