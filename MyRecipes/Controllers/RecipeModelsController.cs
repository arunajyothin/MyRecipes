using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using MyRecipes.Models;

namespace MyRecipes.Controllers
{
    public class RecipeModelsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: RecipeModels
        public ActionResult Index()
        {
            return View(db.RecipeModels.ToList());
        }

        // GET: RecipeModels/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RecipeModel recipeModel = db.RecipeModels.Find(id);
            if (recipeModel == null)
            {
                return HttpNotFound();
            }
            return View(recipeModel);
        }

        // GET: RecipeModels/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: RecipeModels/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,RecipeName,Description,PreparationTime,CookingTime,videoUrl,AuthorEmail,AuthorUserName")] RecipeModel recipeModel)
        {
            if (ModelState.IsValid)
            {
                db.RecipeModels.Add(recipeModel);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(recipeModel);
        }

        // GET: RecipeModels/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RecipeModel recipeModel = db.RecipeModels.Find(id);
            if (recipeModel == null)
            {
                return HttpNotFound();
            }
            return View(recipeModel);
        }

        // POST: RecipeModels/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,RecipeName,Description,PreparationTime,CookingTime,videoUrl,AuthorEmail,AuthorUserName")] RecipeModel recipeModel)
        {
            if (ModelState.IsValid)
            {
                db.Entry(recipeModel).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(recipeModel);
        }

        // GET: RecipeModels/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RecipeModel recipeModel = db.RecipeModels.Find(id);
            if (recipeModel == null)
            {
                return HttpNotFound();
            }
            return View(recipeModel);
        }

        // POST: RecipeModels/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            RecipeModel recipeModel = db.RecipeModels.Find(id);
            db.RecipeModels.Remove(recipeModel);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
