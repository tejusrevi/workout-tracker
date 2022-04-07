function deleteProgram(objButton) {
  $.ajax({
    url: "/workoutProgram/" + objButton.value,
    type: "DELETE",
    contentType: "application/json",
    success: function (response) {
      getWorkoutProgramsByUser();
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}

function getWorkoutProgramsByUser() {
  $.ajax({
    url: "/user/workoutprograms",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#programs-by-user").empty();
      if (response.length == 0) {
        $("#programs-by-user").text("You do not have any programs created");
      } else {
        response.forEach((element) => {
          $("#programs-by-user").append(
            `<div class="card" style="width: 15rem; overflow: hidden">\
              <div style="height: 150px; background-image: linear-gradient(135deg, #72a9df, #021E80)"></div>\
              <div class="card-body">\
                <h5 class="card-title program-name">${
                  element.nameOfProgram
                }</h5>\
                <p class="card-text program-link" style="font-size: small; opacity: 0.9;">${
                  element.isPublic ? "Public" : "Private"
                }</p>\
                <a href="/workout-program/${
                  element._id
                }" target="_blank" class="btn btn-primary">View</a>\
                <button class="btn btn-danger" value=${
                  element._id
                } onclick="deleteProgram(this)">Delete</button>\
              </div>\
            </div>`
          );
        });
      }
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}
$(document).ready(function () {
  $.ajax({
    url: "/user",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#greeting-username").text(response.username);
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });

  getWorkoutProgramsByUser();

  $.ajax({
    url: "/workoutprogram",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      console.log(response.length);
      response.forEach((element) => {
        $("#public-programs").append(
          `<div class="card" style="width: 15rem;">\
              <div style="height: 150px; background-image: linear-gradient(135deg, #72a9df, #021E80)"></div>\
              <div class="card-body">\
                <h5 class="card-title program-name">${element.nameOfProgram}</h5>\
                <a href="/workout-program/${element._id}" target="_blank" class="btn btn-primary">View</a>\
              </div>\
            </div>`
        );
      });
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

$("#add-new-program").click(function (event) {
  event.preventDefault();

  let workoutProgram = {};
  if ($("#name-of-program-input").val() != "") {
    workoutProgram.nameOfProgram = $("#name-of-program-input").val();
    if ($("#is-public-input").prop("checked")) {
      workoutProgram.isPublic = 1;
    } else {
      workoutProgram.isPublic = 0;
    }
    $.ajax({
      url: "/workoutProgram",
      type: "POST",
      data: JSON.stringify(workoutProgram),
      contentType: "application/json",
      success: function (response) {
        getWorkoutProgramsByUser();
        $("#addNewWorkoutProgram").modal("hide");
      },
      error: function (xhr, status, error) {
        var errorMessage = xhr.status + ": " + xhr.statusText;
        alert("Error - " + errorMessage);
      },
    });
  }
});
