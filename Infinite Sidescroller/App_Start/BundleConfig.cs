using System.Web;
using System.Web.Optimization;

namespace Infinite_Sidescroller
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
									"~/Scripts/jquery-{version}.js",
									"~/Scripts/utility.js"));

      bundles.Add(new ScriptBundle("~/bundles/gamescripts").Include(
        "~/GameCode/bundle.js",
        "~/GameCode/lib/jquery-1.11.2.min.js",
        "~/GameCode/lib/createjs-2014.12.12.min.js",
        "~/GameCode/lib/qunit-1.17.1.js"
        ));

			bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
									"~/Scripts/jquery.validate*"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
								"~/Content/global.css"));
		}
	}
}
