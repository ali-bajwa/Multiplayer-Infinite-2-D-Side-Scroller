using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Infinite_Sidescroller.Startup))]
namespace Infinite_Sidescroller
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
