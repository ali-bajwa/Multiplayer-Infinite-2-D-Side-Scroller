using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Infinite_Sidescroller.Models;

namespace Infinite_Sidescroller.Controllers
{
  public class HomeController : Controller
  {
    GameDB GameDB = new GameDB();

    // GET: Homepage
    public ActionResult Index()
    {
      return View();
    }

    // GET: /Bestiary
    public ActionResult Bestiary()
    {
      return View();
    }

    // GET: /Leaderboard
    public ActionResult Leaderboard()
    {
      List<GameScore> Highscores = GameDB.GameScore.OrderByDescending(entry => entry.Score).Take(10).ToList();
      LeaderboardViewModel model = new LeaderboardViewModel();
      model.Highscores = Highscores;

      return View(model);
    }
  }
}