let exercises;
let selectedID;

function handleSuggestionSelect(objButton) {
  $("#suggestion-container").empty();
  selectedID = objButton.value;
}

function handleExerciseClick(objButton){
  $.ajax({
    url: "/exercise/" + objButton.value,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $('#exercise-name').text(response.name);
      $('#exercise-image').attr("src",response.gifUrl);
      $('#body-part').text(response.bodyPart);
      $('#equipment').text(response.equipment);
      $('#target-muscle').text(response.target);

      $('#exerciseInfoModal').modal('toggle')
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}

function handleDelete(objButton) {
  $("#suggestion-container").empty();
  let programID =
    window.location.pathname.split("/")[window.location.pathname.split.length];
  $.ajax({
    url:
      "/workoutProgram/removeExercise/" +
      programID +
      "?exerciseID=" +
      objButton.value,
    type: "PUT",
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      updateTable();
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
    <button type="button" class="btn btn-link exercise-suggestion" value="${element.id}" onclick="handleSuggestionSelect(this)">${element.name}</button>
    `);
  });
}

function updateWorkoutProgramInfo(response) {
  $("#name-of-program").text(response.nameOfProgram);
  $("#name-side-panel").text(response.nameOfProgram);
  $("#is-public-side-panel").text(response.isPublic ? "Public" : "Private");
}

function updateTable() {
  $("#exercise-table-body").empty();
  let programID =
    window.location.pathname.split("/")[window.location.pathname.split.length];
  $.ajax({
    url: "/workoutProgram/" + programID,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      updateWorkoutProgramInfo(response);
      response.exercises.forEach((element) => {
        console.log(element);
        $("#exercise-table-body").append(
          `
          <tr>
          <td>
            <button type="button" class="btn btn-link" value=${element.exercise.id} onclick="handleExerciseClick(this)">
              ${element.exercise.name}
            </button>
          </td>
          <td>${element.numSets}</td>
          <td>${element.numReps}</td>
          <td>
            <button type="button" class="btn btn-danger" value="${element.exercise.id}" onclick="handleDelete(this)">
              <i class="bi bi-trash-fill"></i>Delete
            </button>
          </td>
        </tr>
          `
        );
      });
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}

$(document).ready(function () {
  updateTable();
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
  if (value.length > 1) {
    let filteredList = exercises.filter((element) => {
      return element.name.includes(value);
    });

    updateSuggestions(filteredList);
  } else {
    $("#suggestion-container").empty();
  }
});

$("#add-exercise").click(function (event) {
  event.preventDefault();
  if (
    $("#sets-input").val() != "" &&
    $("#reps-input").val() != "" &&
    selectedID != null
  ) {
    let exerciseData = {};
    exerciseData.exerciseID = selectedID;
    exerciseData.numSets = $("#sets-input").val();
    exerciseData.numReps = $("#reps-input").val();
    let programID =
      window.location.pathname.split("/")[
        window.location.pathname.split.length
      ];
    $.ajax({
      url: "/workoutProgram/addExercise/" + programID,
      type: "PUT",
      data: JSON.stringify(exerciseData),
      contentType: "application/json",
      success: function (response) {
        updateTable();
      },
      error: function (xhr, status, error) {
        var errorMessage = xhr.status + ": " + xhr.statusText;
        alert("Error - " + errorMessage);
      },
    });
  } else {
    alert("Please fill in all details");
  }
});

$("#edit-program-info").click(function (event) {
  event.preventDefault();
  $("#view-side-panel").hide();
  $("#edit-side-panel").show();
});

$("#save-program-info").click(function (event) {
  event.preventDefault();
  let workoutProgram = {};
  if ($("#name-side-panel-input").val() != "") {
    workoutProgram.nameOfProgram = $("#name-side-panel-input").val();
    if ($("#is-public-side-panel-input").prop("checked")) {
      workoutProgram.isPublic = 1;
    } else {
      workoutProgram.isPublic = 0;
    }
    let programID =
    window.location.pathname.split("/")[window.location.pathname.split.length];
    $.ajax({
      url: "/workoutProgram/" + programID,
      type: "PUT",
      data: JSON.stringify(workoutProgram),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        updateTable();

        $("#view-side-panel").show();
        $("#edit-side-panel").hide();
      },
      error: function (xhr, status, error) {
        var errorMessage = xhr.status + ": " + xhr.statusText;
        alert("Error - " + errorMessage);
      },
    });
  } else {
  }
});
