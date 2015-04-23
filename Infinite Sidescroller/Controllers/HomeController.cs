using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Infinite_Sidescroller.Controllers
{
  public class HomeController : Controller
  {
    // GET: Homepage
    public ActionResult Index()
    {
      return View();
    }

    // GET: /Tutorial
    public ActionResult Tutorial()
    {
      return View();
    }

    // GET: /Leaderboard
    public ActionResult Leaderboard()
    {
      return View();
    }
  }
}