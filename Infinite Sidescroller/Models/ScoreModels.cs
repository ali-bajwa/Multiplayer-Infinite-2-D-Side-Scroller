using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.Entity;

namespace Infinite_Sidescroller.Models
{

    [Table("SessionScore")]
    public class ScoreModels
    {
        [Key]
        public int id { get; set; }
        public SessionModels session_id { get; set; }
        public ApplicationUser player_id { get; set; }
        public int score { get; set; }

    }


}