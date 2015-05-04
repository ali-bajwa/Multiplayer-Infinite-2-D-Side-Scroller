using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class GameSession
  {
    [Key]
    public int Id { get; set; }
    public string Type { get; set; }
    public bool IsStarted { get; set; }
    public bool IsCompleted { get; set; }

    public GameSession() { }
  }
  [Table("dbo.Leaderboard")]
  public class Leaderboard
  {
    [Key]
    public int Id { get; set; }
    public int SessionID { get; set; }
    public int Score { get; set; }
    public string Usernames { get; set; }
    public bool GameType { get; set; }

    public Leaderboard() { }
  }

  public class GameSessionxUser
  {
    [Key]
    public int Id { get; set; }
    public int SessionID { get; set; }
    public string Username { get; set; }
    public bool IsHost { get; set; }

    public GameSessionxUser() { }
  }
}