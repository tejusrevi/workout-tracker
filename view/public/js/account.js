$(document).ready(function () {
  $.ajax({
    url: "/user",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#email").text(response.email);
      $("#email-input").text(response.email);
      $("#username").text(response.username);
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

$("#edit-account-button").click(function (event) {
  event.preventDefault();
  $("#account-alert-success").hide();
  $("#account-alert-danger").hide();
  $("#view-account").hide();
  $("#edit-account").show();

  $.ajax({
    url: "/user",
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $("#username-input").val(response.username);

      updateBMI(response.personalInfo.height, response.personalInfo.weight);
      updateGoal(
        response.personalInfo.weight,
        response.personalInfo.goalWeight
      );
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});

$("#save-account-button").click(function (event) {
  event.preventDefault();
  $("#account-alert-success").hide();
  $("#account-alert-danger").hide();

  let updatedUser = {};
  if ($("#username-input").val() != "" && $("#password-input").val()) {
    updatedUser.username = $("#username-input").val();
    updatedUser.password = $("#password-input").val();

    $.ajax({
      url: "/user",
      type: "PUT",
      data: JSON.stringify(updatedUser),
      contentType: "application/json",
      success: function (response) {
        $("#account-alert-success").text(
          "Account updated. You will be logged out in 5 seconds"
        );
        $("#account-alert-success").show();
        $("#account-alert-danger").hide();
        setInterval(function () {
          window.location.replace("/");
        }, 3000);
      },
      error: function (xhr, status, error) {
        var errorMessage = xhr.status + ": " + xhr.statusText;
        alert("Error - " + errorMessage);
      },
    });
  } else {
    $("#account-alert-danger").text("Please enter a username and password.");
    $("#account-alert-danger").show();
  }
});

$("#confirm-account-delete").click(function (event) {
  console.log("here");
  $.ajax({
    url: "/user",
    type: "DELETE",
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      window.location.replace("/");
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
});
