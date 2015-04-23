using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Infinite_Sidescroller.Models;
using System.Web.Script.Serialization;

namespace Infinite_Sidescroller.Controllers
{
	public class GameController : Controller
	{
    GameDB GameDB = new GameDB();
 
		// GET: Game
		public ActionResult Index()
		{
			return View();
		}

    [AjaxOnly]
    public ActionResult SaveScore(int sessionid, string userid, int score)
    {
      GameScore ScoreEntry = new GameScore(sessionid, userid, score);
      GameDB.GameScore.Add(ScoreEntry);
      if (HttpContext.Request.IsAjaxRequest())
      {
        var serializer = new JavaScriptSerializer();
        serializer.MaxJsonLength = Int32.MaxValue;
        var result = new ContentResult
        {
          Content = serializer.Serialize(ScoreEntry),
          ContentType = "application/json"
        };

        return (result);
      }

      return View(); // this line will never execute
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

    }*/
	}
}