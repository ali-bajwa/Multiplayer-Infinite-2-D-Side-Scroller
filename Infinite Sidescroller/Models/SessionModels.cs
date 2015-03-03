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
    [Table("SessionModels")]
    public class SessionModels
    {
        [Key]
        public int id { get; set; }
        public DateTime time_started { get; set; }
        public DateTime time_ended { get; set; }
        public bool coop { get; set; }
        public int progress { get; set; }
        public bool multi { get; set; }


    }



}