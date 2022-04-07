let exercises;

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

function updateModal(exerciseID){
  $.ajax({
    url: "/exercise/" + exerciseID,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      $('#exercise-name').text(response.name);
      $('#exercise-image').attr("src",response.gifUrl);
      $('#body-part').text(response.bodyPart);
      $('#equipment').text(response.equipment);
      $('#target-muscle').text(response.target);
    },
    error: function (xhr, status, error) {
      var errorMessage = xhr.status + ": " + xhr.statusText;
      alert("Error - " + errorMessage);
    },
  });
}
function handleSuggestionSelect(objButton) {
  $("#suggestion-container").empty();
  $('#exerciseInfoModal').modal('toggle')
  updateModal(objButton.value)
}

function updateSuggestions(list) {
  $("#search-bar-suggestion-container").empty();
  list.forEach((element) => {
    $("#search-bar-suggestion-container").append(`
    <button type="button" class="btn btn-link exercise-suggestion" value="${element.id}" onclick="handleSuggestionSelect(this)">${element.name}</button>
    `);
  });
}

$("#search-bar").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  if (value.length > 3) {
    let filteredList = exercises.filter((element) => {
      return element.name.includes(value);
    });
    updateSuggestions(filteredList);
  } else {
    $("#search-bar-suggestion-container").empty();//TODO
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
