using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Infinite_Sidescroller.Models;

namespace Infinite_Sidescroller.Controllers
{
 	public class GameController : Controller
	{
     //GameDB GameDB = new GameDB();
 
		// GET: Game
		public ActionResult Index()
		{
			return View();
		}

/*  
    [AjaxOnly]
    public ActionResult setJsonInfo(int sessionid, string jsonstring, int packetid)
    {
      bool result = false;
      ServerClient newentry = new ServerClient(sessionid, jsonstring, packetid);

      GameDB.ServerClient.Add(newentry);

      return View(result);
    }
  

    public ActionResult getJsonInfo(int sessionid, int? packetid) 
    {

    }
 */ 
	} 
}