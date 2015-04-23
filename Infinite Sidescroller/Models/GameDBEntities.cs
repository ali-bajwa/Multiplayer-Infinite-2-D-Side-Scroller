using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class GameScore
  {
    // Possibly change Id to a double-key with session/packetid as primary keys
    [Key]
    public int Id {get; set;}
    public int SessionID {get; set;}
    public string UserID {get; set;}
    public int Score { get; set; }

    public GameScore(int sessionid, string userid, int score)
    {
      this.SessionID = sessionid;
      this.UserID = userid;
      this.Score = score;
    }
    public GameScore()
    {

    }
  }
}