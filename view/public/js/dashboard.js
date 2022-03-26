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
