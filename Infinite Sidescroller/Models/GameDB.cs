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

    public DbSet<Leaderboard> Leaderboard { get; set; }
    public DbSet<GameSession> GameSession { get; set; }
    public DbSet<GameSessionxUser> GameSessionxUser { get; set; }
  }
}