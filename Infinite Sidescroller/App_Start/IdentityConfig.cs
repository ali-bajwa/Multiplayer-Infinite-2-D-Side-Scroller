using System.Linq;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using System.Web;

namespace Infinite_Sidescroller.Models
{
	// Configuration for Application User Manager (based off of default Identity implementation)
	public class ApplicationUserManager : UserManager<ApplicationUser>
	{
		private UserStore<ApplicationUser> Store_;
		public UserStore<ApplicationUser> Store
		{
			get { return Store_; }
		}

		public ApplicationUserManager(UserStore<ApplicationUser> store)
			: base(store)
		{
			this.Store_ = store;
		}

		// Creates an application user and defines constraints on username/password
		public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
		{
			var manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));

			// Set validation logic for usernames
			manager.UserValidator = new UserValidator<ApplicationUser>(manager)
			{
				AllowOnlyAlphanumericUserNames = false,
				RequireUniqueEmail = false
			};

			// Set validation logic for passwords
			manager.PasswordValidator = new PasswordValidator
			{
				RequiredLength = 6,
				RequireNonLetterOrDigit = false,
				RequireDigit = true,
				RequireLowercase = true,
				RequireUppercase = true,
			};

			// Set user lockout defaults
			manager.UserLockoutEnabledByDefault = true;
			manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(30);
			manager.MaxFailedAccessAttemptsBeforeLockout = 5;

			// Set hashing method for password protection
			var dataProtectionProvider = options.DataProtectionProvider;
			if (dataProtectionProvider != null)
			{
				manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
			}
			return manager;
		}

		// Prevents teardown of database on application initialization
		public class ApplicationDbInitializer : DropCreateDatabaseIfModelChanges<ApplicationDbContext>
		{
			protected override void Seed(ApplicationDbContext context)
			{
				base.Seed(context);
			}
		}

		public enum SignInStatus
		{
			Success,
			Failure
		}

		// Class to help authentication
		public class SignInHelper
		{
			public SignInHelper(ApplicationUserManager userManager, IAuthenticationManager authManager)
			{
				UserManager = userManager;
				AuthenticationManager = authManager;
			}

			public ApplicationUserManager UserManager { get; private set; }
			public IAuthenticationManager AuthenticationManager { get; private set; }

			public async Task SignInAsync(ApplicationUser user, bool isPersistent, bool rememberBrowser)
			{
				// Clear any partial cookies
				AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie, DefaultAuthenticationTypes.TwoFactorCookie);

				var userIdentity = await user.GenerateUserIdentityAsync(UserManager);
				if (rememberBrowser)
				{
					var rememberBrowserIdentity = AuthenticationManager.CreateTwoFactorRememberBrowserIdentity(user.Id);
					AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, userIdentity, rememberBrowserIdentity);
				}
				else
				{
					AuthenticationManager.SignIn(new AuthenticationProperties { IsPersistent = isPersistent }, userIdentity);
				}
			}

			// Password signin since we're only using local accounts
			public async Task<SignInStatus> PasswordSignIn(string userName, string password, bool isPersistent, bool shouldLockout)
			{
				var user = await UserManager.FindByNameAsync(userName);
				if (user == null)
				{
					return SignInStatus.Failure;
				}
				await SignInAsync(user, isPersistent, false);
				return SignInStatus.Success;
			}
		}
	}
}