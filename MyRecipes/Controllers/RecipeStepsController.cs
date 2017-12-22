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
    public class RecipeStepsController : Controller
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: RecipeSteps
        public ActionResult Index()
        {
            var recipeSteps = db.RecipeSteps.Include(r => r.Recipe);
            return View(recipeSteps.ToList());
        }

        // GET: RecipeSteps/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RecipeStep recipeStep = db.RecipeSteps.Find(id);
            if (recipeStep == null)
            {
                return HttpNotFound();
            }
            return View(recipeStep);
        }

        // GET: RecipeSteps/Create
        public ActionResult Create()
        {
            ViewBag.RecipeId = new SelectList(db.RecipeModels, "Id", "Description");
            return View();
        }

        // POST: RecipeSteps/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,StepNo,StepDesc,RecipeId")] RecipeStep recipeStep)
        {
            if (ModelState.IsValid)
            {
                db.RecipeSteps.Add(recipeStep);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.RecipeId = new SelectList(db.RecipeModels, "Id", "Description", recipeStep.RecipeId);
            return View(recipeStep);
        }

        // GET: RecipeSteps/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RecipeStep recipeStep = db.RecipeSteps.Find(id);
            if (recipeStep == null)
            {
                return HttpNotFound();
            }
            ViewBag.RecipeId = new SelectList(db.RecipeModels, "Id", "Description", recipeStep.RecipeId);
            return View(recipeStep);
        }

        // POST: RecipeSteps/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see https://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,StepNo,StepDesc,RecipeId")] RecipeStep recipeStep)
        {
            if (ModelState.IsValid)
            {
                db.Entry(recipeStep).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.RecipeId = new SelectList(db.RecipeModels, "Id", "Description", recipeStep.RecipeId);
            return View(recipeStep);
        }

        // GET: RecipeSteps/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            RecipeStep recipeStep = db.RecipeSteps.Find(id);
            if (recipeStep == null)
            {
                return HttpNotFound();
            }
            return View(recipeStep);
        }

        // POST: RecipeSteps/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            RecipeStep recipeStep = db.RecipeSteps.Find(id);
            db.RecipeSteps.Remove(recipeStep);
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
