using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MyRecipes.Models
{
    public class RecipeStep
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int StepNo { get; set; }
        public string StepDesc { get; set; }
        public virtual int RecipeId { get; set; }
        public virtual RecipeModel Recipe { get; set; }
    }
}