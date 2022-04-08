/*
* This function updates the table containing exercises in the Public Workout program view page
*/
function updateTable() {
  //initailly set to empty
  $("#exercise-table-body").empty();
  //get the workout program id via the end point variable
  let programID =
    window.location.pathname.split("/")[window.location.pathname.split.length];
  //make a GET request and get the selected workout program
  $.ajax({
    url: "/workoutProgram/" + programID,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
    //add every exercise in the program to the table
    //exercise names are implemented as buttons, which when clicked display a modal showing the exercise
      $("#name-of-program").text(response.nameOfProgram);
      response.exercises.forEach((element) => {
        $("#exercise-table-body").append(
          `
          <tr>
          <td>${element.exercise.name}</td>
          <td>${element.numSets}</td>
          <td>${element.numReps}</td>
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

/*
* Function to execute when DOM is loaded
*/
$(document).ready(function () {
  updateTable();
});
