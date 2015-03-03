using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Infinite_Sidescroller.Views
{
	public class GameController : Controller
	{
		// GET: Game
		public ActionResult Index()
		{
			return View();
		}
	}
}