function updateTable() {
  $("#exercise-table-body").empty();
  let programID =
    window.location.pathname.split("/")[window.location.pathname.split.length];
  $.ajax({
    url: "/workoutProgram/" + programID,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
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

$(document).ready(function () {
  updateTable();
});
