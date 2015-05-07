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
      : base("GameCS")
    {
      Database.SetInitializer<GameDB>(null);
    }

    public DbSet<GameSessions> GameSession { get; set; }
  }
}