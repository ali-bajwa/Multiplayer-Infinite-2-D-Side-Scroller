using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class LobbyViewModel
  {
    public List<GameSessions> LobbyGames { get; set; }

    public LobbyViewModel() { }
  }
}