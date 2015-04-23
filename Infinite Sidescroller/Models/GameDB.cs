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
      Database.SetInitializer<GameDB>(null);
    }

    public DbSet<GameScore> GameScore { get; set; }
  }
}