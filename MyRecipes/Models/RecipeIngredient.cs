using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MyRecipes.Models
{
    public class RecipeIngredient
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Quantity { get; set; }
        public string Ingredient { get; set; }
        public virtual int RecipeId { get; set; }
        public virtual RecipeModel Recipe { get; set; }
    }
}