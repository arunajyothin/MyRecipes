using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace MyRecipes.Models
{
    public class RecipeModel
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string RecipeName { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string PreparationTime { get; set; }
        [Required]
        public string CookingTime { get; set; }
        public string videoUrl { get; set; }
        public virtual List<RecipeStep> RecipeSteps { get; set; }
        public virtual List<RecipeIngredient> RecipeIngredient { get; set; }



    }
}