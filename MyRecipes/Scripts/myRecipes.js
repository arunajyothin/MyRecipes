var allRecipes;
$(function () {

    //for create new recipe
    //jQuery time
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(document.body).on('click', '.next', function () {
        if ($(this).hasClass("nextRecipeModel")) {
            if (!validateRecipeModel()) {
                return false;
            }
        }

        if ($(this).hasClass("nextIngredient")) {
            if (!validateIngredients()) {
                return false;
            }
        }


        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50) + "%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({
                    'transform': 'scale(' + scale + ')',
                    'position': 'absolute'
                });
                next_fs.css({ 'left': left, 'opacity': opacity });
            },
            duration: 800,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });


    $(document.body).on('click', '.previous', function () {
        if (animating) return false;
        animating = true;

        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        //de-activate current step on progressbar
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

        //show the previous fieldset
        previous_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale previous_fs from 80% to 100%
                scale = 0.8 + (1 - now) * 0.2;
                //2. take current_fs to the right(50%) - from 0%
                left = ((1 - now) * 50) + "%";
                //3. increase opacity of previous_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({ 'left': left });
                previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
            },
            duration: 800,
            complete: function () {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    });

    $("#newRecipeDiv").hide();

    //fetch all recipes from the database on load of the recipe
    $.ajax({
        url: "/home/index/",
        dataType: 'json',
        contentType: 'application/json',
        data: {

        },
        method: 'GET'
    }).done(function (responseJSON, status, xhr) {
        allRecipes = responseJSON;
        displayRecipes();

        //set the values for search box
        var availableTags = [];
        allRecipes.forEach(function (item, index) {
            availableTags.push(item.RecipeName);
        });

        $("#searchRecipe").autocomplete({
            source: availableTags
        });

        //add recipes
        $("#addRecipe").click(function () {
            $("#allRecipes").hide();
            $("#newRecipeDiv").show();
        });

        $(document.body).on('click', '.addIngredient', function () {
            if (checkEmptyRow()) {
                return false;
            } else {
                var lastIngredientRow = $(this).parent().children("div").last().attr("id");
                var lastIngredientRowNumber = lastIngredientRow.substring(13, lastIngredientRow.length);
                var currentIngredientRowNumber = parseInt(lastIngredientRowNumber) + 1;
                var newIngredientRow = '<div id="NewIngredient' + currentIngredientRowNumber + '">'
                    + '<input type="text" id="Quantity' + currentIngredientRowNumber + '" placeholder="Quantity" style="width:40%" />'
                    + ' <input type="text" id="IngredientName' + currentIngredientRowNumber + '" placeholder="Ingredient" style="width:40%" />'
                    + '</div>';
                $(this).before(newIngredientRow);
            }
        });

            $(document.body).on('click', '.editAddIngredient', function () {
                if (checkEmptyRowEdit($(this).parent().attr("id"))) {
                    return false;
                } else {
                    var lastIngredientRow = $(this).parent().children("div").last().attr("id");
                    var lastIngredientRowNumber = lastIngredientRow.substring(14, lastIngredientRow.length);
                    var currentIngredientRowNumber = parseInt(lastIngredientRowNumber) + 1;
                    var newIngredientRow = '<div id="EditIngredient' + currentIngredientRowNumber + '">'
                        + '<input type="text" id="EditQuantity' + currentIngredientRowNumber + '" placeholder="Quantity" style="width:40%" />'
                        + ' <input type="text" id="EditIngredientName' + currentIngredientRowNumber + '" placeholder="Ingredient" style="width:40%" />'
                        + '</div>';
                    $(this).before(newIngredientRow);
                }

            });

            $("#addStep").click(function () {
                if (checkEmptyStep()) {
                    return false;
                } else {
                    var lastStep = $(this).parent().children("textarea").last().attr("id");
                    var lastStepNumber = lastStep.substring(4, lastStep.length);
                    var currentStepNumber = parseInt(lastStepNumber) + 1;
                    var newStep = '<textarea name="Step" placeholder="Step ' + currentStepNumber + '" id="Step' + currentStepNumber + '"></textarea>';
                    $(this).before(newStep);
                }
            });
            $(document.body).on('click', '#addEditStep', function () {
                if (checkEmptyStepEdit($(this).parent().attr("id"))) {
                    return false;
                } else {
                    var lastStep = $(this).parent().children("textarea").last().attr("id");
                    var lastStepNumberName = $(this).parent().children("textarea").last().attr("name");
                    var lastStepNumber = lastStepNumberName.substring(8, lastStepNumberName.length);
                    var currentStepNumber = parseInt(lastStepNumber) + 1;
                    var newStep = '<textarea name="EditStep' + currentStepNumber + '" placeholder="Step ' + currentStepNumber + '"></textarea>';
                    $(this).before(newStep);
                }
            });

            

            $("#submitNewRecipe").click(function () {
                validateSteps();
                createNewRecipe();
                return false;
            });

            $(document.body).on('click', '.submitEdit', function () {
                validateSteps();
                editRecipeAjaxCall($(this).attr("id"));
                return false;
            });

            $("#searchRecipes").click(function () {
                var recipeKeyWord = $("#searchRecipe").val();
                showSearchedRecipes(recipeKeyWord);
            })
        }).error(function (xhr, status, error) {
            $("#error").show();
        });

        //Click dropdown
        $(document.body).on('click', '.dropdown-recipe', function () {
            //get data-for attribute
            var dataFor = $(this).attr('data-for');
            var idFor = $(dataFor);

            //current button
            var currentButton = $(this);
            idFor.slideToggle(400, function () {
                //Completed slidetoggle
                if (idFor.is(':visible')) {
                    currentButton.html('<i class="icon-chevron-up text-muted"></i>');
                } else {
                    currentButton.html('<i class="icon-chevron-down text-muted"></i>');
                }
            })
        });

        $(document.body).on('click', '.delete', function () {
            var itemid = $(this).attr("id");
            var recipeName = $(this).parents("#recipeRow" + itemid.substring(6, itemid.length)).find("strong").text();
            if (confirm("Are you sure you want to delete " + recipeName + "?")) {
                deleteRecipe(itemid.substring(6, itemid.length));
            }
        });

        $(document.body).on('click', '.cancelNewRecipe', function () {
            $("#allRecipes").show();
            resetNewRecipeForm();
        });

        $(document.body).on('click', '.edit', function () {
            var itemid = $(this).attr("id");
            editRecipe(itemid);
        });
    });

function displayRecipes() {
    allRecipes.forEach(function (recipe, index) {
        var recipeItem = createRecipeListItem(recipe);
        $("#allRecipes").append(recipeItem);
    });

}

function createRecipeListItem(recipe) {
    var topRow = '<div  id="recipeRow' + recipe.Id + '"><div class="row-fluid user-row">' +
        '<div class="span11" >' +
        '<strong>' + recipe.RecipeName + '</strong> <br/>' +
        '<span class="text-muted">' + recipe.Description + '</span>' +
        '</div>' +
        '<div class="span1 dropdown-recipe pull-right" data-for=".' + recipe.Id + '">' +
        ' <i class="icon-chevron-down text-muted"></i>' +
        '</div>' +
        '</div >';

    var panelContent = '<div class="row-fluid ' + recipe.Id + '" style="display: none;">' +
        '<div class="span10 offset1">' +
        '<div class="panel with-nav-tabs panel-default">' +
        '<div class="panel-heading">' +
        '<ul class="nav nav-tabs">' +
        ' <li class="active"><a href="#Ingredients' + recipe.Id + '" data-toggle="tab">Ingredients</a></li>' +
        ' <li><a href="#Steps' + recipe.Id + '" data-toggle="tab">Steps</a></li>' +
        ' <li><a href="#Video' + recipe.Id + '" data-toggle="tab">Video</a></li>' +
        '</ul>' +
        '</div>';

    var panelBody = '<div class="panel-body">' +
        ' <div class="tab-content">';

    var panelBodyIngredients = '<br/><div class="tab-pane fade in active" id="Ingredients' + recipe.Id + '">' +
        '<div class="row-fluid">' +
        '<div class="span8">' +
        '<span class="icon-time"></span> ' +
        '| <span class="text-muted"> Preparation Time: ' + recipe.PreparationTime + '</span> ' +
        '| <span class="text-muted"> Cooking Time: ' + recipe.CookingTime + '</span> ' +
        '<table class="table table-condensed table-responsive table-user-information" >' +
        '<tbody>' + createRecipeIngredientRows(recipe.RecipeIngredient) + '</tbody>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';

    var panelBodyRecipeSteps = '<div class="tab-pane fade" id="Steps' + recipe.Id + '">'
        + '<div class="row-fluid">'
        + '<div class="span12">'
        + ' <table class="table table-condensed table-responsive table-user-information">'
        + ' <tbody>'
        + createRecipeSteps(recipe.RecipeSteps)
        + '</tbody>'
        + '</table>'
        + '</div>'
        + '</div>'
        + '</div>';

    var panelBodyVideo = '';
    if (recipe.videoUrl !== null) {
        panelBodyVideo = '<div class="tab-pane fade" id="Video' + recipe.Id + '">'
            + '<iframe width= "560" height= "315" src= "' + recipe.videoUrl + '" frameborder= "0" allowfullscreen></iframe>'
            + '</div>';
    }


    var panelBodyCloseTags = "</div></div></div>";

    var panelFooter = '<div class="panel-footer">'
        + '<button class="btn btn-warning edit" type="button" id="Edit' + recipe.Id + '">'
        + '<i class="icon-edit icon-white"></i>'
        + '</button>'
        + '  <button class="btn btn-danger delete" type="button" id="Delete' + recipe.Id + '">'
        + '<i class="glyphicon glyphicon-trash"></i>'
        + '</button>'
        + '</div>';

    var panelContentclosingDivTags = "</div></div></div>";

    var recipe = topRow + panelContent + panelBody + panelBodyIngredients + panelBodyRecipeSteps + panelBodyVideo
        + panelBodyCloseTags + panelFooter + panelContentclosingDivTags;

    return recipe;
}

function createRecipeIngredientRows(ingredientList) {
    var ingredientRow = '';
    ingredientList.forEach(function (ingredient, index) {
        ingredientRow += '<tr>' +
            '<td>' + ingredient.Quantity + '</td>' +
            '<td>' + ingredient.Ingredient + '</td>' +
            '</tr>';
    })

    return ingredientRow;

}

function createRecipeSteps(steps) {
    var stepRow = '';
    steps.forEach(function (step, index) {
        stepRow += '<tr>' +
            '<td>' + step.StepDesc + '</td>' +
            '</tr>';
    })

    return stepRow;

}

function createNewRecipe() {
    var RecipeName = $("#RecipeName").val();
    var Description = $("#Description").val();
    var PreparationTime = $("#PreparationTime").val();
    var CookingTime = $("#CookingTime").val();
    var videoUrl = $("#videoUrl").val();

    var recipeIngredients = getNewRecipeIngredients();

    var recipeSteps = getNewRecipeSteps();

    var recipeModel = JSON.stringify({
        "RecipeName": RecipeName,
        "Description": Description,
        "PreparationTime": PreparationTime,
        "CookingTime": CookingTime,
        "videoUrl": videoUrl,
        "RecipeIngredient": recipeIngredients,
        "RecipeSteps": recipeSteps
    });
    $.ajax({
        url: "/Home/AddNewRecipe/",
        dataType: 'json',
        contentType: 'application/json',
        data: recipeModel,
        method: 'POST'
    }).done(function (recipe, status, xhr) {
        var recipeItem = createRecipeListItem(recipe);
        resetNewRecipeForm();
        $("#allRecipes").append(recipeItem);
        $("#allRecipes").show();
    }).error(function (xhr, status, error) {
        $("#error").show();
    });


}

function getNewRecipeIngredients() {
    var recipeIngredients = [];

    var ingredients = $("div[id^='NewIngredient']").length;

    for (i = 1; i <= ingredients; i++) {
        var recipeIngredient = {};
        recipeIngredient['Quantity'] = $("#Quantity" + i).val();
        recipeIngredient['Ingredient'] = $("#IngredientName" + i).val();
        recipeIngredients.push(recipeIngredient);
    }

    return recipeIngredients;

}

function getNewRecipeSteps() {
    var recipeSteps = [];
    $("textarea[id^='Step']").each(function (index) {
        if ($(this).val() != '') {
            var recipeStep = {};
            recipeStep['StepNo'] = index + 1;
            recipeStep['StepDesc'] = $(this).val();
            recipeSteps.push(recipeStep);
        }
    });

    return recipeSteps;
}

function deleteRecipe(recipeId) {
    $.ajax({
        url: "/Home/DeleteRecipe/",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ 'id': recipeId }),
        method: 'POST'
    }).done(function (responseJSON, status, xhr) {
        $("#recipeRow" + recipeId).remove();
    }).error(function (xhr, status, error) {
        $("#error").show();
    });
}

function resetNewRecipeForm() {
    $("#newRecipeDiv").hide();
    $('#newRecipeForm')[0].reset();
    $("#progressbar li").each(function () {
        $(this).removeClass("active");
    });
    $("fieldset").each(function () {
        $(this).css("transform", "scale(1)");
    });
    $("#progressbar li:first").addClass("active");
    $("#newRecipeModel").css({ "display": "block", "opacity": "1" });
    $("#newRecipeIngredients").css("display", "none");
    $("#newRecipeSteps").css("display", "none");

    //remove extra ingredient divs
    var ingredients = $("div[id^='NewIngredient']").length;
    for (i = 2; i <= ingredients; i++) {
        $("#NewIngredient" + i).remove();
    }

    var steps = $("textarea[id^='Step']").length;
    for (i = 2; i <= steps; i++) {
        $("#Step" + i).remove();
    }

}

function showSearchedRecipes(recipeKeyWord) {
    allRecipes.forEach(function (recipe, index) {
        if (recipe.RecipeName.includes(recipeKeyWord)) {
            $("#recipeRow" + recipe.Id).show();
        } else {
            $("#recipeRow" + recipe.Id).hide();
        }
    });
    return false;
}

function editRecipe(id) {
    var recipeID = id.substring(4, id.length);
    $.ajax({
        url: "/home/Edit/" + recipeID,
        dataType: 'json',
        contentType: 'application/json',
        method: 'GET'
    }).done(function (recipeForEdit, status, xhr) {
        var editedRecipeForm = editRecipeListItem(recipeForEdit);
        $(editedRecipeForm).insertAfter("#allRecipes");
        hideOtherRecipes(recipeID);
    });

    return false;
}


    function editRecipeListItem(recipe) {
        var recipe =
            '<form class="editRecipeForm">'
            + '<a href="" class="btn btn-danger cancelNewRecipe" style="float:right">x</a>'
            + '<ul class="progressbarEdit"><li class="active">Recipe Details</li><li>Ingredients</li><li>Steps</li></ul>'
            + '<fieldset id="editRecipeModel"><h2 class="fs-title">Recipe Details</h2>'
            + '<h3 class="fs-subtitle" > What to cook?</h3>'
            + '<input type="text" name="RecipeName" placeholder="Recipe Name" id="EditRecipeName' + recipe.Id + '" value="' + recipe.RecipeName + '">'
            + '<textarea name="Description" placeholder="Description" id="EditDescription' + recipe.Id + '">' + recipe.Description + ' </textarea>'
            + '<input type="text" name="PreparationTime" placeholder="Preparation Time" id="EditPreparationTime' + recipe.Id + '" value="' + recipe.PreparationTime + '">'
            + '<input type="text" name="CookingTime" placeholder="Cooking Time" id="EditCookingTime' + recipe.Id + '" value="' + recipe.CookingTime + '">'
            + '<input type="text" name="videoUrl" placeholder="Embed YouTube Video" id="EditvideoUrl' + recipe.Id + '" value="' + recipe.videoUrl + '">'
            + '<input type="button" name="next" class="next action-button nextRecipeModel" value="Next">'
            + '</fieldset>'
            + createIngredientFieldSet(recipe)
            + createRecipeFieldSet(recipe)
            + '</form>';

        return recipe;
    }

    function createIngredientFieldSet(recipe) {
        var ingredientFieldSet = '<fieldset id="EditRecipeIngredients' + recipe.Id + '" style="transform: scale(1); display: none;">'
            + ' <h2 class="fs-title">Ingredients</h2>'
            + '<h3 class="fs-subtitle">What to buy?</h3>'
            + createIngredientEditDiv(recipe)
            + '<button type="button" class="btn btn-default btn-sm editAddIngredient"><span class="glyphicon glyphicon-plus-sign"></span> Add another ingredient</button>'
            + '<input type="button" name="previous" class="previous action-button" value="Previous">'
            + '<input type="button" name="next" class="next action-button" value="Next">'
            + '</fieldset>';
        return ingredientFieldSet;
    }

    function createIngredientEditDiv(recipe) {
        var ingredientEditDiv = '';
        recipe.RecipeIngredient.forEach(function (ingredient) {
            ingredientEditDiv = ingredientEditDiv + '<div id="EditIngredient' + ingredient.Id + '">'
                + '<input type="text" id="EditQuantity' + ingredient.Id + '" placeholder="Quantity" style="width:40%" value="' + ingredient.Quantity + '">'
                + '<input type="text" id="EditIngredientName' + ingredient.Id + '" placeholder="Ingredient" style="width:40%" value="' + ingredient.Ingredient + '">'
                + '<input type="hidden" id="ingredientId' + ingredient.Id + '"value="' + ingredient.Id + '">'
                + ' </div>';
        });
        return ingredientEditDiv;
    }

    function createRecipeFieldSet(recipe) {
        var recipeFieldSet = '<fieldset id="EditRecipeSteps' + recipe.Id + '">'
            + '<h2 class="fs-title">Steps</h2>'
            + '<h3 class="fs-subtitle">What to do?</h3>'
            + createRecipeStepEditTexts(recipe)
            + '<button type="button" class="btn btn-default btn-sm" id="addEditStep"><span class="glyphicon glyphicon-plus-sign"></span> Add another step</button>'
            + '<input type="button" name="previous" class="previous action-button" value="Previous">'
            + '<input id="EditRecipe' + recipe.Id + '" type="submit" name="submit" class="submit submitEdit action-button" value="Submit">'
            + '</fieldset>';
        return recipeFieldSet;
    }

    function createRecipeStepEditTexts(recipe) {
        var recipeStepEditTexts = '';
        recipe.RecipeSteps.forEach(function (step) {
            recipeStepEditTexts = recipeStepEditTexts + '<textarea name="EditStep' + step.StepNo + '"  id="Step' + step.Id + '">' + step.StepDesc + '</textarea>';
        });
        return recipeStepEditTexts;
    }

    function validateRecipeModel() {

        var validForm = new Boolean(true);

        if ($.trim($("[id*= 'RecipeName']").val()) == '') {
            $("[id *= 'RecipeName']").addClass("invalid");
            validForm = false;
        } else {
            $("[id *= 'RecipeName']").removeClass("invalid");
        }
        if ($.trim($("[id*='Description']").val()) == '') {
            $("[id*='Description']").addClass("invalid");
            validForm = false;
        } else {
            $("[id*='Description']").removeClass("invalid");
        }
        if ($.trim($("[id*='PreparationTime']").val()) == '') {
            $("[id*='PreparationTime']").addClass("invalid");
            validForm = false;
        } else {
            $("[id*='PreparationTime']").removeClass("invalid");
        }
        if ($.trim($("[id*='CookingTime']").val()) == '') {
            $("[id*='CookingTime']").addClass("invalid");
            validForm = false;
        } else {
            $("[id*='CookingTime']").removeClass("invalid");
        }

        if ($.trim($("[id*='videoUrl']").val()) != '') {
            var video = $.trim($("[id*='videoUrl']").val());
            var validUrl = true;
            if (!validUrl) {
                $("[id*='videoUrl']").addClass("invalid");
                validForm = false;
            } else {
                $("[id*='videoUrl']").removeClass("invalid");
            }

        } else {
            $("[id*='videoUrl']").removeClass("invalid");
        }

        return validForm;

    }


    function checkEmptyRow() {
        var empty = false;
        var lastIngredientRow = $("#newRecipeIngredients div").last().attr("id");
        $("#" + lastIngredientRow + " input").each(function () {
            if ($.trim($(this).val()) == '') {
                $($(this)).addClass("invalid");
                empty = true;
            } else {
                $($(this)).removeClass("invalid");
            }
        });

        return empty;
    }

    function validateIngredients() {
        var valid = true;
        var firstIngredientRow = $("#newRecipeIngredients div").first().attr("id");
        $("#" + firstIngredientRow + " input").each(function () {
            if ($.trim($(this).val()) == '') {
                $($(this)).addClass("invalid");
                valid = false;
            } else {
                $($(this)).removeClass("invalid");
            }
        });

        return valid;
    }

    function checkEmptyStep() {
        var empty = false;
        var lastStep = $("#newRecipeSteps textarea").last();
        if ($.trim(lastStep.val()) == '') {
            $(lastStep).addClass("invalid");
            empty = true;
        } else {
            $(lastStep).removeClass("invalid");
        }
        return empty;
    }

function checkEmptyStepEdit(id) {
    var idForEdit = id.substring(15, id.length);
    var empty = false;
    var lastStep = $("#EditRecipeSteps" + idForEdit +" textarea").last();
    if ($.trim(lastStep.val()) == '') {
        $(lastStep).addClass("invalid");
        empty = true;
    } else {
        $(lastStep).removeClass("invalid");
    }
    return empty;
}

    function validateSteps() {
        var valid = true;
        var firstStep = $("#newRecipeSteps textarea").first();
        if ($.trim(firstStep.val()) == '') {
            $(firstStep).addClass("invalid");
            firstStep = false;
        } else {
            $(firstStep).removeClass("invalid");
        }
        return valid;
    }

    function hideOtherRecipes(id) {
        $("[id*= 'recipeRow']").each(function () {
            $(this).hide();
        });
    }

    function editRecipeAjaxCall(recipe) {
        var id = recipe.substring(10, recipe.length);
        var RecipeName = $("#EditRecipeName" + id).val();
        var Description = $("#EditDescription" + id).val();
        var PreparationTime = $("#EditPreparationTime" + id).val();
        var CookingTime = $("#EditCookingTime" + id).val();
        var videoUrl = $("#EditvideoUrl" + id).val();

        var recipeIngredients = getEditRecipeIngredients();

        var recipeSteps = getEditRecipeSteps();

        var recipeModel = JSON.stringify({
            "RecipeName": RecipeName,
            "Description": Description,
            "PreparationTime": PreparationTime,
            "CookingTime": CookingTime,
            "videoUrl": videoUrl,
            "RecipeIngredient": recipeIngredients,
            "RecipeSteps": recipeSteps

        });
        $.ajax({
            url: "/Home/Edit/" + id,
            dataType: 'json',
            contentType: 'application/json',
            data: recipeModel,
            method: 'POST'
        }).done(function (recipe, status, xhr) {
            window.location.reload(true);
        }).error(function (xhr, status, error) {
            $("#error").show();
        });

        console.log(recipeModel);
    }

function checkEmptyRowEdit(id) {
    var idForEdit = id.substring(21, id.length);
    var empty = false;
    var row = ("#EditRecipeIngredients" + idForEdit + " div");
    var lastIngredientRow = $(row).last().attr("id");
    $("#" + lastIngredientRow + " input").each(function () {
        if ($.trim($(this).val()) == '') {
            $($(this)).addClass("invalid");
            empty = true;
        } else {
            $($(this)).removeClass("invalid");
        }
    });

    return empty;
}

function getEditRecipeIngredients() {
    var recipeIngredients = [];

    var ingrDiv = $("div[id^='EditIngredient']").each(function () {
        var recipeIngredient = {};
        var id = $(this).attr("id");
        var qnty = "#EditQuantity" + id.substring(14, id.length);
        var ingrdt = "#EditIngredientName" + id.substring(14, id.length);
        if ($("#ingredientId" + id.substring(14, id.length)).length) {
            recipeIngredient['Id'] = id.substring(14, id.length);
        }
        recipeIngredient['Quantity'] = $(qnty).val();
        recipeIngredient['Ingredient'] = $(ingrdt).val();
        recipeIngredients.push(recipeIngredient);
    });


    return recipeIngredients;
}

function getEditRecipeSteps() {
    var recipeSteps = [];

    $("textarea[name^='EditStep']").each(function (index) {
        if ($(this).val() != '') {
            var recipeStep = {};
            if ($(this).attr("id")) {
                recipeStep['Id'] = $(this).attr("id").substring(4, $(this).attr("id").length);
            }
            recipeStep['StepNo'] = index + 1;
            recipeStep['StepDesc'] = $(this).val();
            recipeSteps.push(recipeStep);
        }
    });

    return recipeSteps;

}