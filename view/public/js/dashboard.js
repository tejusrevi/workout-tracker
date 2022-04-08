var exercises = [];

var searchBarInput = "";
var bodyPartInput = "none";
var equipmentInput = "none";
var targetMuscleInput = "none";

var listOfBodyParts = [];
var listOfTargetMuscles = [];
var listOfEquipments = [];

$(document).ready(function () {
  $.ajax({
    url: "/exercise",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      exercises = response;

      exercises.forEach((exercise) => {
        if (!listOfBodyParts.includes(exercise.bodyPart)) {
          listOfBodyParts.push(exercise.bodyPart);
        }
        if (!listOfTargetMuscles.includes(exercise.target)) {
          listOfTargetMuscles.push(exercise.target);
        }
        if (!listOfEquipments.includes(exercise.equipment)) {
          listOfEquipments.push(exercise.equipment);
        }
      });

      listOfBodyParts.forEach((bodyPart) => {
        $("#body-part-select").append(
          `
          <option value="${bodyPart}">${bodyPart}</option>
          `
        );
      });
      listOfEquipments.forEach((equipment) => {
        $("#equipment-select").append(
          `
          <option value="${equipment}">${equipment}</option>
          `
        );
      });
      listOfTargetMuscles.forEach((targetMuscle) => {
        $("#target-muscle-select").append(
          `
          <option value="${targetMuscle}">${targetMuscle}</option>
          `
        );
      });
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

function updateModal(exerciseID) {
  $.ajax({
    url: "/exercise/" + exerciseID,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#exercise-name").text(response.name);
      $("#exercise-image").attr("src", response.gifUrl);
      $("#body-part").text(response.bodyPart);
      $("#equipment").text(response.equipment);
      $("#target-muscle").text(response.target);
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}
function handleSuggestionSelect(objButton) {
  $("#exerciseInfoModal").modal("toggle");
  updateModal(objButton.value);
}

function updateSuggestions(list) {
  $("#search-bar-suggestion-container").empty();
  list.forEach((element) => {
    $("#search-bar-suggestion-container").append(`
    <button type="button" class="btn btn-link exercise-suggestion" value="${element.id}" onclick="handleSuggestionSelect(this)">${element.name}</button>
    `);
  });
}

$(".filter").on("change", function () {
  if (this.id == "body-part-select") {
    bodyPartInput = this.value;
  } else if (this.id == "equipment-select") {
    equipmentInput = this.value;
  } else if (this.id == "target-muscle-select") {
    targetMuscleInput = this.value;
  }
  filterExercises()
});

$("#search-bar").on("keyup", function () {
  $("#filters").show();
  searchBarInput = $(this).val().toLowerCase();
  if (searchBarInput.length > 1) {
    filterExercises();
  } else {
    $("#search-bar-suggestion-container").empty();
  }
});

$("#home-nav").click(function (event) {
  event.preventDefault();
  $("#home").show();
  $("#body-metrics").hide();
  $("#account").hide();
  $("#about").hide();

  $(".link-dark").removeClass("active");
  $("#home-nav").addClass("active");
});

$("#body-metrics-nav").click(function (event) {
  event.preventDefault();
  $("#home").hide();
  $("#body-metrics").show();
  $("#account").hide();
  $("#about").hide();

  $(".link-dark").removeClass("active");
  $("#body-metrics-nav").addClass("active");
});

$("#account-nav").click(function (event) {
  event.preventDefault();
  $("#home").hide();
  $("#body-metrics").hide();
  $("#account").show();
  $("#about").hide();

  $(".link-dark").removeClass("active");
  $("#account-nav").addClass("active");
});

$("#about-nav").click(function (event) {
  event.preventDefault();
  $("#home").hide();
  $("#body-metrics").hide();
  $("#account").hide();
  $("#about").show();

  $(".link-dark").removeClass("active");
  $("#about-nav").addClass("active");
});

$("#close-suggestions").click(function (event) {
  $("#search-bar-suggestion-container").empty();
  $("#filters").hide();
});

$("#logout").click(function (event) {
  $.ajax({
    url: "/logout",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      window.location.replace("/");
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

function filterExercises() {
  let filteredList = exercises.filter((element) => {
    let nameMatch = element.name.includes(searchBarInput);

    let bodyPartMatch = true;
    let equipmentMatch = true;
    let targetMuscleMatch = true;

    if (bodyPartInput != 'none'){
      bodyPartMatch = bodyPartInput == element.bodyPart;
    }
    if (equipmentInput != 'none'){
      equipmentMatch = equipmentInput == element.equipment;
    }
    if (targetMuscleInput != 'none'){
      targetMuscleMatch = targetMuscleInput == element.target;
    }
    return nameMatch && bodyPartMatch && equipmentMatch && targetMuscleMatch;
  });
  updateSuggestions(filteredList);
}
