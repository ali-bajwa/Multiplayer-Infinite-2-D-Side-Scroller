
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Infinite_Sidescroller.Models
{
    public class PlayerSessionDBContext : DbContext
    {
        public PlayerSessionDBContext()
            : base("DefaultConnection")
        {

        }
        public DbSet<GameSession> sessions { get; set; }
        public DbSet<SessionScore> session_scores { get; set; }


    }
}