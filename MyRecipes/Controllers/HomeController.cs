using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyRecipes.Models;
using Newtonsoft.Json;

namespace MyRecipes.Controllers
{
    public class HomeController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        public ActionResult Index()
        {
            var allRecipes = db.RecipeModels.OrderBy(x => x.RecipeName).ToList();
            if (Request.IsAjaxRequest())
            {
                var jsonString = JsonConvert.SerializeObject(allRecipes, Formatting.Indented,
                    new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                return Content(jsonString);
            }
            return View(allRecipes);
        }

        [HttpPost]
        public ActionResult AddNewRecipe(RecipeModel recipeModel)
        {
            if (ModelState.IsValid)
            {
                if (!String.IsNullOrWhiteSpace(recipeModel.videoUrl))
                {
                    recipeModel.videoUrl = recipeModel.videoUrl.Replace("watch?v=", "embed/");
                }
                db.RecipeModels.Add(recipeModel);
                foreach(RecipeIngredient recipeIngredient in recipeModel.RecipeIngredient)
                {
                    if (!String.IsNullOrWhiteSpace(recipeIngredient.Quantity)
                        && !String.IsNullOrWhiteSpace(recipeIngredient.Ingredient))
                    {
                        db.RecipeIngredients.Add(recipeIngredient);
                    }
                }

                foreach (RecipeStep recipeStep in recipeModel.RecipeSteps)
                {
                    if (!String.IsNullOrWhiteSpace(recipeStep.StepDesc))
                    {
                        db.RecipeSteps.Add(recipeStep);
                    }
                }

                db.SaveChanges();
            }

            var reloadedItem = db.RecipeModels
                                            .FirstOrDefault(x => x.Id == recipeModel.Id);
            var jsonString = JsonConvert.SerializeObject(reloadedItem, Formatting.Indented,
                new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return Content(jsonString);
        }

        [HttpPost]
        public ActionResult DeleteRecipe(int id)
        {
            RecipeModel recipeModel = db.RecipeModels.Find(id);
            db.RecipeModels.Remove(recipeModel);
            db.SaveChanges();
           
            var jsonString = JsonConvert.SerializeObject("", Formatting.Indented,
                new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return Content(jsonString);
            
        }
        [HttpGet]
        public ActionResult Edit(int id)
        {
            RecipeModel recipeModel = db.RecipeModels.Find(id);

            var jsonString = JsonConvert.SerializeObject(recipeModel, Formatting.Indented,
                new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            return Content(jsonString);

        }
        [HttpPost]
        public ActionResult Edit(RecipeModel recipe)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    foreach (RecipeIngredient recipeIngredient in recipe.RecipeIngredient)
                    {
                        recipeIngredient.RecipeId = recipe.Id;

                    }

                    foreach (RecipeStep recipeStep in recipe.RecipeSteps)
                    {
                        recipeStep.RecipeId = recipe.Id;

                    }
                    db.Entry(recipe).State = EntityState.Modified;

                    foreach (RecipeIngredient recipeIngredient in recipe.RecipeIngredient)
                    {
                        if (!String.IsNullOrWhiteSpace(recipeIngredient.Quantity)
                            && !String.IsNullOrWhiteSpace(recipeIngredient.Ingredient))
                        {
                             if(recipeIngredient.Id ==0)
                            {
                                db.RecipeIngredients.Add(recipeIngredient);
                            } else
                            {
                                db.Entry(recipeIngredient).State = EntityState.Modified;
                            }
                        }
                    }

                    foreach (RecipeStep recipeStep in recipe.RecipeSteps)
                    {
                        if (!String.IsNullOrWhiteSpace(recipeStep.StepDesc))
                        {
                            if (recipeStep.Id == 0)
                            {
                                db.RecipeSteps.Add(recipeStep);
                            }
                            else
                            {
                                db.Entry(recipeStep).State = EntityState.Modified;
                            }
                        }
                    }
                    db.SaveChanges();
                }

                var jsonString = JsonConvert.SerializeObject(recipe, Formatting.Indented,
                    new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                return Content(jsonString);
            } catch (Exception e)
            {
                var jsonString = JsonConvert.SerializeObject(e.Message, Formatting.Indented,
                    new JsonSerializerSettings { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
                return Content(jsonString);
            }
            
        }


    }
}