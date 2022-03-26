$("#login-register-toggle-button").click(function (event) {
  event.preventDefault();
  $("#register-form").show();
  $("#login-form").hide();

  $("#alert-danger").hide();
  $("#alert-success").hide();
});

$("#register-login-toggle-button").click(function (event) {
  event.preventDefault();
  $("#register-form").hide();
  $("#login-form").show();

  $("#alert-danger").hide();
  $("#alert-success").hide();
});

$("#submit-login").click(function (event) {
  event.preventDefault();

  // logout user, if already logged in
  $.ajax({
    url: "/logout",
    type: "GET",
    contentType: "application/json",
  });
  let u = {};

  if (
    $("#login-email-input").val() == "" ||
    $("#login-password-input").val() == ""
  ) {
    $("#alert-danger").text("Please fill in all required information");
    $("#alert-danger").show();
  } else {
    u.email = $("#login-email-input").val();
    u.password = $("#login-password-input").val();

    $.ajax({
      url: "/auth/local",
      type: "POST",
      data: JSON.stringify(u),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
        if (response._id != undefined) {
          window.location.replace("/dashboard");
        } else {
          $("#alert-danger").text("Incorrect credentials");
          $("#alert-danger").show();
        }
      },
      error: function (xhr, status, error) {
        var errorMessage = xhr.status + ": " + xhr.statusText;
        alert("Error - " + errorMessage);
      },
    });
  }
});

$("#submit-register").click(function (event) {
  event.preventDefault();
  // logout user, if already logged in
  $.ajax({
    url: "/logout",
    type: "GET",
    contentType: "application/json",
  });
  let u = {};

  if (
    $("#register-email-input").val() == "" ||
    $("#register-username-input").val() == "" ||
    $("#register-password-input").val() == "" ||
    $("#confirm-password").val() == ""
  ) {
    $("#alert-danger").text("Please fill in all required information");
    $("#alert-danger").show();
  } else {
    u.username = $("#register-username-input").val();
    u.email = $("#register-email-input").val();
    u.password = $("#register-password-input").val();
    confirmPassword = $("#confirm-password").val();
    if (u.password == confirmPassword) {
      $.ajax({
        url: "/user",
        type: "POST",
        data: JSON.stringify(u),
        contentType: "application/json",
        success: function (response) {
          console.log(response);
          if (response.success) {
            $("#alert-danger").hide();
            $("#alert-success").text(
              "Your account was created. Please log in."
            );
            $("#alert-success").show();
          } else {
            if ("message" in response) {
              $("#alert-danger").text(response.message);
              $("#alert-danger").show();
            } else {
              $("#alert-danger").text()
              response.message.forEach((e) => {
                $("#alert-danger").append(e);
                $("#alert-danger").show();
              });
            }
          }
        },
        error: function (xhr, status, error) {
          var errorMessage = xhr.status + ": " + xhr.statusText;
          alert("Error - " + errorMessage);
        },
      });
    } else {
      $("#alert-danger").text("Passwords does not match");
      $("#alert-danger").show();
    }
  }
});

$("#google-button").click(function (event) {
  event.preventDefault();
  window.location.replace("/auth/google");
});
