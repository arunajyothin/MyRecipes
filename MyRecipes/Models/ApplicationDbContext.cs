using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace MyRecipes.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }
        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public System.Data.Entity.DbSet<MyRecipes.Models.RecipeModel> RecipeModels { get; set; }

        public System.Data.Entity.DbSet<MyRecipes.Models.RecipeStep> RecipeSteps { get; set; }

        public System.Data.Entity.DbSet<MyRecipes.Models.RecipeIngredient> RecipeIngredients { get; set; }
    }
}