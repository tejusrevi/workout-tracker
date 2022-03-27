let exercises;
let selectedExercise;

function f1(objButton){  
  $("#suggestion-container").empty();
  $.ajax({
    url: "/exercise/" + objButton.value,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#add-exercise-search").val(response.name)
      selectedExercise = response;
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}

function updateSuggestions(list) {
  $("#suggestion-container").empty();
  list.forEach((element) => {
    $("#suggestion-container").append(`
    <button type="button" class="btn btn-link exercise-suggestion" value="${element.id}" onclick="f1(this)">${element.name}</button>
    `);
  });
}

$(document).ready(function () {
  $.ajax({
    url: "/exercise",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      exercises = response;
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

$("#add-exercise-search").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  if (value.length > 3) {
    let filteredList = exercises.filter((element) => {
      return element.name.includes(value);
    });
    updateSuggestions(filteredList);
    console.log(filteredList);
  }else{
    $("#suggestion-container").empty();
  }
});

$("#add-exercise").click(function (event) {
  event.preventDefault();
  if ($("#sets-input").val() != "" && $("#reps-input").val() != "" && selectedExercise != null){
    console.log("worked")
  }else{
    console.log("error")
  }
});