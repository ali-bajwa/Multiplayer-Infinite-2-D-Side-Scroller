using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace Infinite_Sidescroller
{
  public class AjaxOnlyAttribute : ActionMethodSelectorAttribute
  {
    public override bool IsValidForRequest(ControllerContext controllerContext, System.Reflection.MethodInfo methodInfo)
    {
      return controllerContext.RequestContext.HttpContext.Request.IsAjaxRequest();
    }
  }
	public class Utility
	{
		
	}
}