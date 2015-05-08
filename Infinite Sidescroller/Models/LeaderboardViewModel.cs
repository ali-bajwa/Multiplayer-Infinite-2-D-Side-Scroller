using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class LeaderboardViewModel
  {
    public List<GameSessions> SinglePlayer { get; set; }
    public List<GameSessions> Multiplayer { get; set; }

    public LeaderboardViewModel() { }
  }
}