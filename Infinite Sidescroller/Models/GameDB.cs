using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class GameDB : DbContext
  {
    public GameDB()
      : base("DefaultConnection")
    {
      // Will throw error instead of creating a new table
      // for model without a matching table in db
      Database.SetInitializer<GameDB>(null);
    }

    public DbSet<ServerClient> ServerClient { get; set; }
  }
}