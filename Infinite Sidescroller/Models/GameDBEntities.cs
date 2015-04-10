using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Infinite_Sidescroller.Models
{
  public class ServerClient
  {
    // Possibly change Id to a double-key with session/packetid as primary keys
    [Key]
    public int Id {get; set;}
    public int SessionID {get; set;}
    public string JsonString {get; set;}
    public int PacketID { get; set; }

    public ServerClient(int sessionid, string jsonstring, int packetid)
    {
      this.SessionID = sessionid;
      this.JsonString = jsonstring;
      this.PacketID = packetid;
    }
  }
}