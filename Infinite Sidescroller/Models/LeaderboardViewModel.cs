using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class LeaderboardEntry
  {
    public List<string> Usernames { get; set; }
    public int Score { get; set; }

    public LeaderboardEntry(List<string> usernames, int score)
    {
      this.Usernames = usernames;
      this.Score = score;
    }
    public LeaderboardEntry() { }
  }
  public class LeaderboardViewModel
  {
    public List<Leaderboard> SinglePlayer { get; set; }
    public List<Leaderboard> Multiplayer { get; set; }

    public LeaderboardViewModel() { }
  }
}