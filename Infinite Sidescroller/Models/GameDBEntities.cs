using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  [Table("dbo.GameSession")]
  public class GameSessions
  {
    [Key]
    public int Id { get; set; }
    // Type = 1 OR TRUE => Multiplayer -- Type = 0 or FALSE => Singleplayer
    public bool Type { get; set; }
    public bool IsStarted { get; set; }
    public bool IsCompleted { get; set; }
    public string HostUsername { get; set; }
    public string PlayerNames { get; set; }
    public int Score { get; set; }
    public GameSessions() {
      this.Type = false;
      this.IsStarted = false;
      this.IsCompleted = false;
      this.Score = 0;
    }
  }
}